const mongoose = require("mongoose");
const Category = require("../models/category.model");
const Document = require("../models/document.model");
const logger = require("../utils/logger");
const slugify = require("slugify");
const { getPagination, getPagingData } = require("../utils/paginate");

// GET /api/categories
exports.getCategories = async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const categories = await Category.find()
            .select("name slug description createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await Category.countDocuments();
        const pagingData = getPagingData(categories, total, page, limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error("Get categories error:", error);
        res.status(500).json({ success: false, message: "Không thể lấy danh sách danh mục." });
    }
};

// GET /api/categories/:slug
exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
            .select("name slug description createdAt")
            .lean();
        if (!category) {
            return res.status(404).json({ success: false, message: "Danh mục không tồn tại." });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        logger.error("Get category by slug error:", error);
        res.status(500).json({ success: false, message: "Không thể lấy thông tin danh mục." });
    }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        let { slug } = req.body;
        slug = slugify(slug || name, { lower: true, strict: true });

        const category = new Category({ name, slug, description });
        await category.save();

        logger.info(`Category created by ${req.user.email}: ${name}`);
        res.status(201).json({
            success: true,
            message: "Tạo danh mục thành công.",
            data: category,
        });
    } catch (error) {
        logger.error("Create category error:", error);
        res.status(500).json({ success: false, message: "Không thể tạo danh mục." });
    }
};

// PATCH /api/categories/:id
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Danh mục không tồn tại." });
        }

        const updates = req.body;
        if (updates.name) {
            updates.slug = slugify(updates.slug || updates.name, { lower: true, strict: true });
        }

        Object.assign(category, updates);
        await category.save();

        logger.info(`Category updated by ${req.user.email}: ${category.name}`);
        res.status(200).json({
            success: true,
            message: "Cập nhật danh mục thành công.",
            data: category,
        });
    } catch (error) {
        logger.error("Update category error:", error);
        res.status(500).json({ success: false, message: "Không thể cập nhật danh mục." });
    }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Danh mục không tồn tại." });
        }

        const documentCount = await Document.countDocuments({ categoryId: req.params.id });
        if (documentCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa danh mục vì có tài liệu liên quan.",
            });
        }

        await Category.deleteOne({ _id: req.params.id });

        logger.info(`Category deleted by ${req.user.email}: ${category.name}`);
        res.status(200).json({ success: true, message: "Xóa danh mục thành công." });
    } catch (error) {
        await session.abortTransaction();
        logger.error("Delete category error:", error);
        res.status(500).json({ success: false, message: "Không thể xóa danh mục." });
    }
};
