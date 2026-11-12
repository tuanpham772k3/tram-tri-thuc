const { default: mongoose } = require("mongoose");
const Cart = require("../models/cart.model");
const Book = require("../models/book.model");
const Library = require("../models/library.model");
const { sendSuccess, AppError, asyncHandler } = require("../utils/helper");

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId }).populate(
    "items.bookId",
    "title author coverImage price status"
  );

  if (!cart) {
    return sendSuccess(
      res,
      { items: [], totalItems: 0, totalAmount: 0 },
      "Giỏ hàng đang trống."
    );
  }

  // Loại bỏ sách đã bị xóa khỏi database
  const items = cart.items.filter((item) => item.bookId);

  // Chỉ tính tiền những sách được chọn
  const selectedItems = items.filter((item) => item.isSelected);

  const totalAmount = selectedItems.reduce((total, item) => total + item.bookId.price, 0);

  sendSuccess(
    res,
    {
      items,
      totalItems: items.length,
      totalAmount,
    },
    "Lấy giỏ hàng thành công."
  );
});

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError("ID sách không hợp lệ.", 400);
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Không tìm thấy sách.", 404);
  }

  // Kiểm tra sách đã được mua chưa
  const isPurchased = await Library.exists({
    customerId: userId,
    bookId,
  });

  if (isPurchased) {
    throw new AppError("Bạn đã sở hữu sách này.", 400);
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ bookId, isSelected: true }],
    });
  } else {
    const isExist = cart.items.some((item) => item.bookId.toString() === bookId);

    if (isExist) {
      throw new AppError("Sách đã có trong giỏ hàng.", 400);
    }

    cart.items.push({ bookId, isSelected: true });
    await cart.save();
  }

  return sendSuccess(res, cart, "Thêm sách vào giỏ hàng thành công.", 201);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError("ID sách không hợp lệ.", 400);
  }

  const cart = await Cart.findOneAndUpdate(
    { userId },
    {
      $pull: {
        items: { bookId },
      },
    },
    { new: true }
  );

  if (!cart) {
    throw new AppError("Không tìm thấy giỏ hàng.", 404);
  }

  return sendSuccess(res, cart, "Xóa sách khỏi giỏ hàng thành công.");
});

const updateCartSelection = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.params;
  const { isSelected } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError("ID sách không hợp lệ.", 400);
  }

  if (typeof isSelected !== "boolean") {
    throw new AppError("isSelected phải là boolean.", 400);
  }

  const cart = await Cart.findOneAndUpdate(
    {
      userId,
      "items.bookId": bookId,
    },
    {
      $set: {
        "items.$.isSelected": isSelected,
      },
    },
    { new: true, runValidators: true }
  );

  if (!cart) {
    throw new AppError("Không tìm thấy sách trong giỏ hàng.", 404);
  }

  return sendSuccess(res, cart, "Cập nhật lựa chọn thành công.");
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { new: true }
  );

  if (!cart) {
    throw new AppError("Không tìm thấy giỏ hàng.", 404);
  }

  return sendSuccess(res, cart, "Đã xóa toàn bộ giỏ hàng.");
});

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartSelection,
  clearCart,
};
