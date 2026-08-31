const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriesSchema = new Schema(
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

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

categoriesSchema.index({ slug: 1 });

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;
