const mongoose = require("mongoose");
const { Schema } = mongoose;

const librariesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      require: true,
    },

    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      require: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      require: true,
    },

    purchasedAt: {
      type: Date,
      default: null,
    },

    lastReadAt: {
      type: Date,
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

const Libraries = mongoose.model("Libraries", librariesSchema);

module.exports = Libraries;
