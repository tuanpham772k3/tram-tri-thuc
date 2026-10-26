import React, { useState, useMemo, useEffect } from "react";
import {
  RefreshCw,
  BookOpen,
  Search,
  Filter,
  Calendar,
  Eye,
  Send,
  FileText,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Wallet,
  Mail,
  ShieldCheck,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import showToast from "../../utils/toast";

// ==========================================
// MOCK DATA STRUCTURE (Digital Book Seller)
// ==========================================
const INITIAL_ORDERS = [
  {
    orderId: "ORD-2026-9821",
    customer: {
      name: "Nguyễn Văn An",
      email: "an.nguyen@example.com",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    },
    bookDetails: {
      title: "Thiết Kế Hệ Thống Phân Tán Scalable",
      cover:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
      format: "EPUB + PDF",
      fileSize: "18.4 MB",
      author: "Trần Minh Đức",
    },
    price: 350000,
    platformFee: 35000, // 10%
    sellerEarnings: 315000,
    status: "Completed",
    paymentMethod: "MOMO",
    transactionId: "MM-9821-33211",
    createdAt: "2026-10-25T14:32:00Z",
    downloadCount: 3,
    maxDownloads: 5,
    downloadLogs: [
      {
        timestamp: "2026-10-25T14:35:10Z",
        ip: "113.161.42.12",
        device: "Chrome / macOS",
      },
      {
        timestamp: "2026-10-25T15:10:02Z",
        ip: "113.161.42.12",
        device: "Books App / iOS",
      },
      {
        timestamp: "2026-10-25T18:22:45Z",
        ip: "14.232.110.88",
        device: "Chrome / Windows",
      },
    ],
  },
  {
    orderId: "ORD-2026-9820",
    customer: {
      name: "Trần Thị Mai",
      email: "mai.tran@gmail.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    },
    bookDetails: {
      title: "Mastering React 19 & Next.js App Router (Audiobook)",
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300",
      format: "Audiobook",
      fileSize: "420.5 MB",
      author: "Trần Minh Đức",
    },
    price: 490000,
    platformFee: 49000,
    sellerEarnings: 441000,
    status: "Completed",
    paymentMethod: "VNPay",
    transactionId: "VNP-8832109",
    createdAt: "2026-10-25T11:15:00Z",
    downloadCount: 1,
    maxDownloads: 5,
    downloadLogs: [
      { timestamp: "2026-10-25T11:20:00Z", ip: "27.72.61.102", device: "Safari / iOS" },
    ],
  },
  {
    orderId: "ORD-2026-9819",
    customer: {
      name: "Lê Hoàng Long",
      email: "long.le.tech@outlook.com",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
    },
    bookDetails: {
      title: "Lập Trình Go Cho Enterprise Architecture",
      cover:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300",
      format: "PDF",
      fileSize: "12.1 MB",
      author: "Trần Minh Đức",
    },
    price: 280000,
    platformFee: 28000,
    sellerEarnings: 252000,
    status: "Processing",
    paymentMethod: "Credit Card",
    transactionId: "CC-3321-8812",
    createdAt: "2026-10-25T09:40:00Z",
    downloadCount: 0,
    maxDownloads: 5,
    downloadLogs: [],
  },
  {
    orderId: "ORD-2026-9818",
    customer: {
      name: "Phạm Quốc Bảo",
      email: "bao.pham@techasia.io",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    },
    bookDetails: {
      title: "Fullstack SaaS Playbook: Từ Ý Tưởng Đến 10k ARR",
      cover:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300",
      format: "Bundle PDF+EPUB",
      fileSize: "45.0 MB",
      author: "Trần Minh Đức",
    },
    price: 650000,
    platformFee: 65000,
    sellerEarnings: 585000,
    status: "Completed",
    paymentMethod: "Crypto",
    transactionId: "0x8f2a...39a1",
    createdAt: "2026-10-24T18:05:00Z",
    downloadCount: 4,
    maxDownloads: 5,
    downloadLogs: [
      { timestamp: "2026-10-24T18:10:00Z", ip: "118.69.182.2", device: "Chrome / Linux" },
      { timestamp: "2026-10-24T20:15:30Z", ip: "118.69.182.2", device: "Chrome / Linux" },
    ],
  },
  {
    orderId: "ORD-2026-9817",
    customer: {
      name: "Đặng Thu Thảo",
      email: "thao.dang@designstudio.vn",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    },
    bookDetails: {
      title: "UI/UX Micro-Interactions & Motion Design 2026",
      cover:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=300",
      format: "PDF",
      fileSize: "85.2 MB",
      author: "Trần Minh Đức",
    },
    price: 320000,
    platformFee: 32000,
    sellerEarnings: 288000,
    status: "Refunded",
    paymentMethod: "MOMO",
    transactionId: "MM-9817-22910",
    createdAt: "2026-10-24T14:20:00Z",
    downloadCount: 1,
    maxDownloads: 5,
    downloadLogs: [
      {
        timestamp: "2026-10-24T14:25:00Z",
        ip: "203.162.4.190",
        device: "Edge / Windows",
      },
    ],
  },
  {
    orderId: "ORD-2026-9816",
    customer: {
      name: "Vũ Khánh Linh",
      email: "linh.vu@gmail.com",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
    },
    bookDetails: {
      title: "Mastering React 19 & Next.js App Router (Audiobook)",
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300",
      format: "Audiobook",
      fileSize: "420.5 MB",
      author: "Trần Minh Đức",
    },
    price: 490000,
    platformFee: 49000,
    sellerEarnings: 441000,
    status: "Failed",
    paymentMethod: "VNPay",
    transactionId: "VNP-ERR-9921",
    createdAt: "2026-10-23T22:10:00Z",
    downloadCount: 0,
    maxDownloads: 5,
    downloadLogs: [],
  },
  {
    orderId: "ORD-2026-9815",
    customer: {
      name: "Hoàng Minh Trí",
      email: "tri.hoang@fintech.io",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    },
    bookDetails: {
      title: "Thiết Kế Hệ Thống Phân Tán Scalable",
      cover:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
      format: "EPUB + PDF",
      fileSize: "18.4 MB",
      author: "Trần Minh Đức",
    },
    price: 350000,
    platformFee: 35000,
    sellerEarnings: 315000,
    status: "Completed",
    paymentMethod: "Credit Card",
    transactionId: "CC-9011-2291",
    createdAt: "2026-10-23T16:45:00Z",
    downloadCount: 2,
    maxDownloads: 5,
    downloadLogs: [
      { timestamp: "2026-10-23T16:50:00Z", ip: "14.161.20.10", device: "Chrome / macOS" },
    ],
  },
];

// Helper Formatter
const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SellerOrderPage() {
  // State
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formatFilter, setFormatFilter] = useState("All");
  const [dateRange, setDateRange] = useState("7days");
  const [sortBy, setSortBy] = useState("newest");

  // Selected Order Drawer
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Modals state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Search
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          order.orderId.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.bookDetails.title.toLowerCase().includes(query);

        // Status
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;

        // Format
        const matchesFormat =
          formatFilter === "All" || order.bookDetails.format.includes(formatFilter);

        return matchesSearch && matchesStatus && matchesFormat;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "priceHigh") return b.price - a.price;
        if (sortBy === "earningsHigh") return b.sellerEarnings - a.sellerEarnings;
        return 0;
      });
  }, [orders, searchQuery, statusFilter, formatFilter, sortBy]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === "Completed");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);
    const netEarnings = completedOrders.reduce((sum, o) => sum + o.sellerEarnings, 0);
    const platformFees = completedOrders.reduce((sum, o) => sum + o.platformFee, 0);
    const refundedCount = orders.filter((o) => o.status === "Refunded").length;
    const refundRate = ((refundedCount / totalOrders) * 100).toFixed(1);

    return {
      totalRevenue,
      netEarnings,
      platformFees,
      completedCount: completedOrders.length,
      refundRate,
      availableBalance: 18450000, // Mock balance ready to withdraw
    };
  }, [orders]);

  // Handle Resend Link Action
  const handleResendLink = (order) => {
    showToast(
      `Đã gửi lại link tải sách cho khách hàng ${order.customer.name} (${order.customer.email})!`
    );
  };

  // Handle Withdrawal Submission
  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(withdrawAmount);
    if (!numAmount || numAmount < 100000) {
      showToast("Số tiền rút tối thiểu là 100.000 VNĐ", "error");
      return;
    }
    if (numAmount > stats.availableBalance) {
      showToast("Số tiền vượt quá số dư khả dụng", "error");
      return;
    }

    showToast(
      `Đã gửi yêu cầu rút ${formatVND(numAmount)}. Tiền sẽ về tài khoản trong 24h!`
    );
    setIsWithdrawModalOpen(false);
    setWithdrawAmount("");
  };

  return (
    <div>
      {/* Main Container */}
      <div className="p-6 space-y-8">
        {/* TOP BAR / BRAND HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Đơn Hàng</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Quản lý giao dịch sách digital, audiobooks và theo dõi doanh thu thực nhận
            </p>
          </div>

          {/* Quick Actions & Balance Pill */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-200 border border-gray-300 px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold">
                  Khả dụng rút
                </div>
                <div className="text-sm font-bold text-emerald-500">
                  {formatVND(stats.availableBalance)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-violet-600 hover:bg-violet-500 active:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 border border-indigo-500/30 cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Rút tiền</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT 1: ORDERS LIST VIEW */}
        <div className="space-y-6">
          {/* FILTER & SEARCH BAR */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo mã đơn, tên khách, tên sách..."
                  className="w-full bg-slate-100 border border-slate-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-slate-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                {/* Status Dropdown Filter */}
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-800 px-3 py-2 rounded-xl text-xs">
                  <Filter className="w-3.5 h-3.5 text-gray-800 font-bold" />
                  <span className="text-gray-800 font-bold">Trạng thái:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-gray-900 font-medium outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-slate-100">
                      Tất cả
                    </option>
                    <option value="Completed" className="bg-slate-100">
                      Thành công
                    </option>
                    <option value="Processing" className="bg-slate-100">
                      Đang xử lý
                    </option>
                    <option value="Refunded" className="bg-slate-100">
                      Hoàn tiền
                    </option>
                    <option value="Failed" className="bg-slate-100">
                      Thất bại
                    </option>
                  </select>
                </div>

                {/* Format Filter */}
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-800 px-3 py-2 rounded-xl text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-gray-900 font-bold" />
                  <span className="text-gray-900 font-bold">Định dạng:</span>
                  <select
                    value={formatFilter}
                    onChange={(e) => setFormatFilter(e.target.value)}
                    className="bg-transparent text-gray-900 font-medium outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-slate-100">
                      Tất cả
                    </option>
                    <option value="PDF" className="bg-slate-100">
                      PDF
                    </option>
                    <option value="EPUB" className="bg-slate-100">
                      EPUB
                    </option>
                    <option value="Audiobook" className="bg-slate-100">
                      Audiobook
                    </option>
                  </select>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-800 px-3 py-2 rounded-xl text-xs">
                  <Calendar className="w-3.5 h-3.5 text-gray-900 font-bold" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer"
                  >
                    <option value="today" className="bg-slate-100">
                      Hôm nay
                    </option>
                    <option value="7days" className="bg-slate-100">
                      7 ngày qua
                    </option>
                    <option value="30days" className="bg-slate-100">
                      Tháng này
                    </option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-800 px-3 py-2 rounded-xl text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gray-900 font-bold" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer"
                  >
                    <option value="newest" className="bg-slate-100">
                      Mới nhất
                    </option>
                    <option value="oldest" className="bg-slate-100">
                      Cũ nhất
                    </option>
                    <option value="priceHigh" className="bg-slate-100">
                      Giá cao nhất
                    </option>
                    <option value="earningsHigh" className="bg-slate-100">
                      Doanh thu cao nhất
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ORDERS TABLE CONTAINER */}
          <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-violet-600 text-[11px] uppercase tracking-wider text-slate-200 font-semibold">
                    <th className="py-4 px-5">Đơn Hàng / Sản Phẩm</th>
                    <th className="py-4 px-5">Khách Hàng</th>
                    <th className="py-4 px-5">Thanh Toán</th>
                    <th className="py-4 px-5">Tổng Tiền / Thực Nhận</th>
                    <th className="py-4 px-5 text-center">Tải Sách</th>
                    <th className="py-4 px-5 text-center">Trạng Thái</th>
                    <th className="py-4 px-5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 text-sm">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-900">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <BookOpen className="w-8 h-8 text-slate-600" />
                          <p className="text-base font-medium">
                            Không tìm thấy đơn hàng phù hợp
                          </p>
                          <p className="text-xs text-slate-600">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isCompleted = order.status === "Completed";
                      const isProcessing = order.status === "Processing";
                      const isRefunded = order.status === "Refunded";

                      return (
                        <tr
                          key={order.orderId}
                          className="hover:bg-slate-200 transition-colors group cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          {/* Order & Book Info */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={order.bookDetails.cover}
                                alt={order.bookDetails.title}
                                className="w-11 h-14 object-cover rounded-lg shadow border border-slate-200 shrink-0"
                              />
                              <div className="space-y-1 max-w-xs">
                                <div className="font-semibold text-gray-900 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                  {order.bookDetails.title}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono text-gray-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                    #{order.orderId}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                    {order.bookDetails.format}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Customer Info */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={order.customer.avatar}
                                alt={order.customer.name}
                                className="w-8 h-8 rounded-full border border-slate-700"
                              />
                              <div>
                                <div className="font-medium text-gray-900 text-xs sm:text-sm">
                                  {order.customer.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {order.customer.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Payment Method & Time */}
                          <td className="py-4 px-5">
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-gray-900 flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5 text-gray-900" />
                                <span>{order.paymentMethod}</span>
                              </div>
                              <div className="text-[11px] text-gray-900">
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                          </td>

                          {/* Price Breakdown */}
                          <td className="py-4 px-5">
                            <div className="space-y-0.5">
                              <div className="font-bold text-gray-900">
                                {formatVND(order.price)}
                              </div>
                              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                <span>Thực nhận:</span>
                                <span>{formatVND(order.sellerEarnings)}</span>
                              </div>
                            </div>
                          </td>

                          {/* Download Status */}
                          <td className="py-4 px-5 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-xs font-semibold text-gray-500">
                                {order.downloadCount} / {order.maxDownloads}
                              </span>
                              <div className="w-16 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                                <div
                                  className="bg-violet-500 h-1.5 rounded-full"
                                  style={{
                                    width: `${
                                      (order.downloadCount / order.maxDownloads) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* Order Status Badge */}
                          <td className="py-4 px-5 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                isCompleted
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : isProcessing
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  : isRefunded
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              }`}
                            >
                              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {isProcessing && (
                                <Clock className="w-3.5 h-3.5 animate-spin" />
                              )}
                              {isRefunded && <RefreshCw className="w-3.5 h-3.5" />}
                              {!isCompleted && !isProcessing && !isRefunded && (
                                <XCircle className="w-3.5 h-3.5" />
                              )}

                              {isCompleted && "Thành công"}
                              {isProcessing && "Đang xử lý"}
                              {isRefunded && "Đã hoàn tiền"}
                              {order.status === "Failed" && "Thất bại"}
                            </span>
                          </td>

                          {/* Action Menu */}
                          <td
                            className="py-4 px-5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 hover:bg-slate-400/50 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                                title="Xem chi tiết đơn hàng"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleResendLink(order)}
                                className="p-2 hover:bg-slate-400/50 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                                title="Gửi lại link tải"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination mock */}
            <div className="py-3 px-5 border-t border-slate-200/80 bg-violet-600 flex items-center justify-between text-xs text-slate-100">
              <span>
                Hiển thị <strong>{filteredOrders.length}</strong> trên tổng số{" "}
                <strong>{orders.length}</strong> đơn hàng
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 disabled:opacity-50"
                  disabled
                >
                  Trước
                </button>
                <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-100">
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* DRAWER: ORDER DETAILS & AUDIT LOG          */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
            />

            {/* Drawer Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-slate-900 border-l border-slate-800 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">Chi Tiết Đơn Hàng</h2>
                      <span className="font-mono text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                        #{selectedOrder.orderId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tạo lúc: {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Digital Product Details Card */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Sản phẩm kỹ thuật số
                  </div>
                  <div className="flex gap-4">
                    <img
                      src={selectedOrder.bookDetails.cover}
                      alt={selectedOrder.bookDetails.title}
                      className="w-16 h-20 object-cover rounded-lg shadow border border-slate-700"
                    />
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white">
                        {selectedOrder.bookDetails.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        Tác giả: {selectedOrder.bookDetails.author}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded font-medium border border-indigo-500/20">
                          Format: {selectedOrder.bookDetails.format}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Dung lượng: {selectedOrder.bookDetails.fileSize}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Thông tin người mua
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedOrder.customer.avatar}
                      alt={selectedOrder.customer.name}
                      className="w-10 h-10 rounded-full border border-slate-700"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {selectedOrder.customer.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />{" "}
                        {selectedOrder.customer.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Chi tiết thanh toán & Chiết khấu
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Mã giao dịch (TxID):</span>
                      <span className="font-mono text-indigo-400">
                        {selectedOrder.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Cổng thanh toán:</span>
                      <span className="font-semibold text-white">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-300">
                      <span>Giá bán công bố:</span>
                      <span>{formatVND(selectedOrder.price)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Phí dịch vụ nền tảng (10%):</span>
                      <span className="text-rose-400">
                        - {formatVND(selectedOrder.platformFee)}
                      </span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-emerald-400">
                      <span>Doanh thu thực nhận (Seller Profit):</span>
                      <span>{formatVND(selectedOrder.sellerEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Download Audit Trail (Digital Security) */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" /> Lịch sử tải file
                      (Digital Audit Log)
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedOrder.downloadCount}/{selectedOrder.maxDownloads} lượt tải
                    </span>
                  </div>

                  {selectedOrder.downloadLogs.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-2">
                      Khách hàng chưa tải xuống tài sản số này.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {selectedOrder.downloadLogs.map((log, i) => (
                        <div
                          key={i}
                          className="text-[11px] bg-slate-900 p-2 rounded border border-slate-800/80 flex items-center justify-between text-slate-400"
                        >
                          <div>
                            <span className="text-slate-200 font-mono">{log.ip}</span>
                            <span className="mx-1.5">•</span>
                            <span>{log.device}</span>
                          </div>
                          <span className="text-slate-500">
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="border-t border-slate-800 pt-4 flex items-center gap-3">
                <button
                  onClick={() => handleResendLink(selectedOrder)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi lại Link tải file
                </button>
                <button
                  onClick={() =>
                    showToast(
                      `Đã xuất hóa đơn PDF cho đơn hàng #${selectedOrder.orderId}`
                    )
                  }
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" /> Tải Hóa Đơn
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL: WITHDRAWAL REQUEST                  */}
      {/* ========================================== */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWithdrawModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Yêu Cầu Rút Tiền</h3>
                </div>
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Số dư khả dụng:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {formatVND(stats.availableBalance)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Số tiền muốn rút (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Ví dụ: 5000000"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Rút tối thiểu 100.000 VNĐ. Miễn phí giao dịch.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tài khoản nhận tiền
                  </label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none">
                    <option>Techcombank - 1903****6888 (Nguyễn Văn Seller)</option>
                    <option>Vietcombank - 0071****1102 (Nguyễn Văn Seller)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    Xác nhận rút tiền
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
