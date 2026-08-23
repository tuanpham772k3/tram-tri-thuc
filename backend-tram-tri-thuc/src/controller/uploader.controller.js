const Document = require("../models/document.model");
const Category = require("../models/category.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const {
  AppError,
  sendSuccess,
  asyncHandler,
  getPagination,
  buildMeta,
} = require("../utils/helper");

// Lấy danh sách tài liệu của uploader
exports.getUploaderDocuments = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { search, categoryId, sortBy, order, startDate, endDate, page, limit } =
    req.query;

  const pagination = getPagination({ page, limit });

  const query = {
    uploaderId: userId,
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
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
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

  // Lấy danh sách tài liệu
  const documents = await Document.find(query)
    .select("-mimeType")
    .populate("uploaderId", "name email avatar")
    .populate("categoryId", "name slug description")
    .sort(sortOptions)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  // Tổng số tài liệu
  const totalDocs = await Document.countDocuments(query);

  const meta = buildMeta(pagination.page, pagination.limit, totalDocs);

  return sendSuccess(res, documents, "Lấy danh sách tài liệu thành công.", 200, meta);
});

// Upload tài liệu
exports.uploadDocument = asyncHandler(async (req, res) => {
  const { title, description, categoryId, tags } = req.body;

  const file = req.files?.file?.[0];
  const thumbnail = req.files?.thumbnail?.[0];

  // Kiểm tra file
  if (!file) {
    throw new AppError("File tài liệu là bắt buộc.", 400);
  }

  // Kiểm tra title
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new AppError("Tiêu đề là bắt buộc.", 400);
  }

  // Kiểm tra description
  if (description && (typeof description !== "string" || description.length > 1000)) {
    throw new AppError("Mô tả quá dài.", 400);
  }

  // Kiểm tra categoryId
  if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError("ID danh mục không hợp lệ.", 400);
  }

  // Kiểm tra category tồn tại
  if (categoryId) {
    const category = await Category.findById(categoryId).lean();

    if (!category) {
      throw new AppError("Danh mục không tồn tại.", 404);
    }
  }

  // Kiểm tra tags
  if (tags !== undefined && (typeof tags !== "string" || tags.trim().length === 0)) {
    throw new AppError("Thẻ không hợp lệ.", 400);
  }

  const document = await Document.create({
    uploaderId: req.user._id,
    categoryId,
    title: title.trim(),
    description,
    fileUrl: `/uploads/${file.filename}`,
    fileName: file.filename,
    mimeType: file.mimetype,
    format: file.mimetype.split("/")[1],
    size: file.size,
    thumbnailUrl: thumbnail ? `/uploads/${thumbnail.filename}` : null,
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
  });

  return sendSuccess(res, document, "Tài liệu đã được tải lên, chờ duyệt.", 201);
});

// Cập nhật tài liệu
exports.updateDocument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { documentId } = req.params;
  const { title, description, categoryId } = req.body;

  // Validation documentId
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Kiểm tra dữ liệu cập nhật
  if (!title || !description || !categoryId) {
    throw new AppError("Yêu cầu nhập vào nội dung mới trước khi cập nhật.", 400);
  }

  // Validation title
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new AppError("Tiêu đề không hợp lệ.", 400);
  }

  // Validation description
  if (typeof description !== "string" || description.length > 1000) {
    throw new AppError("Mô tả quá dài.", 400);
  }

  // Validation categoryId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError("ID danh mục không hợp lệ.", 400);
  }

  // Kiểm tra tài liệu
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  // Kiểm tra quyền
  if (userId.toString() !== document.uploaderId.toString()) {
    throw new AppError("Bạn không đủ quyền cập nhật.", 403);
  }

  // Kiểm tra category
  const category = await Category.findById(categoryId).lean();

  if (!category) {
    throw new AppError("Danh mục không tồn tại.", 404);
  }

  document.title = title.trim();
  document.description = description;
  document.categoryId = categoryId;

  await document.save();

  return sendSuccess(res, document, "Cập nhật tài liệu thành công.");
});

// Xóa tài liệu
exports.deleteDocument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { documentId } = req.params;

  // Validation
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Tìm tài liệu
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  // Kiểm tra quyền
  if (document.uploaderId.toString() !== userId.toString()) {
    throw new AppError("Không có quyền xóa tài liệu này.", 403);
  }

  // Lấy tên file
  let fileName = document.fileName;

  if (!fileName && document.fileUrl) {
    fileName = document.fileUrl.split("/uploads/")[1];
  }

  if (!fileName) {
    throw new AppError("Thiếu thông tin file.", 400);
  }

  // Xóa file tài liệu
  const filePath = path.join(__dirname, "../../Uploads", fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Xóa thumbnail
  if (document.thumbnailUrl) {
    const thumbnailFile = document.thumbnailUrl.split("/uploads/")[1];

    if (thumbnailFile) {
      const thumbnailPath = path.join(__dirname, "../../Uploads", thumbnailFile);

      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
  }

  // Xóa document trong database
  await document.deleteOne();

  return sendSuccess(res, null, "Xóa tài liệu thành công.");
});
