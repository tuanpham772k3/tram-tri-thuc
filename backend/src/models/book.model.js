const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new mongoose.Schema(
  {
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
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

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      maxLength: 1000,
    },

    genre: {
      type: String,
      required: true,
      enum: [
        "ky-nang-song",
        "tam-ly-hoc",
        "khai-tam",
        "tieu-thuyet",
        "vh-xh",
        "kinh-doanh",
        "ngon-tinh",
      ],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    purchaseCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      // Tự động làm tròn đến 1 chữ số thập phân (ví dụ: 4.3456 -> 4.3)
      set: (v) => Math.round(v * 10) / 10,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
