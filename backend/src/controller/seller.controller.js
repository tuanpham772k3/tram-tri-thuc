const Book = require("../models/book.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");

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

const ALLOWED_BOOK_TYPES = ["application/epub+zip"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_BOOK_SIZE = 20 * 1024 * 1024; // 20 MB

const uploadNewBook = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { title, author, description, price, genre } = req.body;
  const coverImage = req.files?.coverImage?.[0];
  const bookFile = req.files?.fileUrl?.[0];

  // Validate title
  if (typeof title !== "string" || !title.trim() || title.trim().length > 200) {
    throw new AppError("Tên sách không hợp lệ", 400);
  }

  // Validate author
  if (typeof author !== "string" || !author.trim()) {
    throw new AppError("Tác giả không hợp lệ", 400);
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
    throw new AppError("File sách phải là EPUB", 400);
  }

  if (bookFile.size > MAX_BOOK_SIZE) {
    throw new AppError("File sách không được vượt quá 20 MB", 400);
  }

  // Upload 2 file cùng lúc lên Cloudinary
  const [uploadedCover, uploadedBook] = await Promise.all([
    uploadToCloudinary(coverImage, "image"),
    uploadToCloudinary(bookFile, "raw"),
  ]);

  const newBook = await Book.create({
    sellerId,
    title: title.trim(),
    author: author.trim(),
    description: description.trim(),
    genre,
    price: Number(price),
    coverImage: uploadedCover.secure_url,
    fileUrl: uploadedBook.secure_url,
  });

  sendSuccess(res, newBook, "Đã tạo thành công sách mới", 201);
});

const getSellerBooks = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const { page, limit, skip } = getPagination(req.query);

  const listBooks = await Book.find({ sellerId }).skip(skip).limit(limit);

  const totalBooks = await Book.countDocuments({ sellerId });

  const meta = buildMeta(page, limit, totalBooks);

  sendSuccess(res, listBooks, "Danh sách sách của seller", 200, meta);
});

const updateBookById = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { bookId } = req.params;

  const book = await Book.findOne({ _id: bookId, sellerId });

  if (!book) {
    throw new AppError("Sách không tồn tại", 404);
  }

  const { title, author, description, price, genre } = req.body;

  // Validate and update book information
  book.title = title || book.title;
  book.author = author || book.author;
  book.description = description || book.description;
  book.price = price || book.price;
  book.genre = genre || book.genre;

  await book.save();

  sendSuccess(res, book, "Cập nhật sách thành công", 200);
});

const deleteBookById = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { bookId } = req.params;

  const book = await Book.findOneAndDelete({ _id: bookId, sellerId });

  if (!book) {
    throw new AppError("Sách không tồn tại", 404);
  }

  sendSuccess(res, book, "Xóa sách thành công", 200);
});

const getSellerOverview = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  // 1. Tổng số sách seller đang đăng bán
  const totalListedBooks = await Book.countDocuments({ sellerId, status: "approved" });

  // 2. Lấy danh sách đơn hàng đã hoàn thành
  const completedOrders = await Order.find({
    status: "completed",
  }).select("_id");

  const completedOrderIds = completedOrders.map((order) => order._id);

  // 3. Lấy các sách đã bán của seller
  const soldBooks = await OrderItem.find({
    sellerId,
    orderId: { $in: completedOrderIds },
  }).select("price");

  // 4. Tính tổng số sách đã bán và doanh thu
  const totalSold = soldBooks.length;

  const totalRevenue = soldBooks.reduce((total, item) => total + item.price, 0);

  sendSuccess(
    res,
    {
      totalListedBooks,
      totalSold,
      totalRevenue,
    },
    "Lấy thống kê tổng quan thành công",
    200
  );
});

const getSellerRevenueChart = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { period = "day" } = req.query;

  const formats = {
    day: "%Y-%m-%d",
    month: "%Y-%m",
    year: "%Y",
  };

  if (!formats[period]) {
    throw new AppError("Period không hợp lệ", 400);
  }

  const now = new Date();
  const startDate = new Date();

  if (period === "day") {
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "month") {
    startDate.setMonth(now.getMonth() - 11, 1);
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate.setFullYear(now.getFullYear() - 4, 0, 1);
    startDate.setHours(0, 0, 0, 0);
  }

  const chart = await OrderItem.aggregate([
    { $match: { sellerId } },

    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },

    {
      $match: {
        "order.status": "completed",
      },
    },

    {
      $lookup: {
        from: "payments",
        let: { orderId: "$orderId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$orderId", "$$orderId"] },
              status: "success",
            },
          },
        ],
        as: "payment",
      },
    },

    { $unwind: "$payment" },

    {
      $match: {
        "payment.paidAt": { $gte: startDate },
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: formats[period],
            date: "$payment.paidAt",
          },
        },
        revenue: {
          $sum: { $multiply: ["$price", "$quantity"] },
        },
      },
    },

    { $sort: { _id: 1 } },
  ]);

  sendSuccess(res, chart, "Lấy biểu đồ doanh thu thành công", 200);
});

const getSellerTopBooks = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const topBooks = await Book.find({
    sellerId,
    status: "approved",
    purchaseCount: { $gt: 0 },
  })
    .sort({ purchaseCount: -1 })
    .limit(5)
    .select("title author coverImage price purchaseCount");

  sendSuccess(res, topBooks, "Lấy top 5 sách bán chạy thành công", 200);
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { page, limit, skip } = getPagination(req.query);

  const orderIds = await OrderItem.distinct("orderId", {
    sellerId,
  });

  const [orders, totalOrders] = await Promise.all([
    Order.find({ _id: { $in: orderIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments({
      _id: { $in: orderIds },
    }),
  ]);

  const meta = buildMeta(page, limit, totalOrders);

  sendSuccess(res, orders, "Lấy danh sách đơn hàng thành công", 200, meta);
});

const getSellerOrderById = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    sellerId,
  });

  if (!order) {
    throw new AppError("Đơn hàng không tồn tại", 404);
  }

  sendSuccess(res, order, "Lấy chi tiết đơn hàng thành công", 200);
});

module.exports = {
  uploadNewBook,
  getSellerBooks,
  updateBookById,
  deleteBookById,
  getSellerOverview,
  getSellerRevenueChart,
  getSellerTopBooks,
  getSellerOrders,
  getSellerOrderById,
};
