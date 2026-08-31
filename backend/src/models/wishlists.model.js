const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
        require: true,
      },
    ],
  },
  { timestamps: true }
);

const Wishlists = mongoose.model("Wishlists", wishlistsSchema);

module.exports = Wishlists;
