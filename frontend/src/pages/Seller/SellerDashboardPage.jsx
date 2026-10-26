import React, { useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Select,
  Skeleton,
  Spin,
  Tooltip as AntTooltip,
} from "antd";
import {
  BarChart2,
  TrendingUp,
  BookOpen,
  ShoppingBag,
  DollarSign,
  PackageCheck,
  Bell,
  Search,
  RefreshCw,
  Book,
  Star,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_DASHBOARD_DATA = {
  shopInfo: {
    name: "Tiệm Sách Tri Thức",
    owner: "Nguyễn Văn A",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    rating: 4.9,
    reviewsCount: 1250,
    unreadNotifications: 4,
  },
  metrics: {
    totalRevenue: 158420000, // VNĐ
    revenueChange: 14.5, // %
    totalBooksSold: 1420, // Cuốn
    soldChange: 8.2, // %
    activeListings: 385, // Sách đang bán
    listingsChange: -2.1, // %
    avgRating: 4.85,
    pendingOrdersCount: 12,
  },
  chartData: {
    "7d": [
      { date: "Thứ 2", revenue: 4200000, orders: 18 },
      { date: "Thứ 3", revenue: 5800000, orders: 24 },
      { date: "Thứ 4", revenue: 3900000, orders: 15 },
      { date: "Thứ 5", revenue: 7100000, orders: 31 },
      { date: "Thứ 6", revenue: 8500000, orders: 39 },
      { date: "Thứ 7", revenue: 11200000, orders: 52 },
      { date: "Chủ Nhật", revenue: 9800000, orders: 44 },
    ],
    "30d": [
      { date: "Tuần 1", revenue: 28500000, orders: 130 },
      { date: "Tuần 2", revenue: 34200000, orders: 165 },
      { date: "Tuần 3", revenue: 41000000, orders: 198 },
      { date: "Tuần 4", revenue: 54720000, orders: 245 },
    ],
    this_month: [
      { date: "01/10", revenue: 3200000, orders: 14 },
      { date: "05/10", revenue: 4800000, orders: 22 },
      { date: "10/10", revenue: 9100000, orders: 41 },
      { date: "15/10", revenue: 6400000, orders: 28 },
      { date: "20/10", revenue: 8300000, orders: 36 },
      { date: "25/10", revenue: 12500000, orders: 58 },
    ],
  },
  topBooks: [
    {
      id: "BK-001",
      title: "Đắc Nhân Tâm (Khổ Lớn Tái Bản)",
      author: "Dale Carnegie",
      category: "Kỹ năng sống",
      price: 110000,
      soldCount: 342,
      revenue: 37620000,
      stock: 58,
      cover:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "BK-002",
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      category: "Văn học",
      price: 89000,
      soldCount: 289,
      revenue: 25721000,
      stock: 120,
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "BK-003",
      title: "Tâm Lý Học Về Tiền",
      author: "Morgan Housel",
      category: "Kinh tế - Tài chính",
      price: 145000,
      soldCount: 215,
      revenue: 31175000,
      stock: 14,
      cover:
        "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "BK-004",
      title: "Tuổi Trẻ Đáng Giá Bao Nhiêu?",
      author: "Rosie Nguyễn",
      category: "Kỹ năng sống",
      price: 78000,
      soldCount: 198,
      revenue: 15444000,
      stock: 42,
      cover:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "BK-005",
      title: "Cây Cam Ngọt Của Tôi",
      author: "José Mauro de Vasconcelos",
      category: "Văn học",
      price: 108000,
      soldCount: 176,
      revenue: 19008000,
      stock: 89,
      cover:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200",
    },
  ],
  recentOrders: [
    {
      key: "ORD-9821",
      id: "ORD-9821",
      customer: "Trần Thị Mai",
      itemsCount: 3,
      totalAmount: 324000,
      status: "completed",
      paymentMethod: "COD",
      createdAt: "2026-10-25 14:22",
    },
    {
      key: "ORD-9820",
      id: "ORD-9820",
      customer: "Lê Hoàng Nam",
      itemsCount: 1,
      totalAmount: 145000,
      status: "shipping",
      paymentMethod: "Chuyển khoản",
      createdAt: "2026-10-25 12:05",
    },
    {
      key: "ORD-9819",
      id: "ORD-9819",
      customer: "Phạm Minh Đức",
      itemsCount: 2,
      totalAmount: 218000,
      status: "pending",
      paymentMethod: "Ví MoMo",
      createdAt: "2026-10-25 11:30",
    },
    {
      key: "ORD-9818",
      id: "ORD-9818",
      customer: "Nguyễn Bích Ngọc",
      itemsCount: 5,
      totalAmount: 560000,
      status: "completed",
      paymentMethod: "Chuyển khoản",
      createdAt: "2026-10-25 09:15",
    },
    {
      key: "ORD-9817",
      id: "ORD-9817",
      customer: "Đặng Tuấn Anh",
      itemsCount: 1,
      totalAmount: 89000,
      status: "cancelled",
      paymentMethod: "COD",
      createdAt: "2026-10-24 18:40",
    },
  ],
};

// Helper Format Curoff & Numbers
const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );
};

const formatNumber = (num) => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

const SellerDashboardPage = () => {
  const [chartRange, setChartRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(MOCK_DASHBOARD_DATA);
  const [searchQuery, setSearchQuery] = useState("");

  // Mô phỏng reload API
  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate random slight fluctuations
      const randomBoost = Math.floor(Math.random() * 500000);
      setData((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalRevenue: prev.metrics.totalRevenue + randomBoost,
          totalBooksSold: prev.metrics.totalBooksSold + Math.floor(Math.random() * 5),
        },
      }));
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tổng Quan Kinh Doanh
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xin chào{" "}
            <span className="font-medium text-slate-700">{data.shopInfo.owner}</span>, đây
            là tình hình hoạt động của gian hàng hôm nay.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* API Refresh Simulator */}
          <AntTooltip title="Cập nhật lại dữ liệu từ Server (Simulate API)">
            <Button
              icon={
                <RefreshCw
                  className={`w-4 h-4 ${
                    isLoading ? "animate-spin text-emerald-600" : ""
                  }`}
                />
              }
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-1.5 border-slate-200 shadow-sm hover:border-emerald-500 hover:text-emerald-600 rounded-xl"
            >
              <span className="hidden sm:inline text-xs font-medium">Đồng bộ</span>
            </Button>
          </AntTooltip>

          <span className="text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            Lần cuối cập nhật:{" "}
            {new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* SECTION 2: KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tổng Doanh Thu
              </p>
              {isLoading ? (
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 120, marginTop: 8 }}
                />
              ) : (
                <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                  {formatVND(data.metrics.totalRevenue)}
                </h3>
              )}
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +{data.metrics.revenueChange}%
            </span>
            <span className="text-slate-400">so với tháng trước</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        </motion.div>

        {/* Card 2: Books Sold */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Đã Bán
              </p>
              {isLoading ? (
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 100, marginTop: 8 }}
                />
              ) : (
                <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                  {formatNumber(data.metrics.totalBooksSold)}{" "}
                  <span className="text-sm font-normal text-slate-500">cuốn</span>
                </h3>
              )}
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <PackageCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +{data.metrics.soldChange}%
            </span>
            <span className="text-slate-400">tỷ lệ tăng trưởng</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        </motion.div>

        {/* Card 3: Active Listings */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sách Đang Đăng Bán
              </p>
              {isLoading ? (
                <Skeleton.Input active size="small" style={{ width: 80, marginTop: 8 }} />
              ) : (
                <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                  {formatNumber(data.metrics.activeListings)}{" "}
                  <span className="text-sm font-normal text-slate-500">đầu sách</span>
                </h3>
              )}
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Book className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
              Tồn kho ổn định
            </span>
            <span className="text-slate-400">trong 15 danh mục</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
        </motion.div>

        {/* Card 4: Orders & Ratings */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Đơn Hàng Cần Xử Lý
              </p>
              {isLoading ? (
                <Skeleton.Input active size="small" style={{ width: 80, marginTop: 8 }} />
              ) : (
                <h3 className="text-2xl font-black text-rose-600 mt-2 tracking-tight">
                  {data.metrics.pendingOrdersCount}{" "}
                  <span className="text-sm font-normal text-slate-500">chờ duyệt</span>
                </h3>
              )}
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Đánh giá Shop:</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {data.metrics.avgRating} / 5.0
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-pink-500"></div>
        </motion.div>
      </div>

      {/* SECTION 3: REVENUE CHART & TOP BOOKS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE CHART (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-emerald-600" /> Biểu Đồ Doanh Thu
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Theo dõi doanh số bán sách thực tế qua từng mốc thời gian
                </p>
              </div>

              {/* Chart Range Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 self-start">
                <button
                  onClick={() => setChartRange("7d")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    chartRange === "7d"
                      ? "bg-white text-slate-900 shadow-sm font-semibold"
                      : "hover:text-slate-900"
                  }`}
                >
                  7 Ngày qua
                </button>
                <button
                  onClick={() => setChartRange("30d")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    chartRange === "30d"
                      ? "bg-white text-slate-900 shadow-sm font-semibold"
                      : "hover:text-slate-900"
                  }`}
                >
                  30 Ngày
                </button>
                <button
                  onClick={() => setChartRange("this_month")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    chartRange === "this_month"
                      ? "bg-white text-slate-900 shadow-sm font-semibold"
                      : "hover:text-slate-900"
                  }`}
                >
                  Tháng này
                </button>
              </div>
            </div>

            {/* SVG Custom Responsive Bar/Area Chart */}
            <div className="mt-6">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Spin tip="Đang tải dữ liệu biểu đồ..." />
                </div>
              ) : (
                <div className="h-64 w-full relative pt-4">
                  {/* Interactive Canvas/SVG Visual Representation */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
                    <div className="border-b border-dashed border-slate-200 w-full pb-1">
                      12 Tr
                    </div>
                    <div className="border-b border-dashed border-slate-200 w-full pb-1">
                      8 Tr
                    </div>
                    <div className="border-b border-dashed border-slate-200 w-full pb-1">
                      4 Tr
                    </div>
                    <div className="border-b border-slate-200 w-full pb-1">0 VNĐ</div>
                  </div>

                  {/* Bars Container */}
                  <div className="h-full flex items-end justify-between gap-3 sm:gap-6 relative z-10 pt-6 px-4">
                    {data.chartData[chartRange].map((item, idx) => {
                      const maxRev = 12000000;
                      const heightPercent = Math.min(
                        100,
                        Math.max(15, (item.revenue / maxRev) * 100)
                      );

                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center h-full justify-end group"
                        >
                          {/* Tooltip on Hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute -top-4 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20 transform -translate-y-2 group-hover:translate-y-0">
                            <p className="font-semibold">{item.date}</p>
                            <p className="text-emerald-400 font-bold">
                              {formatVND(item.revenue)}
                            </p>
                            <p className="text-slate-300 text-[10px]">
                              {item.orders} đơn hàng
                            </p>
                          </div>

                          {/* Bar Bar Visual */}
                          <div
                            className="w-full max-w-[42px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-md group-hover:shadow-emerald-500/20"
                            style={{ height: `${heightPercent}%` }}
                          ></div>

                          {/* X-Axis Label */}
                          <span className="text-xs font-medium text-slate-500 mt-2 truncate w-full text-center">
                            {item.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Quick Summary */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-emerald-600 to-teal-400"></span>
              <span>Doanh thu thực tế</span>
            </div>
            <div>
              {" "}
              Trung bình/ngày: <strong className="text-slate-800">6,500,000 VNĐ</strong>
            </div>
          </div>
        </div>

        {/* SECTION 4: TOP SELLING BOOKS (1 Column) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" /> Top Sách Bán Chạy
            </h2>
            <a
              href="#view-all"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="mt-4 flex-1 divide-y divide-slate-100 overflow-hidden">
            {isLoading ? (
              <div className="space-y-4 py-2">
                {[1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} avatar active paragraph={{ rows: 1 }} />
                ))}
              </div>
            ) : (
              data.topBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/80 px-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative flex-shrink-0">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-11 h-14 object-cover rounded-md shadow-sm border border-slate-200"
                      />
                      <span
                        className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center text-white shadow-sm ${
                          index === 0
                            ? "bg-amber-500"
                            : index === 1
                            ? "bg-slate-400"
                            : index === 2
                            ? "bg-amber-700"
                            : "bg-slate-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-600 transition">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {book.author}
                      </p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.2 bg-slate-100 text-slate-600 rounded">
                        Đã bán:{" "}
                        <strong className="text-slate-900">{book.soldCount}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-slate-900">
                      {formatVND(book.revenue)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Kho: {book.stock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
