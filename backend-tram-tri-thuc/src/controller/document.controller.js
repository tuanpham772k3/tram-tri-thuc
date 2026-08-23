const Document = require("../models/document.model");
const Category = require("../models/category.model");
const { Types } = require("mongoose");
const { getPagination, buildMeta } = require("../utils/helper");

exports.getDocuments = async (req, res) => {
  try {
    const { search, categoryId, sortBy, order, startDate, endDate, page, limit } =
      req.query;

    let query = {};

    // Lọc theo danh mục
    if (categoryId) {
      const categoryDoc = await Category.findById(categoryId).lean();
      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          message: "Danh mục không tồn tại.",
        });
      }

      query.categoryId = categoryDoc._id;
    }

    // Lọc theo khoảng ngày
    if (startDate && endDate) {
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
          .json({ success: false, message: "Ngày bắt đầu phải trước ngày kết thúc." });
      }

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // Sắp xếp
    const validSortFields = ["viewCount", "downloadCount", "averageRating", "createdAt"];
    const validOrders = ["asc", "desc"];

    if (sortBy && !validSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Trường sắp xếp không hợp lệ.",
      });
    }

    if (order && !validOrders.includes(order)) {
      return res.status(400).json({
        success: false,
        message: "Thứ tự sắp xếp không hợp lệ.",
      });
    }

    const sortOptions = {
      [sortBy || "createdAt"]: order === "asc" ? 1 : -1,
    };

    const pagination = getPagination({ page, limit });

    const documents = await Document.find(query)
      .select("-mimeType")
      .populate("uploaderId", "name email avatar")
      .populate("categoryId", "name slug description")
      .sort(sortOptions)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();

    const totalDocs = await Document.countDocuments(query);

    const pagingData = buildMeta(pagination.page, pagination.limit, totalDocs);

    return res.status(200).json({
      success: true,
      data: documents,
      meta: pagingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách tài liệu.",
    });
  }
};

exports.getRelatedDocuments = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "ID tài liệu không hợp lệ.",
      });
    }

    const document = await Document.findById(documentId).lean();
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại.",
      });
    }

    const query = {
      _id: { $ne: document._id },
      tags: { $in: document.tags },
      status: "approved",
    };

    const relatedDocuments = await Document.find(query)
      .select("-mimeType")
      .limit(4)
      .lean();

    return res.status(200).json({
      success: true,
      data: relatedDocuments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách tài liệu liên quan.",
    });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "ID tài liệu không hợp lệ.",
      });
    }

    const document = await Document.findById(documentId)
      .select("-mimeType")
      .populate("categoryId", "name slug")
      .populate("uploaderId", "name email")
      .lean();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại.",
      });
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể lấy chi tiết tài liệu.",
    });
  }
};
