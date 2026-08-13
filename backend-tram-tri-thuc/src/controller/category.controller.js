const mongoose = require("mongoose");
const Category = require("../models/category.model");
const Document = require("../models/document.model");
const slugify = require("slugify");
const { getPagination, getPagingData } = require("../utils/paginate");

// Hàm validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Validation
    if (isNaN(page) || page < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Trang phải là số nguyên dương." });
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Giới hạn phải từ 1 đến 100." });
    }

    const { skip } = getPagination({ page, limit });
    const categories = await Category.find()
      .select("name slug description createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    const total = await Category.countDocuments();
    const pagingData = getPagingData(categories, total, Number(page), Number(limit));

    res.status(200).json({ success: true, data: pagingData });
  } catch (error) {
    console.log(`Get categories error: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy danh sách danh mục." });
  }
};

// GET /api/categories/:slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      dateField = "createdAt",
      sort = "createdAt:desc",
    } = req.query;

    // Validation
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return res.status(400).json({ success: false, message: "Slug là bắt buộc." });
    }
    if (isNaN(page) || page < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Trang phải là số nguyên dương." });
    }
    if (isNaN(limit) || limit < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Giới hạn phải là số nguyên dương." });
    }
    if (startDate || endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Định dạng ngày không hợp lệ." });
      }
      if (start > end) {
        return res
          .status(400)
          .json({ success: false, message: "startDate phải trước endDate." });
      }
    }
    if (!["createdAt", "updatedAt"].includes(dateField)) {
      return res
        .status(400)
        .json({ success: false, message: "dateField phải là createdAt hoặc updatedAt." });
    }
    const [sortField, sortOrder] = sort.split(":");
    if (
      !["viewCount", "downloadCount", "favoriteCount", "createdAt"].includes(sortField) ||
      !["asc", "desc"].includes(sortOrder)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Trường sắp xếp hoặc thứ tự không hợp lệ." });
    }

    const category = await Category.findOne({ slug: slug.trim() })
      .select("name slug description createdAt")
      .lean();

    if (!category) {
      return res.status(404).json({ success: false, message: "Danh mục không tồn tại." });
    }

    // Xây dựng query cho tài liệu
    const query = { categoryId: category._id, status: "approved", isPublic: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (startDate && endDate) {
      query[dateField] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Sắp xếp
    const sortOptions = { [sortField]: sortOrder === "desc" ? -1 : 1 };

    // Query tài liệu với aggregate
    const documents = await Document.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "documentId",
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "uploaderId",
          foreignField: "_id",
          as: "uploader",
        },
      },
      { $unwind: { path: "$uploader", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          tags: 1,
          slug: 1,
          title: 1,
          format: 1,
          isFeatured: 1,
          description: 1,
          thumbnailUrl: 1,
          downloadCount: 1,
          favoriteCount: 1,
          viewCount: 1,
          createdAt: 1,
          category: {
            _id: "$category._id",
            name: "$category.name",
            slug: "$category.slug",
          },
          uploader: { _id: "$uploader._id", name: "$uploader.name" },
          averageRating: { $avg: "$ratings.score" },
          totalRatings: { $size: "$ratings" },
        },
      },
      { $sort: sortOptions },
      { $skip: Number(page - 1) * Number(limit) },
      { $limit: Number(limit) },
    ]);

    const total = await Document.countDocuments(query);
    const pagingData = getPagingData(documents, total, Number(page), Number(limit));

    const responseData = {
      ...category,
      documents: pagingData.items,
      pagination: {
        totalItems: pagingData.totalItems,
        totalPages: pagingData.totalPages,
        currentPage: pagingData.currentPage,
        limit: pagingData.limit,
      },
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(`Get category by slug error: ${error.message}`, {
      slug: req.params.slug,
      query: req.query,
    });
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy thông tin danh mục." });
  }
};
