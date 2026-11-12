const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    items: [
      {
        _id: false,

        bookId: {
          type: Schema.Types.ObjectId,
          ref: "Book",
        },

        isSelected: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
