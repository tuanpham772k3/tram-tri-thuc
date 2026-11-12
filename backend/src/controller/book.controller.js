const { default: mongoose } = require("mongoose");
const Book = require("../models/book.model");
const {
  getPagination,
  buildMeta,
  sendSuccess,
  AppError,
  asyncHandler,
} = require("../utils/helper");

const getBooks = asyncHandler(async (req, res) => {
  const {
    search,
    genre,
    author,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    minPurchaseCount,
    maxPurchaseCount,
    sort = "newest",
  } = req.query;

  // 1. Validate query
  const validateNumber = (value, field, min = 0, max = Infinity) => {
    if (value === undefined) return undefined;

    if (value.trim() === "") {
      throw new AppError(`${field} không được để trống.`, 400);
    }

    const number = Number(value);

    if (!Number.isFinite(number) || number < min || number > max) {
      throw new AppError(`${field} không hợp lệ.`, 400);
    }

    return number;
  };

  const minPriceValue = validateNumber(minPrice, "Giá thấp nhất");
  const maxPriceValue = validateNumber(maxPrice, "Giá cao nhất");

  const minRatingValue = validateNumber(minRating, "Đánh giá thấp nhất", 0, 5);
  const maxRatingValue = validateNumber(maxRating, "Đánh giá cao nhất", 0, 5);

  const minPurchaseValue = validateNumber(minPurchaseCount, "Lượt mua tối thiểu");

  const maxPurchaseValue = validateNumber(maxPurchaseCount, "Lượt mua tối đa");

  if (
    minPriceValue !== undefined &&
    maxPriceValue !== undefined &&
    minPriceValue > maxPriceValue
  ) {
    throw new AppError("Giá thấp nhất không được lớn hơn giá cao nhất.", 400);
  }

  if (
    minRatingValue !== undefined &&
    maxRatingValue !== undefined &&
    minRatingValue > maxRatingValue
  ) {
    throw new AppError("Đánh giá thấp nhất không được lớn hơn đánh giá cao nhất.", 400);
  }

  if (
    minPurchaseValue !== undefined &&
    maxPurchaseValue !== undefined &&
    minPurchaseValue > maxPurchaseValue
  ) {
    throw new AppError("Lượt mua tối thiểu không được lớn hơn lượt mua tối đa.", 400);
  }

  if (genre && !mongoose.isValidObjectId(genre)) {
    throw new AppError("Thể loại không hợp lệ.", 400);
  }

  if (search !== undefined && !search.trim()) {
    throw new AppError("Từ khóa tìm kiếm không được để trống.", 400);
  }

  if (author !== undefined && !author.trim()) {
    throw new AppError("Tên tác giả không được để trống.", 400);
  }

  // 2. Validate sort
  const sortOptions = {
    trending: { viewCount: -1, createdAt: -1 },
    bestseller: { purchaseCount: -1, createdAt: -1 },
    newest: { createdAt: -1 },
    rating: { ratingAverage: -1, ratingCount: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  if (!sortOptions[sort]) {
    throw new AppError("Kiểu sắp xếp không hợp lệ.", 400);
  }

  // 3. Build filter
  const filter = {
    status: "approved",
  };

  if (search) {
    filter.title = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  if (genre) filter.genre = genre;

  if (author) {
    filter.author = {
      $regex: author.trim(),
      $options: "i",
    };
  }

  if (minPriceValue !== undefined || maxPriceValue !== undefined) {
    filter.price = {};

    if (minPriceValue !== undefined) filter.price.$gte = minPriceValue;
    if (maxPriceValue !== undefined) filter.price.$lte = maxPriceValue;
  }

  if (minRatingValue !== undefined || maxRatingValue !== undefined) {
    filter.ratingAverage = {};

    if (minRatingValue !== undefined) filter.ratingAverage.$gte = minRatingValue;
    if (maxRatingValue !== undefined) filter.ratingAverage.$lte = maxRatingValue;
  }

  if (minPurchaseValue !== undefined || maxPurchaseValue !== undefined) {
    filter.purchaseCount = {};

    if (minPurchaseValue !== undefined) filter.purchaseCount.$gte = minPurchaseValue;
    if (maxPurchaseValue !== undefined) filter.purchaseCount.$lte = maxPurchaseValue;
  }

  // 4. Pagination
  const { page, limit, skip } = getPagination(req.query);

  // 5. Query
  const [books, totalBooks] = await Promise.all([
    Book.find(filter).sort(sortOptions[sort]).skip(skip).limit(limit),

    Book.countDocuments(filter),
  ]);

  // 6. Response
  const meta = buildMeta(page, limit, totalBooks);

  sendSuccess(res, books, "Lấy danh sách sách thành công.", meta);
});

const getRelatedBooks = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  // Find the book by ID
  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Không tìm thấy sách.", 404);
  }

  // Find related books (same genre)
  const relatedBooks = await Book.find({
    _id: { $ne: bookId },
    genre: book.genre,
  }).limit(5);

  sendSuccess(res, relatedBooks, "Lấy sách liên quan thành công.");
});

const getBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  // Find the book by ID
  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Không tìm thấy sách.", 404);
  }

  sendSuccess(res, book, "Lấy thông tin sách thành công.", 200);
});

module.exports = {
  getBooks,
  getRelatedBooks,
  getBookById,
};
