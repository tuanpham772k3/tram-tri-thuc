const Document = require("../models/document.model");
const Category = require("../models/category.model");
const { Types } = require("mongoose");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const { getPagination, buildMeta } = require("../utils/helper");

exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const { search, categoryId, sortBy, order, startDate, endDate, page, limit } =
      req.query;

    const pagination = getPagination({ page, limit });

    let query = {};

    if (role === "uploader") {
      query.uploaderId = userId;
    }

    if (categoryId) {
      // Lọc theo danh mục
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

    // Sort
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

exports.uploadDocument = async (req, res) => {
  try {
    const { title, description, categoryId, tags } = req.body;
    const file = req.files?.file?.[0];
    const thumbnail = req.files?.thumbnail?.[0];

    // Validation
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "File tài liệu là bắt buộc." });
    }
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tiêu đề là bắt buộc.",
      });
    }
    if (description && (typeof description !== "string" || description.length > 1000)) {
      return res.status(400).json({
        success: false,
        message: "Mô tả quá dài.",
      });
    }
    if ((tags && typeof tags !== "string") || tags.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Thẻ không hợp lệ.",
      });
    }

    const document = await Document.create({
      uploaderId: req.user._id,
      categoryId,
      title,
      description,
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.filename,
      mimeType: file.mimetype,
      format: file.mimetype.split("/")[1],
      size: file.size,
      thumbnailUrl: thumbnail ? `/uploads/${thumbnail.filename}` : null,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    });

    return res.status(201).json({
      success: true,
      message: "Tài liệu đã được tải lên, chờ duyệt.",
      data: document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể upload tài liệu.",
    });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId } = req.body;

    // Validation
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tài liệu không hợp lệ." });
    }
    if (title && (typeof title !== "string" || title.trim().length === 0)) {
      return res.status(400).json({ success: false, message: "Tiêu đề không hợp lệ." });
    }
    if (description && (typeof description !== "string" || description.length > 1000)) {
      return res.status(400).json({ success: false, message: "Mô tả quá dài." });
    }
    if (categoryId && !Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID danh mục không hợp lệ." });
    }

    const document = await Document.findById(id);
    if (!document || document.uploaderId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền sửa tài liệu này." });
    }

    const updates = req.body;
    if (updates.title) {
      let slug = slugify(updates.title, { lower: true, strict: true, locale: "vi" });
      let suffix = Date.now();
      let finalSlug = `${slug}-${suffix}`;
      while (await Document.findOne({ slug: finalSlug, _id: { $ne: document._id } })) {
        suffix += 1;
        finalSlug = `${slug}-${suffix}`;
      }
      updates.slug = finalSlug;
    }

    Object.assign(document, updates);
    await document.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật tài liệu thành công.",
      data: document,
    });
  } catch (error) {
    console.log(`Update document error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: "Không thể cập nhật tài liệu." });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tài liệu không hợp lệ." });
    }

    const document = await Document.findById(id);
    if (
      !document ||
      (document.uploaderId.toString() !== req.user._id.toString() &&
        req.user.role !== "admin")
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền xóa tài liệu này." });
    }

    let fileName = document.fileName;
    if (!fileName && document.fileUrl) {
      fileName = document.fileUrl.split("/uploads/")[1];
      console.log(`fileName missing, derived from fileUrl: ${fileName}`);
    }
    if (!fileName) {
      console.log(`No fileName or fileUrl for document: ${id}`);
      return res.status(400).json({ success: false, message: "Thiếu thông tin file." });
    }

    const filePath = path.join(__dirname, "../../Uploads", document.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }

    if (document.thumbnailUrl) {
      const thumbnailFile = document.thumbnailUrl.split("/uploads/")[1];
      if (thumbnailFile) {
        const thumbnailPath = path.join(__dirname, "../../Uploads", thumbnailFile);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
          console.log(`Deleted thumbnail: ${thumbnailPath}`);
        } else {
          console.log(`Thumbnail not found: ${thumbnailPath}`);
        }
      }
    }

    await document.deleteOne();
    console.log(`Document deleted by ${req.user.email}: ${document.title}`);
    res.status(200).json({ success: true, message: "Xóa tài liệu thành công." });
  } catch (error) {
    console.log(`Delete document error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: "Không thể xóa tài liệu." });
  }
};
