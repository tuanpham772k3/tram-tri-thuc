const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // Slug của danh mục
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;