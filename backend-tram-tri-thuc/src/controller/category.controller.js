const Category = require("../models/category.model");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .select("name slug description createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách danh mục.",
    });
  }
};
