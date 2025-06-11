const Document = require("../models/document.model");
const Category = require("../models/category.model");
const Download = require("../models/downloadHistory.model");
const ViewHistory = require("../models/viewHistory.model");
const Favorite = require("../models/favorite.model");
const User = require("../models/user.model");
const { Types } = require("mongoose");
const logger = require("../utils/logger");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const { getPagination, getPagingData } = require("../utils/paginate");

// GET /api/documents
exports.getDocuments = async (req, res) => {
    try {
        const {
            search,
            category,
            uploader,
            sort,
            format,
            startDate,
            endDate,
            dateField,
            page,
            limit,
        } = req.query;

        // Validation
        if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            return res.status(400).json({ success: false, message: "Số trang không hợp lệ." });
        }
        if (
            limit &&
            (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)
        ) {
            return res.status(400).json({ success: false, message: "Giới hạn không hợp lệ." });
        }
        if (search && (typeof search !== "string" || search.trim().length > 100)) {
            return res.status(400).json({ success: false, message: "Từ khóa tìm kiếm quá dài." });
        }
        if (uploader && !Types.ObjectId.isValid(uploader)) {
            return res
                .status(400)
                .json({ success: false, message: "ID người tải lên không hợp lệ." });
        }
        if (sort && !/^(viewCount|downloadCount|createdAt|averageRating):(asc|desc)$/.test(sort)) {
            return res
                .status(400)
                .json({ success: false, message: "Định dạng sắp xếp không hợp lệ." });
        }

        const pagination = getPagination({ page, limit });
        const query = { status: "approved", isPublic: true };

        // Lọc theo danh mục
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category }).lean();
            if (!categoryDoc) {
                return res.status(200).json({
                    success: true,
                    data: { totalItems: 0, totalPages: 0, currentPage: pagination.page, items: [] },
                });
            }
            query.categoryId = categoryDoc._id;
        }

        // Lọc theo uploader
        if (uploader) {
            query.uploaderId = new Types.ObjectId(uploader);
        }

        // Lọc theo format
        if (format) {
            const validFormats = ["pdf", "docx", "pptx", "zip"];
            if (!validFormats.includes(format.toLowerCase())) {
                return res.status(400).json({ success: false, message: "Định dạng không hợp lệ." });
            }
            query.format = format.toLowerCase();
        }

        // Lọc theo khoảng ngày
        if (startDate && endDate) {
            const validDateFields = ["createdAt", "updatedAt"];
            const selectedDateField = validDateFields.includes(dateField) ? dateField : "createdAt";

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

            query[selectedDateField] = {
                $gte: start,
                $lte: end,
            };
        }

        // Sắp xếp
        const validSortFields = ["viewCount", "downloadCount", "averageRating", "createdAt"];
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(":");
            sortOptions[field] = order === "desc" ? -1 : 1;
        } else {
            sortOptions.createdAt = -1;
        }

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
            {
                $match: search
                    ? {
                          $or: [
                              { title: { $regex: search, $options: "i" } },
                              { description: { $regex: search, $options: "i" } },
                              { tags: { $regex: search, $options: "i" } },
                              { "uploader.name": { $regex: search, $options: "i" } },
                          ],
                      }
                    : {},
            },
            { $unwind: { path: "$uploader", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    slug: 1,
                    tags: 1,
                    title: 1,
                    format: 1,
                    fileName: 1,
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
            { $skip: pagination.skip },
            { $limit: pagination.limit },
        ]);

        const totalDocs = await Document.countDocuments(query);
        const pagingData = getPagingData(documents, totalDocs, pagination.page, pagination.limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error("Get documents error:", error);
        res.status(500).json({ success: false, message: "Không thể lấy danh sách tài liệu." });
    }
};

// GET /api/documents/:id
exports.getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validation
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID tài liệu không hợp lệ." });
        }

        // Tìm document theo ID
        const document = await Document.findById(id)
            .populate("categoryId", "name slug")
            .populate("uploaderId", "name email")
            .lean();

        if (!document) {
            return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
        }

        // Gán document vào req để checkDocumentStatus sử dụng
        req.document = document;

        // Tăng viewCount
        await Document.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

        // Ghi hoặc cập nhật lịch sử xem nếu user đã đăng nhập
        if (req.user && req.user._id) {
            try {
                const existingView = await ViewHistory.findOne({
                    userId: req.user._id,
                    documentId: document._id,
                });

                if (existingView) {
                    existingView.viewedAt = new Date();
                    await existingView.save();
                    logger.info(
                        `View history updated for user ${req.user.email}, document ${document._id}`
                    );
                } else {
                    await ViewHistory.create({
                        userId: req.user._id,
                        documentId: document._id,
                        viewedAt: new Date(),
                    });
                    logger.info(
                        `View history created for user ${req.user.email}, document ${document._id}`
                    );
                }
            } catch (viewError) {
                logger.error(`Error recording ViewHistory: ${viewError.message}`);
            }
        } else {
            logger.warn(`No req.user found, skipping ViewHistory for document ${id}`);
        }

        res.status(200).json({ success: true, data: document });
    } catch (error) {
        logger.error("Get document by ID error:", error);
        res.status(500).json({ success: false, message: "Không thể lấy chi tiết tài liệu." });
    }
};

// GET /api/documents/slug/:slug
exports.getDocumentBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        console.log("getDocumentBySlug called with slug:", slug);
        // Validation
        if (
            !slug ||
            typeof slug !== "string" ||
            slug.trim() === "" ||
            slug === "undefined" ||
            !/^[a-z0-9-]+$/.test(slug)
        ) {
            return res.status(400).json({ success: false, message: "Slug không hợp lệ." });
        }
        // Tìm document theo slug
        const document = await Document.findOne({ slug })
            .populate("categoryId", "name slug")
            .populate("uploaderId", "name email")
            .lean();

        if (!document) {
            return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
        }
        // Kiểm tra trạng thái tài liệu
        if (
            document.status !== "approved" &&
            !(req.user && (req.user.role === "admin" || document.uploaderId.equals(req.user._id)))
        ) {
            logger.warn("Access denied to unapproved document", {
                documentId: document._id,
                user: req.user,
            });
            return res.status(403).json({ success: false, message: "Tài liệu chưa được duyệt." });
        }
        // Tăng viewCount
        await Document.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } });

        // Ghi hoặc cập nhật lịch sử xem nếu user đã đăng nhập
        if (req.user?._id) {
            if (!Types.ObjectId.isValid(req.user._id)) {
                logger.error(`Invalid user ID: ${req.user._id}`);
                return res
                    .status(400)
                    .json({ success: false, message: "ID người dùng không hợp lệ." });
            }
            try {
                const updateResult = await ViewHistory.updateOne(
                    {
                        userId: new Types.ObjectId(req.user._id),
                        documentId: document._id,
                    },
                    {
                        $set: { viewedAt: new Date() },
                        $setOnInsert: {
                            userId: new Types.ObjectId(req.user._id),
                            documentId: document._id,
                        },
                    },
                    { upsert: true }
                );

                if (updateResult.matchedCount > 0) {
                    logger.info(
                        `View history updated for user ${req.user.email}, document ${document._id}`
                    );
                } else {
                    logger.info(
                        `View history created for user ${req.user.email}, document ${document._id}`
                    );
                }
            } catch (viewError) {
                logger.error(`Error recording ViewHistory: ${viewError.message}`, {
                    stack: viewError.stack,
                });
            }
        } else {
            logger.warn(`No authenticated user, skipping ViewHistory for document ${slug}`);
        }

        res.status(200).json({ success: true, data: document });
    } catch (error) {
        logger.error("Get document by slug error:", error);
        res.status(500).json({ success: false, message: "Không thể lấy chi tiết tài liệu." });
    }
};

// GET /api/documents/download/:id
exports.downloadDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Validation
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID tài liệu không hợp lệ." });
        }

        const document = await Document.findById(id);
        if (!document) {
            logger.warn(`Document not found: ${id}`);
            return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
        }

        const filePath = path.resolve(__dirname, "../../Uploads", document.fileName);
        if (!fs.existsSync(filePath)) {
            logger.warn(`File not found: ${filePath}`);
            return res.status(404).json({ success: false, message: "File không tồn tại." });
        }

        const existingDownload = await Download.findOne({
            userId: req.user._id,
            documentId: document._id,
        });

        if (existingDownload) {
            existingDownload.downloadedAt = new Date();
            existingDownload.ipAddress = req.ip;
            existingDownload.deviceInfo = req.headers["user-agent"];
            await existingDownload.save();
            logger.info(
                `Download history updated for user ${req.user._id}, document ${document._id}`
            );
        } else {
            await Download.create({
                userId: req.user._id,
                documentId: document._id,
                downloadedAt: new Date(),
                ipAddress: req.ip,
                deviceInfo: req.headers["user-agent"],
            });
            logger.info(
                `Download history created for user ${req.user._id}, document ${document._id}`
            );
        }

        await Document.findByIdAndUpdate(document._id, { $inc: { downloadCount: 1 } });

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${encodeURIComponent(document.fileName)}"`
        );
        res.setHeader("Content-Type", "application/octet-stream");

        res.download(filePath, document.fileName, (err) => {
            if (err) {
                logger.error(`Download error: ${err.message}`);
                if (!res.headersSent) {
                    res.status(500).json({ success: false, message: "Không thể tải tài liệu." });
                }
            }
        });
    } catch (error) {
        logger.error(`Download document error: ${error.message}`, { stack: error.stack });
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Không thể tải tài liệu." });
        }
    }
};

// POST /api/documents
exports.uploadDocument = async (req, res) => {
    try {
        const { title, description, categoryId, tags } = req.body;
        console.log(req.body);
        console.log("Received tag:", tags);
        const file = req.files?.file?.[0];
        const thumbnail = req.files?.thumbnail?.[0];

        // Validation
        if (!file) {
            return res.status(400).json({ success: false, message: "File tài liệu là bắt buộc." });
        }
        if (!title || typeof title !== "string" || title.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Tiêu đề là bắt buộc." });
        }
        if (description && (typeof description !== "string" || description.length > 1000)) {
            return res.status(400).json({ success: false, message: "Mô tả quá dài." });
        }
        if ((tags && typeof tags !== "string") || tags.trim().length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Tags không hợp lệ. Tags phải là chuỗi." });
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: "ID danh mục không hợp lệ." });
        }

        const filePath = path.join(__dirname, "../../uploads", file.filename);
        if (!fs.existsSync(filePath)) {
            return res
                .status(400)
                .json({ success: false, message: "File tài liệu không tồn tại." });
        }

        if (!(await Category.findById(categoryId))) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            if (
                thumbnail &&
                fs.existsSync(path.join(__dirname, "../../uploads", thumbnail.filename))
            ) {
                fs.unlinkSync(path.join(__dirname, "../../uploads", thumbnail.filename));
            }
            return res.status(400).json({ success: false, message: "Danh mục không tồn tại." });
        }

        let slug = slugify(title, { lower: true, strict: true, locale: "vi" });
        let suffix = Date.now();
        let finalSlug = `${slug}-${suffix}`;
        while (await Document.findOne({ slug: finalSlug })) {
            suffix += 1;
            finalSlug = `${slug}-${suffix}`;
        }

        const document = new Document({
            title,
            description,
            fileUrl: `/uploads/${file.filename}`,
            fileName: file.filename,
            mimeType: file.mimetype,
            format: file.mimetype.split("/")[1],
            size: file.size,
            slug: finalSlug,
            thumbnailUrl: thumbnail ? `/uploads/${thumbnail.filename}` : null,
            tags: tags ? tags.split(",").map((t) => t.trim()) : [],
            uploaderId: req.user._id,
            categoryId,
            isPublic: false,
            status: "pending",
        });

        await document.save();
        logger.info(`Document uploaded by ${req.user.email}: ${title}`);
        res.status(201).json({
            success: true,
            message: "Tài liệu đã được upload, chờ duyệt.",
            data: document,
        });
    } catch (error) {
        if (req.files?.file?.[0]) {
            const filePath = path.join(__dirname, "../../uploads", req.files.file[0].filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        if (req.files?.thumbnail?.[0]) {
            const thumbnailPath = path.join(
                __dirname,
                "../../Uploads",
                req.files.thumbnail[0].filename
            );
            if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
        }
        logger.error(`Upload document error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ success: false, message: "Không thể upload tài liệu." });
    }
};

// GET /api/documents/me
exports.getMyDocuments = async (req, res) => {
    try {
        const { search, category, status, sort, startDate, endDate, dateField, page, limit } =
            req.query;
        const userId = req.user?._id;

        // Validation
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "ID người dùng không hợp lệ." });
        }
        if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            return res.status(400).json({ success: false, message: "Số trang không hợp lệ." });
        }
        if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
            return res.status(400).json({ success: false, message: "Giới hạn không hợp lệ." });
        }
        if (search && (typeof search !== "string" || search.trim().length > 100)) {
            return res.status(400).json({ success: false, message: "Từ khóa tìm kiếm quá dài." });
        }
        if (status && !["approved", "pending", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ." });
        }
        if (sort && !/^(viewCount|downloadCount|favoriteCount|createdAt):(asc|desc)$/.test(sort)) {
            return res
                .status(400)
                .json({ success: false, message: "Định dạng sắp xếp không hợp lệ." });
        }
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
        }

        const pagination = getPagination({ page, limit });
        const query = { uploaderId: new Types.ObjectId(userId) };

        // Lọc theo danh mục
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category }).lean();
            if (!categoryDoc) {
                return res.status(200).json({
                    success: true,
                    data: { totalItems: 0, totalPages: 0, currentPage: pagination.page, items: [] },
                });
            }
            query.categoryId = categoryDoc._id;
        }

        // Lọc theo trạng thái
        if (status) {
            query.status = status;
        }

        // Lọc theo khoảng ngày
        if (startDate && endDate) {
            const validDateFields = ["createdAt", "updatedAt"];
            const field = validDateFields.includes(dateField) ? dateField : "createdAt";
            query[field] = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Sắp xếp
        const sortOptions = (() => {
            const validSortFields = ["viewCount", "downloadCount", "favoriteCount", "createdAt"];
            if (sort) {
                const [field, order] = sort.split(":");
                if (!validSortFields.includes(field)) {
                    return null;
                }
                return { [field]: order === "desc" ? -1 : 1 };
            }
            return { createdAt: -1 };
        })();

        if (!sortOptions) {
            return res
                .status(400)
                .json({ success: false, message: "Trường sắp xếp không hợp lệ." });
        }

        const pipeline = [
            { $match: query },
            ...(search
                ? [
                      {
                          $match: {
                              $or: [
                                  { title: { $regex: search, $options: "i" } },
                                  { description: { $regex: search, $options: "i" } },
                                  { tags: { $regex: search, $options: "i" } },
                              ],
                          },
                      },
                  ]
                : []),
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
                    slug: 1,
                    tags: 1,
                    title: 1,
                    format: 1,
                    status: 1,
                    fileName: 1,
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
                    uploader: {
                        _id: "$uploader._id",
                        name: "$uploader.name",
                    },
                },
            },
            { $sort: sortOptions },
            {
                $facet: {
                    items: [{ $skip: pagination.skip }, { $limit: pagination.limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];

        const result = await Document.aggregate(pipeline);

        const items = result[0]?.items || [];
        const totalItems = result[0]?.totalCount[0]?.count || 0;
        const pagingData = getPagingData(items, totalItems, pagination.page, pagination.limit);

        return res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error(`Get my documents error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ success: false, message: "Không thể lấy danh sách tài liệu." });
    }
};

// PATCH /api/documents/:id
exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, categoryId } = req.body;

        // Validation
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID tài liệu không hợp lệ." });
        }
        if (title && (typeof title !== "string" || title.trim().length === 0)) {
            return res.status(400).json({ success: false, message: "Tiêu đề không hợp lệ." });
        }
        if (description && (typeof description !== "string" || description.length > 1000)) {
            return res.status(400).json({ success: false, message: "Mô tả quá dài." });
        }
        if (categoryId && !Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: "ID danh mục không hợp lệ." });
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
        logger.error(`Update document error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ success: false, message: "Không thể cập nhật tài liệu." });
    }
};

// DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Validation
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID tài liệu không hợp lệ." });
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
            logger.warn(`fileName missing, derived from fileUrl: ${fileName}`);
        }
        if (!fileName) {
            logger.error(`No fileName or fileUrl for document: ${id}`);
            return res.status(400).json({ success: false, message: "Thiếu thông tin file." });
        }

        const filePath = path.join(__dirname, "../../Uploads", document.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logger.info(`Deleted file: ${filePath}`);
        } else {
            logger.warn(`File not found: ${filePath}`);
        }

        if (document.thumbnailUrl) {
            const thumbnailFile = document.thumbnailUrl.split("/uploads/")[1];
            if (thumbnailFile) {
                const thumbnailPath = path.join(__dirname, "../../Uploads", thumbnailFile);
                if (fs.existsSync(thumbnailPath)) {
                    fs.unlinkSync(thumbnailPath);
                    logger.info(`Deleted thumbnail: ${thumbnailPath}`);
                } else {
                    logger.warn(`Thumbnail not found: ${thumbnailPath}`);
                }
            }
        }

        await document.deleteOne();
        logger.info(`Document deleted by ${req.user.email}: ${document.title}`);
        res.status(200).json({ success: true, message: "Xóa tài liệu thành công." });
    } catch (error) {
        logger.error(`Delete document error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ success: false, message: "Không thể xóa tài liệu." });
    }
};

// GET /api/documents/featured
exports.getFeaturedDocuments = async (req, res) => {
    try {
        const { search, category, sort, startDate, endDate, dateField, page, limit } = req.query;

        // Validation
        if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            return res.status(400).json({ success: false, message: "Số trang không hợp lệ." });
        }
        if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
            return res.status(400).json({ success: false, message: "Giới hạn không hợp lệ." });
        }
        if (search && (typeof search !== "string" || search.trim().length > 100)) {
            return res.status(400).json({ success: false, message: "Từ khóa tìm kiếm quá dài." });
        }
        if (sort && !/^(viewCount|downloadCount|favoriteCount|createdAt):(asc|desc)$/.test(sort)) {
            return res
                .status(400)
                .json({ success: false, message: "Định dạng sắp xếp không hợp lệ." });
        }
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
        }

        const pagination = getPagination({ page, limit });
        const query = { isFeatured: true, status: "approved", isPublic: true };

        if (category) {
            const categoryDoc = await Category.findOne({ slug: category }).lean();
            if (!categoryDoc) {
                return res.status(200).json({
                    success: true,
                    data: { totalItems: 0, totalPages: 0, currentPage: pagination.page, items: [] },
                });
            }
            query.categoryId = categoryDoc._id;
        }

        if (startDate && endDate) {
            const validDateFields = ["createdAt", "updatedAt"];
            const selectedDateField = validDateFields.includes(dateField) ? dateField : "createdAt";
            query[selectedDateField] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const validSortFields = ["viewCount", "downloadCount", "favoriteCount", "createdAt"];
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(":");
            sortOptions[field] = order === "desc" ? -1 : 1;
        } else {
            sortOptions.createdAt = -1;
        }

        const documents = await Document.aggregate([
            { $match: query },
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
                $match: search
                    ? {
                          $or: [
                              { title: { $regex: search, $options: "i" } },
                              { description: { $regex: search, $options: "i" } },
                              { tags: { $regex: search, $options: "i" } },
                          ],
                      }
                    : {},
            },
            {
                $project: {
                    _id: 1,
                    slug: 1,
                    tags: 1,
                    title: 1,
                    format: 1,
                    fileName: 1,
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
                },
            },
            { $sort: sortOptions },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
        ]);

        const totalDocs = await Document.countDocuments(query);
        const pagingData = getPagingData(documents, totalDocs, pagination.page, pagination.limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error("Get featured documents error:", error);
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách tài liệu nổi bật.",
        });
    }
};

// PATCH /api/documents/:id/favorite
exports.toggleFavorite = async (req, res) => {
    try {
        const { id: docId } = req.params;
        const userId = req.user._id;

        // Validation
        if (!Types.ObjectId.isValid(docId) || !Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ." });
        }

        const document = await Document.findById(docId);
        if (!document || document.status !== "approved") {
            return res.status(404).json({
                success: false,
                message: "Tài liệu không tồn tại hoặc chưa được duyệt.",
            });
        }

        const existingFavorite = await Favorite.findOne({ userId, documentId: docId });

        let isFavorite;
        if (existingFavorite) {
            await Favorite.deleteOne({ userId, documentId: docId });
            await Document.updateOne({ _id: docId }, { $inc: { favoriteCount: -1 } });
            isFavorite = false;
        } else {
            const favoriteCount = await Favorite.countDocuments({ userId });
            if (favoriteCount >= 100) {
                return res.status(400).json({
                    success: false,
                    message: "Danh sách yêu thích đã đạt giới hạn.",
                });
            }
            await Favorite.create({ userId, documentId: docId, favoritedAt: new Date() });
            await Document.updateOne({ _id: docId }, { $inc: { favoriteCount: 1 } });
            isFavorite = true;
        }

        const updatedDocument = await Document.findById(docId)
            .select(
                "title description thumbnailUrl slug categoryId uploaderId viewCount downloadCount favoriteCount createdAt tags"
            )
            .populate("categoryId", "name slug")
            .populate("uploaderId", "name email")
            .lean();

        const favoriteDocuments = await Favorite.find({ userId })
            .populate({
                path: "documentId",
                select: "title description slug categoryId uploaderId viewCount downloadCount favoriteCount createdAt",
                populate: [
                    { path: "categoryId", select: "name slug" },
                    { path: "uploaderId", select: "name email" },
                ],
            })
            .lean()
            .then((favorites) => favorites.map((fav) => fav.documentId));

        res.status(200).json({
            success: true,
            data: {
                document: updatedDocument,
                favoriteDocuments: favoriteDocuments || [],
                isFavorite,
                message: isFavorite ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích",
            },
        });
    } catch (error) {
        logger.error("Toggle favorite error:", error);
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật yêu thích." });
    }
};

// GET /api/documents/:id/related
exports.getRelatedDocuments = async (req, res) => {
    try {
        const { id } = req.params;
        const { sort = "relevance:desc", page, limit } = req.query;

        // Validation
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID tài liệu không hợp lệ." });
        }
        if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            return res.status(400).json({ success: false, message: "Số trang không hợp lệ." });
        }
        if (
            limit &&
            (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 50)
        ) {
            return res.status(400).json({ success: false, message: "Giới hạn không hợp lệ." });
        }
        if (sort && !/^(relevance|viewCount|downloadCount|createdAt):(asc|desc)$/.test(sort)) {
            return res
                .status(400)
                .json({ success: false, message: "Định dạng sắp xếp không hợp lệ." });
        }

        // Tìm tài liệu gốc
        const document = await Document.findById(id).lean();
        if (!document) {
            return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
        }
        if (!document.tags || document.tags.length === 0) {
            return res.status(200).json({
                success: true,
                data: { totalItems: 0, totalPages: 0, currentPage: 1, items: [] },
            });
        }

        // Pagination
        const pagination = getPagination({ page, limit, defaultLimit: 10 });

        // Xây dựng query
        const query = {
            _id: { $ne: document._id }, // Loại trừ tài liệu gốc
            tags: { $in: document.tags }, // Tìm tài liệu có ít nhất một tag trùng
            status: "approved", // Chỉ lấy tài liệu đã duyệt
            isPublic: true, // Chỉ lấy tài liệu công khai
        };

        // Xử lý sắp xếp
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(":");
            if (field === "relevance") {
                // Sắp xếp theo số tag trùng (ưu tiên cao)
                sortOptions.tagMatchCount = order === "desc" ? -1 : 1;
                sortOptions.viewCount = -1; // Tie-breaker: lượt xem
            } else {
                sortOptions[field] = order === "desc" ? -1 : 1;
            }
        } else {
            sortOptions.tagMatchCount = -1; // Mặc định: sắp xếp theo mức độ liên quan
            sortOptions.viewCount = -1;
        }

        // Aggregation pipeline
        const documents = await Document.aggregate([
            { $match: query },
            // Tính số tag trùng
            {
                $addFields: {
                    tagMatchCount: {
                        $size: { $setIntersection: ["$tags", document.tags] },
                    },
                },
            },
            // Lookup dữ liệu liên quan
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
            // Projection
            {
                $project: {
                    _id: 1,
                    slug: 1,
                    tags: 1,
                    title: 1,
                    format: 1,
                    fileName: 1,
                    description: 1,
                    thumbnailUrl: 1,
                    downloadCount: 1,
                    favoriteCount: 1,
                    viewCount: 1,
                    createdAt: 1,
                    tagMatchCount: 1,
                    category: {
                        _id: "$category._id",
                        name: "$category.name",
                        slug: "$category.slug",
                    },
                    uploader: { _id: "$uploader._id", name: "$uploader.name" },
                },
            },
            // Sắp xếp
            { $sort: sortOptions },
            // Phân trang
            { $skip: pagination.skip },
            { $limit: pagination.limit },
        ]);

        // Đếm tổng số tài liệu
        const totalDocs = await Document.countDocuments(query);
        const pagingData = getPagingData(documents, totalDocs, pagination.page, pagination.limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error("Get related documents error:", error);
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách tài liệu liên quan.",
        });
    }
};
