const Book = require("../models/book.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const {
  AppError,
  sendSuccess,
  asyncHandler,
  getPagination,
  buildMeta,
} = require("../utils/helper");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const ALLOWED_GENRES = [
  "ky-nang-song",
  "tam-ly-hoc",
  "khai-tam",
  "tieu-thuyet",
  "vh-xh",
  "kinh-doanh",
  "ngon-tinh",
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ALLOWED_BOOK_TYPES = ["application/epub"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_BOOK_SIZE = 20 * 1024 * 1024; // 20 MB

const uploadNewBook = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { title, description, price, genre } = req.body;
  const coverImage = req.files?.coverImage?.[0];
  const bookFile = req.files?.fileUrl?.[0];

  // Validate title
  if (typeof title !== "string" || !title.trim() || title.trim().length > 200) {
    throw new AppError("Tên sách không hợp lệ", 400);
  }

  // Validate description
  if (
    typeof description !== "string" ||
    !description.trim() ||
    description.trim().length > 5000
  ) {
    throw new AppError("Mô tả sách không hợp lệ", 400);
  }

  // Validate price
  const parsedPrice = Number(price);

  if (
    price === undefined ||
    price === null ||
    String(price).trim() === "" ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice <= 0
  ) {
    throw new AppError("Giá sách phải lớn hơn 0", 400);
  }

  // Validate genre
  if (typeof genre !== "string" || !ALLOWED_GENRES.includes(genre)) {
    throw new AppError("Thể loại sách không hợp lệ", 400);
  }

  // Validate cover image
  if (!coverImage) {
    throw new AppError("Vui lòng tải ảnh bìa sách", 400);
  }

  if (!ALLOWED_IMAGE_TYPES.includes(coverImage.mimetype)) {
    throw new AppError("Ảnh bìa phải là JPG, PNG hoặc WebP", 400);
  }

  if (coverImage.size > MAX_IMAGE_SIZE) {
    throw new AppError("Ảnh bìa không được vượt quá 5 MB", 400);
  }

  // Validate book file
  if (!bookFile) {
    throw new AppError("Vui lòng tải file sách", 400);
  }

  if (!ALLOWED_BOOK_TYPES.includes(bookFile.mimetype)) {
    throw new AppError("File sách phải là PDF hoặc EPUB", 400);
  }

  if (bookFile.size > MAX_BOOK_SIZE) {
    throw new AppError("File sách không được vượt quá 20 MB", 400);
  }

  // Upload 2 file lên Cloudinary
  const [uploadedCover, uploadedBook] = await Promise.all([
    uploadToCloudinary(coverImage, "image"),
    uploadToCloudinary(bookFile, "raw"),
  ]);

  const newBook = await Book.create({
    sellerId,
    title: title.trim(),
    description: description.trim(),
    genre,
    price: Number(price),
    coverImage: uploadedCover.secure_url,
    fileUrl: uploadedBook.secure_url,
  });

  sendSuccess(res, newBook, "Đã tạo thành công sách mới", 201);
});

module.exports = {
  uploadNewBook,
};
