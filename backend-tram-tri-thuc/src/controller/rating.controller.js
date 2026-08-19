const { Types } = require("mongoose");
const Rating = require("../models/rating.model");
const Document = require("../models/document.model");
const User = require("../models/user.model");
const { getPagination, getPagingData } = require("../utils/paginate");
const { notifyDocumentOwner } = require("../utils/notification");

// Lấy danh sách đánh giá của tài liệu
exports.getRatingsByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { page, limit, skip } = getPagination(req.query);
    const {
      minScore,
      maxScore,
      dateFrom,
      dateTo,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validation
    if (!Types.ObjectId.isValid(documentId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tài liệu không hợp lệ" });
    }
    if (minScore && (isNaN(parseInt(minScore)) || minScore < 1 || minScore > 5)) {
      return res
        .status(400)
        .json({ success: false, message: "Số sao tối thiểu phải từ 1 đến 5" });
    }
    if (maxScore && (isNaN(parseInt(maxScore)) || maxScore < 1 || maxScore > 5)) {
      return res
        .status(400)
        .json({ success: false, message: "Số sao tối đa phải từ 1 đến 5" });
    }
    if (minScore && maxScore && parseInt(minScore) > parseInt(maxScore)) {
      return res
        .status(400)
        .json({ success: false, message: "minScore không được lớn hơn maxScore" });
    }
    if (dateFrom && isNaN(new Date(dateFrom).getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Ngày bắt đầu không hợp lệ" });
    }
    if (dateTo && isNaN(new Date(dateTo).getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Ngày kết thúc không hợp lệ" });
    }
    if (sortBy && !["createdAt", "score"].includes(sortBy)) {
      return res
        .status(400)
        .json({ success: false, message: "Sắp xếp chỉ hỗ trợ createdAt hoặc score" });
    }
    if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
      return res
        .status(400)
        .json({ success: false, message: "Thứ tự sắp xếp chỉ hỗ trợ asc hoặc desc" });
    }

    // Kiểm tra tài liệu
    const document = await Document.findById(documentId);
    if (!document || document.status !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Tài liệu không tồn tại hoặc chưa được duyệt" });
    }

    // Xây dựng điều kiện lọc
    const matchConditions = { documentId: new Types.ObjectId(documentId) };
    if (minScore) matchConditions.score = { $gte: parseInt(minScore) };
    if (maxScore)
      matchConditions.score = { ...matchConditions.score, $lte: parseInt(maxScore) };
    if (dateFrom) matchConditions.createdAt = { $gte: new Date(dateFrom) };
    if (dateTo)
      matchConditions.createdAt = {
        ...matchConditions.createdAt,
        $lte: new Date(dateTo),
      };

    // Lấy danh sách đánh giá
    const ratings = await Rating.aggregate([
      { $match: matchConditions },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          score: 1,
          review: 1,
          createdAt: 1,
          updatedAt: 1,
          userId: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            avatar: {
              $ifNull: [
                "$user.avatar",
                { $toUpper: { $substrCP: ["$user.name", 0, 1] } },
              ],
            },
          },
        },
      },
      { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await Rating.countDocuments(matchConditions);
    const pagingData = getPagingData(ratings, total, page, limit);

    res.status(200).json({ success: true, data: pagingData });
  } catch (error) {
    console.log(`Get ratings error: ${error.message}`);
    res.status(500).json({ success: false, message: "Không thể lấy danh sách đánh giá" });
  }
};

// Lấy điểm trung bình đánh giá
exports.getAverageRating = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validation
    if (!Types.ObjectId.isValid(documentId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tài liệu không hợp lệ" });
    }

    // Kiểm tra tài liệu
    const document = await Document.findById(documentId);
    if (!document || document.status !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Tài liệu không tồn tại hoặc chưa được duyệt" });
    }

    const avgRating = await Rating.aggregate([
      { $match: { documentId: new Types.ObjectId(documentId) } },
      { $group: { _id: null, avgScore: { $avg: "$score" }, totalRatings: { $sum: 1 } } },
    ]);

    const avgScore =
      avgRating.length > 0 ? parseFloat(avgRating[0].avgScore.toFixed(1)) : 0;
    const totalRatings = avgRating.length > 0 ? avgRating[0].totalRatings : 0;

    res.status(200).json({ success: true, data: { avgScore, totalRatings } });
  } catch (error) {
    console.log(`Get average rating error: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Không thể lấy điểm trung bình đánh giá" });
  }
};

// Lấy phân phối đánh giá
exports.getRatingDistribution = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validation
    if (!Types.ObjectId.isValid(documentId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tài liệu không hợp lệ" });
    }

    // Kiểm tra tài liệu
    const document = await Document.findById(documentId);
    if (!document || document.status !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Tài liệu không tồn tại hoặc chưa được duyệt" });
    }

    const distribution = await Rating.aggregate([
      { $match: { documentId: new Types.ObjectId(documentId) } },
      { $group: { _id: "$score", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    const totalRatings = distribution.reduce((sum, item) => sum + item.count, 0);
    const distributionData = [5, 4, 3, 2, 1].map((star) => {
      const item = distribution.find((d) => d._id === star) || { count: 0 };
      return {
        star,
        count: item.count,
        percentage: totalRatings > 0 ? ((item.count / totalRatings) * 100).toFixed(1) : 0,
      };
    });

    res.status(200).json({ success: true, data: distributionData });
  } catch (error) {
    console.log(`Get rating distribution error: ${error.message}`);
    res.status(500).json({ success: false, message: "Không thể lấy phân phối đánh giá" });
  }
};

// Tạo hoặc cập nhật đánh giá
exports.createOrUpdateRating = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { score, review } = req.body;

    // Validation
    if (!Types.ObjectId.isValid(documentId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tài liệu không hợp lệ" });
    }
    if (!score || isNaN(score) || score < 1 || score > 5) {
      return res.status(400).json({ success: false, message: "Số sao phải từ 1 đến 5" });
    }
    if (review && (typeof review !== "string" || review.length > 500)) {
      return res
        .status(400)
        .json({ success: false, message: "Nhận xét tối đa 500 ký tự" });
    }

    // Kiểm tra tài liệu
    const document = await Document.findById(documentId);
    if (!document || document.status !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Tài liệu không tồn tại hoặc chưa được duyệt" });
    }

    const rating = await Rating.findOneAndUpdate(
      { userId: req.user._id, documentId },
      { score, review, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    // Cập nhật averageRating và totalRatings
    const avgRating = await Rating.aggregate([
      { $match: { documentId: new Types.ObjectId(documentId) } },
      { $group: { _id: null, avgScore: { $avg: "$score" }, totalRatings: { $sum: 1 } } },
    ]);

    const avgScore =
      avgRating.length > 0 ? parseFloat(avgRating[0].avgScore.toFixed(1)) : 0;
    const totalRatings = avgRating.length > 0 ? avgRating[0].totalRatings : 0;

    await Document.findByIdAndUpdate(documentId, {
      averageRating: avgScore,
      totalRatings,
    });

    const user = await User.findById(req.user._id).select("name");
    await notifyDocumentOwner({
      documentId,
      actionUserId: req.user._id,
      type: "new_rating",
      actionUserName: user.name || req.user.email,
    });

    console.log(
      `Rating ${rating._id} upserted by ${req.user.email} for document ${documentId}`
    );
    res.status(201).json({ success: true, message: "Đánh giá thành công", data: rating });
  } catch (error) {
    console.log(`Create rating error: ${error.message}`);
    res.status(500).json({ success: false, message: "Không thể gửi đánh giá" });
  }
};

// Xóa đánh giá
exports.deleteRating = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validation
    if (!Types.ObjectId.isValid(documentId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tài liệu không hợp lệ" });
    }

    // Kiểm tra tài liệu
    const document = await Document.findById(documentId);
    if (!document || document.status !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Tài liệu không tồn tại hoặc chưa được duyệt" });
    }

    const rating = await Rating.findOneAndDelete({ documentId, userId: req.user._id });
    if (!rating) {
      return res.status(404).json({ success: false, message: "Đánh giá không tồn tại" });
    }

    // Cập nhật averageRating và totalRatings
    const avgRating = await Rating.aggregate([
      { $match: { documentId: new Types.ObjectId(documentId) } },
      { $group: { _id: null, avgScore: { $avg: "$score" }, totalRatings: { $sum: 1 } } },
    ]);

    const avgScore =
      avgRating.length > 0 ? parseFloat(avgRating[0].avgScore.toFixed(1)) : 0;
    const totalRatings = avgRating.length > 0 ? avgRating[0].totalRatings : 0;

    await Document.findByIdAndUpdate(documentId, {
      averageRating: avgScore,
      totalRatings,
    });

    console.log(`Rating deleted by ${req.user.email} for document ${documentId}`);
    res.status(200).json({ success: true, message: "Xóa đánh giá thành công" });
  } catch (error) {
    console.log(`Delete rating error: ${error.message}`);
    res.status(500).json({ success: false, message: "Không thể xóa đánh giá" });
  }
};
