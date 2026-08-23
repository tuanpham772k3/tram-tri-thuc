const Document = require("../models/document.model");
const Category = require("../models/category.model");
const { Types } = require("mongoose");
const {
  getPagination,
  buildMeta,
  asyncHandler,
  AppError,
  sendSuccess,
} = require("../utils/helper");

// Lấy danh sách tài liệu
exports.getDocuments = asyncHandler(async (req, res) => {
  const { search, categoryId, sortBy, order, startDate, endDate, page, limit } =
    req.query;

  let query = {
    status: "approved",
  };

  // Tìm kiếm
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Lọc theo danh mục
  if (categoryId) {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new AppError("ID danh mục không hợp lệ.", 400);
    }

    const categoryDoc = await Category.findById(categoryId).lean();

    if (!categoryDoc) {
      throw new AppError("Danh mục không tồn tại.", 404);
    }

    query.categoryId = categoryDoc._id;
  }

  // Lọc theo khoảng ngày
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new AppError("Định dạng ngày không hợp lệ.", 400);
    }

    if (start > end) {
      throw new AppError("Ngày bắt đầu phải trước ngày kết thúc.", 400);
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
    throw new AppError("Trường sắp xếp không hợp lệ.", 400);
  }

  if (order && !validOrders.includes(order)) {
    throw new AppError("Thứ tự sắp xếp không hợp lệ.", 400);
  }

  const sortOptions = {
    [sortBy || "createdAt"]: order === "asc" ? 1 : -1,
  };

  // Pagination
  const pagination = getPagination({ page, limit });

  // Lấy documents
  const documents = await Document.find(query)
    .select("-mimeType")
    .populate("uploaderId", "name email avatar")
    .populate("categoryId", "name slug description")
    .sort(sortOptions)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  // Tổng số documents
  const totalDocs = await Document.countDocuments(query);

  // Meta pagination
  const meta = buildMeta(pagination.page, pagination.limit, totalDocs);

  return sendSuccess(res, documents, "Lấy danh sách tài liệu thành công.", 200, meta);
});

// Lấy tài liệu liên quan
exports.getRelatedDocuments = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  // Validation
  if (!Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Tìm tài liệu hiện tại
  const document = await Document.findById(documentId).lean();

  if (!document) {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  const query = {
    _id: { $ne: document._id },
    tags: { $in: document.tags },
    status: "approved",
  };

  const relatedDocuments = await Document.find(query).select("-mimeType").limit(4).lean();

  return sendSuccess(
    res,
    relatedDocuments,
    "Lấy danh sách tài liệu liên quan thành công."
  );
});

// Lấy chi tiết tài liệu
exports.getDocumentById = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  // Validation
  if (!Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  const document = await Document.findById(documentId)
    .select("-mimeType")
    .populate("categoryId", "name slug")
    .populate("uploaderId", "name email")
    .lean();

  if (!document) {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  return sendSuccess(res, document, "Lấy chi tiết tài liệu thành công.");
});
