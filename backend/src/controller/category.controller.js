const Category = require("../models/category.model");
const { asyncHandler, sendSuccess } = require("../utils/helper");

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .select("name slug description createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return sendSuccess(res, categories, "Lấy danh sách danh mục thành công.");
});
