const Book = require("../models/book.model");
const Library = require("../models/library.model");
const { asyncHandler, getPagination, buildMeta, AppError } = require("../utils/helper");

const getLibraryBooks = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const {
    status = "all",
    genre,
    author,
    search,
    sort = "recently-purchased",
  } = req.query;

  const { page, limit, skip } = getPagination(req.query);

  // 1. Lọc sách
  const bookFilter = {};

  if (genre) {
    bookFilter.genre = genre;
  }

  if (author) {
    bookFilter.author = new RegExp(author, "i");
  }

  if (search) {
    bookFilter.title = new RegExp(search, "i");
  }

  const bookIds = await Book.distinct("_id", bookFilter);

  // 2. Lọc thư viện
  const libraryFilter = {
    customerId,
    bookId: { $in: bookIds },
  };

  if (status === "reading") {
    libraryFilter.progress = { $gt: 0, $lt: 100 };
  } else if (status === "unread") {
    libraryFilter.progress = 0;
  } else if (status === "completed") {
    libraryFilter.progress = { $gte: 100 };
  }

  // 3. Sắp xếp
  const sortOptions = {
    "recently-read": { lastReadAt: -1 },
    "recently-purchased": { purchasedAt: -1 },
    "progress-desc": { progress: -1 },
    "progress-asc": { progress: 1 },
  };

  const sortOption = sortOptions[sort] || sortOptions["recently-purchased"];

  // 4. Lấy dữ liệu
  const [libraryBooks, totalBooks] = await Promise.all([
    Library.find(libraryFilter)
      .populate("bookId", "title author genre description coverImage fileUrl")
      .sort(sortOption)
      .skip(skip)
      .limit(limit),

    Library.countDocuments(libraryFilter),
  ]);

  const meta = buildMeta(page, limit, totalBooks);

  return sendSuccess(res, libraryBooks, "Lấy sách trong thư viện thành công.", 200, meta);
});

const getBookToRead = asyncHandler(async (req, res) => {
  const customerId = req.user._id;
  const { bookId } = req.params;

  const libraryBook = await Library.findOne({ customerId, bookId }).populate(
    "bookId",
    "title author coverImage fileUrl"
  );

  if (!libraryBook) {
    throw new AppError("Không tìm thấy sách trong thư viện.", 404);
  }

  sendSuccess(
    res,
    {
      book: libraryBook.bookId,
      lastLocation: libraryBook.lastLocation,
      progress: libraryBook.progress,
    },
    "Lấy thông tin sách thành công.",
    200
  );
});

const updateReadingProgress = asyncHandler(async (req, res) => {
  const customerId = req.user._id;
  const { bookId } = req.params;
  const { lastLocation, progress } = req.body;

  if (typeof lastLocation !== "string" || !lastLocation.trim()) {
    throw new AppError("Vị trí đọc không hợp lệ.", 400);
  }

  if (
    typeof progress !== "number" ||
    !Number.isFinite(progress) ||
    progress < 0 ||
    progress > 100
  ) {
    throw new AppError("Tiến độ đọc phải từ 0 đến 100.", 400);
  }

  const libraryBook = await Library.findOneAndUpdate(
    { customerId, bookId },
    {
      $set: {
        lastLocation,
        progress,
        lastReadAt: new Date(),
      },
    },
    { new: true, runValidators: true }
  );

  if (!libraryBook) {
    throw new AppError("Bạn chưa sở hữu sách này.", 404);
  }

  return sendSuccess(
    res,
    {
      lastLocation: libraryBook.lastLocation,
      progress: libraryBook.progress,
      lastReadAt: libraryBook.lastReadAt,
    },
    "Lưu tiến độ đọc thành công."
  );
});

module.exports = {
  getLibraryBooks,
  getBookToRead,
  updateReadingProgress,
};
