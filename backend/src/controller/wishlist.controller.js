const Book = require("../models/book.model");
const Wishlist = require("../models/wishlist.model");
const {
  asyncHandler,
  getPagination,
  sendSuccess,
  buildMeta,
  AppError,
} = require("../utils/helper");

const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ userId }).populate(
    "books",
    "title author description coverImage fileUrl"
  );

  const books = wishlist?.books || [];

  sendSuccess(res, books, "Lấy danh sách yêu thích thành công.", 200);
});

const addBookToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.body;

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Sách không tồn tại.", 404);
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    {
      $addToSet: { books: bookId },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  ).populate("books", "title author description coverImage fileUrl");

  sendSuccess(res, wishlist, "Đã thêm vào danh sách yêu thích.", 201);
});

const removeBookFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.body;

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    {
      $pull: { books: bookId },
    },
    {
      new: true,
    }
  ).populate("books", "title author description coverImage fileUrl");

  sendSuccess(res, wishlist, "Đã thêm vào danh sách yêu thích.", 200);
});

module.exports = {
  getWishlist,
  addBookToWishlist,
  removeBookFromWishlist,
};
