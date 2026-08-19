const mongoose = require("mongoose");
const { Schema } = mongoose;

const documentSchema = new mongoose.Schema(
  {
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      type: String,
      maxLength: 1000,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "video/mp4",
        "video/webm",
        "audio/mpeg",
        "audio/wav",
        "text/plain",
        "application/zip",
        "application/x-rar-compressed",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    format: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        required: true,
        maxLength: 50,
      },
    ],

    viewCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

documentSchema.index({ title: "text", description: "text", tags: "text" });
documentSchema.index({
  categoryId: 1,
  uploaderId: 1,
  status: 1,
  accessLevel: 1,
});

const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);

module.exports = Document;
