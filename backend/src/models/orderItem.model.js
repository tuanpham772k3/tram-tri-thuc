const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookTitle: {
      type: String,
      required: true,
    },

    bookAuthor: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

orderItemSchema.index({ sellerId: 1, orderId: 1 }, { unique: true });

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
