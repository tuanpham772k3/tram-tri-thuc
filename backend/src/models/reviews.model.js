const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewsSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
);

reviewsSchema.index(
  {
    userId: 1,
    bookId: 1,
    score: 1,
  },
  { unique: true }
);

const Reviews = mongoose.model("Reviews", reviewsSchema);

module.exports = Reviews;
