const mongoose = require("mongoose");
const { Schema } = mongoose;

const librarySchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    purchasedAt: {
      type: Date,
      default: null,
    },

    lastReadAt: {
      type: Date,
      default: null,
    },

    // Lưu chuỗi định vị CFI của EpubJS (Ví dụ: "epubcfi(/6/4...")
    lastLocation: {
      type: String,
      default: null,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Đảm bảo 1 customer không bị tạo 2 dòng cho cùng 1 cuốn sách
librarySchema.index({ customerId: 1, bookId: 1 }, { unique: true });

const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
