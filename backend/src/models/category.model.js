const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      maxLength: 500,
    },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
