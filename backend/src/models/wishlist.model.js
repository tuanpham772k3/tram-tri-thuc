const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

wishlistSchema.index({ userId: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
