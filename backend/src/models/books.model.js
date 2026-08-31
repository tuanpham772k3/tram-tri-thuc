const mongoose = require("mongoose");
const { Schema } = mongoose;

const booksSchema = new mongoose.Schema(
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

    author: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      maxLength: 1000,
    },

    coverUrl: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: String,

    viewCount: {
      type: Number,
      default: 0,
    },

    downloadCount: {
      type: Number,
      default: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

booksSchema.index({ title: "text", description: "text" });
booksSchema.index({
  categoryId: 1,
  uploaderId: 1,
  status: 1,
});

const Books = mongoose.model("Books", booksSchema);

module.exports = Books;
