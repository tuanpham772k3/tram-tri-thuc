const Document = require("../models/Document.model");
const Category = require("../models/category.model");
const Download = require("../models/Downloads.model");
const logger = require("../utils/logger");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const { getPagination, getPagingData } = require("../utils/paginate");
const { Types } = require("mongoose");

// GET /api/documents
exports.getDocuments = async (req, res) => {
    try {
        const { search, category, uploader, sort } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const query = { status: "approved", isPublic: true };
        if (search) {
            query.$text = { $search: search };
        }
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category });
            if (!categoryDoc) {
                return res.status(200).json({
                    success: true,
                    data: { totalItems: 0, totalPages: 0, currentPage: page, items: [] },
                });
            }
            query.categoryId = categoryDoc._id;
        }
        if (uploader) query.uploaderId = uploader;

        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(":");
            sortOptions[field] = order === "desc" ? -1 : 1;
        } else {
            sortOptions.createdAt = -1;
        }

        const documents = await Document.find(query)
            .select("title slug categoryId uploaderId viewCount downloadCount createdAt")
            .populate("categoryId", "name slug")
            .populate("uploaderId", "name email")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalDocs = await Document.countDocuments(query);
        const pagingData = getPagingData(documents, totalDocs, page, limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error("Get documents error:", error);
        res.status(500).json({ success: false, message: "Không thể lấy danh sách tài liệu." });
    }
};

// GET /api/documents/:id
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate("categoryId", "name slug")
            .populate("uploaderId", "name email")
            .lean();

        if (!document) {
            return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
        }

        await Document.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
        res.status(200).json({ success: true, data: document });
    } catch (error) {
        logger.error("Get document by ID error:", error);
        res.status(500).json({ success: false, message: "Không thể lấy chi tiết tài liệu." });
    }
};

// GET /api/documents/slug/:slug
exports.getDocumentBySlug = async (req, res) => {
    try {
        const document = await Document.findOne({ slug: req.params.slug })
            .populate("categoryId", "name slug")
            .populate("uploaderId", "name email")
            .lean();

        if (!document) {
            return res
                .status(404)
                .json({ success: false, message: "Tài liệu không tồn tại hoặc không công khai." });
        }

        await Document.findOneAndUpdate({ slug: req.params.slug }, { $inc: { viewCount: 1 } });
        res.status(200).json({ success: true, data: document });
    } catch (error) {
        logger.error("Get document by slug error:", error);
        res.status(500).json({ success: false, message: "Không thể lấy chi tiết tài liệu." });
    }
};

// GET /api/documents/download/:id
exports.downloadDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            logger.warn(`Document not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
        }
        logger.info(`Document found: ${req.params.id}`);

        // Kiểm tra quyền truy cập
        if (
            document.status !== "approved" &&
            document.uploaderId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            logger.warn(`Access denied to document: ${req.params.id}`, { user: req.user });
            return res.status(403).json({
                success: false,
                message: "Tài liệu chưa được duyệt hoặc bạn không có quyền.",
            });
        }

        await Document.findByIdAndUpdate(document.id, { $inc: { downloadCount: 1 } });
        await Download.create({
            userId: req.user._id,
            documentId: document.id,
            downloadedAt: new Date(),
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"],
        });

        const filePath = path.join(__dirname, "../../uploads", document.fileName);
        if (!fs.existsSync(filePath)) {
            logger.warn(`File not found: ${filePath}`);
            return res.status(404).json({ success: false, message: "File không tồn tại." });
        }
        res.download(filePath, document.fileName);
    } catch (error) {
        logger.error(`Download document error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ success: false, message: "Không thể tải tài liệu." });
    }
};

// POST /api/documents
exports.uploadDocument = async (req, res) => {
    try {
        const { title, description, categoryId, tag } = req.body;
        const file = req.files?.file?.[0];
        const thumbnail = req.files?.thumbnail?.[0];

        if (!file) {
            return res.status(400).json({ success: false, message: "File tài liệu là bắt buộc." });
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
                fs.existsSync(path.join(__dirname, "../../Uploads", thumbnail.filename))
            ) {
                fs.unlinkSync(path.join(__dirname, "../../Uploads", thumbnail.filename));
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
            tag: tag ? tag.split(",").map((t) => t.trim()) : [],
            uploaderId: req.user._id,
            categoryId,
            isPublic: false,
            status: "pending", // Thay isApproved
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
            const filePath = path.join(__dirname, "../../Uploads", req.files.file[0].filename);
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
        if (!req.user?._id) {
            logger.error("Không tìm thấy ID người dùng trong req.user", { user: req.user });
            return res.status(400).json({
                success: false,
                message: "Không tìm thấy ID người dùng.",
            });
        }
        if (!Types.ObjectId.isValid(req.user._id)) {
            logger.error("Định dạng ID người dùng không hợp lệ", { userId: req.user._id });
            return res.status(400).json({
                success: false,
                message: "Định dạng ID người dùng không hợp lệ.",
            });
        }
        logger.info("Đang lấy tài liệu cho người dùng", { userId: req.user._id });
        const documents = await Document.find({ uploaderId: req.user._id })
            .populate("categoryId", "name slug")
            .sort({ createdAt: -1 })
            .lean();

        if (documents.length === 0) {
            logger.info(`Không tìm thấy tài liệu nào cho người dùng: ${req.user._id}`);
        }

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        logger.error(`Get my documents error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ success: false, message: "Không thể lấy danh sách tài liệu." });
    }
};

// PATCH /api/documents/:id
exports.updateDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
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
        const document = await Document.findById(req.params.id);
        if (
            !document ||
            (document.uploaderId.toString() !== req.user._id.toString() &&
                req.user.role !== "admin")
        ) {
            return res
                .status(403)
                .json({ success: false, message: "Không có quyền xóa tài liệu này." });
        }

        // Xử lý fileName từ fileUrl nếu thiếu
        let fileName = document.fileName;
        if (!fileName && document.fileUrl) {
            fileName = document.fileUrl.split("/uploads/")[1];
            logger.warn(`fileName missing, derived from fileUrl: ${fileName}`);
        }
        if (!fileName) {
            logger.error(`No fileName or fileUrl for document: ${req.params.id}`);
            return res.status(400).json({ success: false, message: "Thiếu thông tin file." });
        }

        // Xóa file
        const filePath = path.join(__dirname, "../../uploads", document.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logger.info(`Deleted file: ${filePath}`);
        } else {
            logger.warn(`File not found: ${filePath}`);
        }

        // Xóa thumbnail
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

// PATCH /api/documents/approve/:id
exports.approveDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
        }

        document.status = "approved";
        document.isPublic = true;
        await document.save();

        logger.info(`Document approved by ${req.user.email}: ${document.title}`);
        res.status(200).json({
            success: true,
            message: "Duyệt tài liệu thành công.",
            data: document,
        });
    } catch (error) {
        logger.error("Approve document error:", error);
        res.status(500).json({ success: false, message: "Không thể duyệt tài liệu." });
    }
};

// PATCH /api/documents/feature/:id
exports.featureDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
        }

        if (document.isFeatured && document.status !== "approved") {
            return res
                .status(400)
                .json({ success: false, message: "Tài liệu phải được duyệt để gắn nổi bật." });
        }

        document.isFeatured = !document.isFeatured;
        await document.save();

        logger.info(
            `Document ${document.isFeatured ? "featured" : "unfeatured"} by ${req.user.email}: ${document.title}`
        );
        res.status(200).json({
            success: true,
            message: `Tài liệu đã được ${document.isFeatured ? "gắn" : "bỏ"} nổi bật.`,
            data: document,
        });
    } catch (error) {
        logger.error(`Feature document error:: ${error.message}`, { stack: error.stack });
        res.status(500).json({ success: false, message: "Không thể cập nhật trạng thái nổi bật." });
    }
};

//lấy tài liệu nổi bật
exports.getFeaturedDocuments = async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const query = { isFeatured: true, status: "approved", isPublic: true };
        const documents = await Document.find(query)
            .select("title slug categoryId uploaderId viewCount downloadCount createdAt")
            .populate("categoryId", "name slug")
            .populate("uploaderId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await Document.countDocuments(query);
        const pagingData = getPagingData(documents, total, page, limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error("Get featured documents error:", error);
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách tài liệu nổi bật.",
        });
    }
};
