const mongoose = require("mongoose");
const logger = require("../utils/logger");
const Category = require("../models/Category.model");


// Lấy danh sách danh mục
const getCategory = async (req, res) => {
    try {
        const categories = await Category.find().lean();
        return res.json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories,
        });
    } catch (error) {
        logger.error("Get Category Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while retrieving categories",
        });
    }
};

// Tạo danh mục mới
const createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        const category = new Category({ name, slug, description });
        await category.save();
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        logger.error("Create Category Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while creating category",
        });
    }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const category = await Category.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).lean();
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        return res.json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        logger.error("Update Category Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while updating category",
        });
    }
};

// Xoá danh mục
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id).lean();
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        return res.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        logger.error("Delete Category Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while deleting category",
        });
    }
};

module.exports = {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};