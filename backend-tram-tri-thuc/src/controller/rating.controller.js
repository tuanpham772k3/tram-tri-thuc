const mongoose = require("mongoose");
const Rating = require("../models/rating.model");
const Document = require("../models/document.model");
const User = require("../models/user.model");
const { notifyDocumentOwner } = require("../utils/notification");

const {
  AppError,
  sendSuccess,
  asyncHandler,
  getPagination,
  buildMeta,
} = require("../utils/helper");

// Lấy danh sách đánh giá của tài liệu
exports.getRatingsByDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { page, limit, skip } = getPagination(req.query);
  const { sortBy, order } = req.query;

  // Validation documentId
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Validation sortBy
  if (sortBy && !["createdAt", "score"].includes(sortBy)) {
    throw new AppError("Sắp xếp chỉ hỗ trợ createdAt hoặc score.", 400);
  }

  // Validation order
  if (order && !["asc", "desc"].includes(order)) {
    throw new AppError("Thứ tự sắp xếp chỉ hỗ trợ asc hoặc desc.", 400);
  }

  const sortOptions = {
    [sortBy || "createdAt"]: order === "asc" ? 1 : -1,
  };

  // Kiểm tra tài liệu
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  const query = {
    documentId,
  };

  const ratings = await Rating.find(query)
    .populate("userId", "name email avatar")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .lean();

  const totalRating = await Rating.countDocuments(query);

  const meta = buildMeta(page, limit, totalRating);

  return sendSuccess(res, ratings, "Lấy danh sách đánh giá thành công.", 200, meta);
});

// Lấy điểm trung bình đánh giá
exports.getAverageRating = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  // Validation
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Kiểm tra tài liệu
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Tài liệu không tồn tại hoặc chưa được duyệt.", 404);
  }

  const ratings = await Rating.find({ documentId }).lean();

  const totalRatings = ratings.length;

  const avgScore =
    totalRatings > 0
      ? parseFloat(
          (ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings).toFixed(
            1
          )
        )
      : 0;

  return sendSuccess(
    res,
    {
      avgScore,
      totalRatings,
    },
    "Lấy điểm trung bình đánh giá thành công."
  );
});

// Lấy phân phối đánh giá
exports.getRatingDistribution = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  // Validation
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Kiểm tra tài liệu
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  const ratings = await Rating.find({ documentId }).lean();

  const totalRatings = ratings.length;

  const distributionData = [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((rating) => rating.score === star).length;

    const percentage =
      totalRatings > 0 ? parseFloat(((count / totalRatings) * 100).toFixed(1)) : 0;

    return {
      star,
      count,
      percentage,
    };
  });

  return sendSuccess(res, distributionData, "Lấy phân phối đánh giá thành công.");
});

// Tạo đánh giá
exports.createRating = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { documentId } = req.params;
  const { score, review } = req.body;

  // Validation documentId
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Validation score
  if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 5) {
    throw new AppError("Đánh giá không hợp lệ.", 400);
  }

  // Validation review
  if (review && (typeof review !== "string" || review.length > 500)) {
    throw new AppError("Nhận xét tối đa 500 ký tự.", 400);
  }

  // Kiểm tra tài liệu
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  // Kiểm tra user đã đánh giá chưa
  const existingRating = await Rating.findOne({
    userId,
    documentId,
  });

  if (existingRating) {
    throw new AppError("Bạn đã đánh giá tài liệu này.", 409);
  }

  // Tạo rating
  const rating = await Rating.create({
    documentId,
    userId,
    score,
    review,
  });

  // Gửi thông báo
  const user = await User.findById(userId).select("name");

  await notifyDocumentOwner({
    documentId,
    actionUserId: userId,
    type: "new_rating",
    actionUserName: user?.name || req.user.email,
  });

  return sendSuccess(res, rating, "Đánh giá thành công.", 201);
});

// Xóa đánh giá
exports.deleteRating = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const userId = req.user._id;

  // Validation
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Kiểm tra tài liệu
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Tài liệu không tồn tại hoặc chưa được duyệt.", 404);
  }

  const rating = await Rating.findOneAndDelete({
    documentId,
    userId,
  });

  if (!rating) {
    throw new AppError("Đánh giá không tồn tại.", 404);
  }

  return sendSuccess(res, null, "Xóa đánh giá thành công.");
});
