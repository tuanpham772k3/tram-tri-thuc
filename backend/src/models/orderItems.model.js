const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemsSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      require: true,
    },

    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      require: true,
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const OrderItems = mongoose.model("OrderItems", orderItemsSchema);

module.exports = OrderItems;
