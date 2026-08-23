const mongoose = require("mongoose");
const Rating = require("../models/rating.model");
const Document = require("../models/document.model");
const User = require("../models/user.model");
const { notifyDocumentOwner } = require("../utils/notification");
const { getPagination, buildMeta } = require("../utils/helper");

// Lấy danh sách đánh giá của tài liệu
exports.getRatingsByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { page, limit, skip } = getPagination(req.query);
    const { sortBy, order } = req.query;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "ID tài liệu không hợp lệ",
      });
    }

    if (sortBy && !["createdAt", "score"].includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Sắp xếp chỉ hỗ trợ createdAt hoặc score",
      });
    }
    if (order && !["asc", "desc"].includes(order)) {
      return res.status(400).json({
        success: false,
        message: "Thứ tự sắp xếp chỉ hỗ trợ asc hoặc desc",
      });
    }

    const sortOptions = {
      [sortBy || "createdAt"]: order === "asc" ? 1 : -1,
    };

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại.",
      });
    }

    const ratings = await Rating.find({ documentId })
      .populate("userId", "name email avatar")
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .lean();

    const totalRating = await Rating.countDocuments();

    const pagingData = buildMeta(page, limit, totalRating);

    return res.status(200).json({
      success: true,
      data: ratings,
      meta: pagingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đánh giá",
    });
  }
};

// Lấy điểm trung bình đánh giá
exports.getAverageRating = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tài liệu không hợp lệ" });
    }

    // Kiểm tra tài liệu
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại hoặc chưa được duyệt",
      });
    }

    const ratings = await Rating.find({ documentId });

    const totalRatings = ratings.length;

    const avgScore =
      totalRatings > 0
        ? parseFloat(
            (
              ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings
            ).toFixed(1)
          )
        : 0;

    return res.status(200).json({
      success: true,
      data: { avgScore, totalRatings },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể lấy điểm trung bình đánh giá",
    });
  }
};

// Lấy phân phối đánh giá
exports.getRatingDistribution = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "ID tài liệu không hợp lệ",
      });
    }

    // Kiểm tra tài liệu
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại.",
      });
    }

    const ratings = await Rating.find({ documentId });

    const totalRatings = ratings.length;

    const distributionData = [5, 4, 3, 2, 1].map((star) => {
      const count = ratings.filter((rating) => rating.score === star).length;

      return {
        star,
        count,
        percentage:
          totalRatings > 0 ? parseFloat(((count / totalRatings) * 100).toFixed(1)) : 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: distributionData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể lấy phân phối đánh giá",
    });
  }
};

// Tạo hoặc cập nhật đánh giá
exports.createRating = async (req, res) => {
  try {
    const userId = req.user._id;
    const { documentId } = req.params;
    const { score, review } = req.body;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "ID tài liệu không hợp lệ",
      });
    }
    if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá không hợp lệ.",
      });
    }
    if (review && (typeof review !== "string" || review.length > 500)) {
      return res.status(400).json({
        success: false,
        message: "Nhận xét tối đa 500 ký tự.",
      });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại.",
      });
    }

    // Kiểm tra đánh giá đã tồn tại chưa? trước khi tạo
    const existingRating = await Rating.findOne({
      userId,
      documentId,
    });

    if (existingRating) {
      return res.status(409).json({
        success: false,
        message: "Bạn đã đánh giá tài liệu này.",
      });
    }

    const rating = await Rating.create(documentId, userId, score, review);

    // Gửi thông báo
    const user = await User.findById(userId).select("name");
    await notifyDocumentOwner({
      documentId,
      actionUserId: userId,
      type: "new_rating",
      actionUserName: user.name || req.user.email,
    });

    return res.status(201).json({
      success: true,
      message: "Đánh giá thành công",
      data: rating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể gửi đánh giá",
    });
  }
};

// Xóa đánh giá
exports.deleteRating = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "ID tài liệu không hợp lệ",
      });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại hoặc chưa được duyệt",
      });
    }

    const rating = await Rating.findOneAndDelete({ documentId, userId: req.user._id });
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Đánh giá không tồn tại",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể xóa đánh giá",
    });
  }
};
