const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    documentId: {
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
      trim: true,
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.index(
  {
    userId: 1,
    documentId: 1,
    score: 1,
  },
  { unique: true }
);

const Rating = mongoose.models.Rating || mongoose.model("Rating", ratingSchema);

module.exports = Rating;
