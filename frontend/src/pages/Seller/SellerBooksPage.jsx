import { useState, useMemo, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Popconfirm,
  Tooltip,
  Space,
  Dropdown,
  notification,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";

// Import Lucide Icons from window.lucideReact
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Grid,
  List,
  ShieldAlert,
  MoreVertical,
  Tag as TagIcon,
  BarChart3,
} from "lucide-react";

// INITIAL MOCK DATA
const INITIAL_BOOKS = [
  {
    id: "BOOK-1001",
    title: "Đắc Nhân Tâm (How to Win Friends and Influence People)",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    isbn: "978-604-58-8888-1",
    price: 86000,
    originalPrice: 110000,
    stock: 150,
    status: "ACTIVE",
    createdAt: "2026-02-15",
    coverImage:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
    description:
      "Cuốn sách đưa ra những lời khuyên về cách ứng xử, ứng biến và giao tiếp với mọi người để đạt được thành công trong cuộc sống.",
    rejectReason: null,
  },
  {
    id: "BOOK-1002",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Công nghệ",
    isbn: "978-013-235088-4",
    price: 380000,
    originalPrice: 450000,
    stock: 45,
    status: "ACTIVE",
    createdAt: "2026-01-20",
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=80",
    description:
      "Hướng dẫn thực hành viết mã sạch, dễ bảo trì và nâng cao tư duy lập trình viên chuyên nghiệp.",
    rejectReason: null,
  },
  {
    id: "BOOK-1003",
    title: "Nhà Giả Kim (The Alchemist)",
    author: "Paulo Coelho",
    category: "Văn học",
    isbn: "978-604-69-8734-2",
    price: 79000,
    originalPrice: 99000,
    stock: 0,
    status: "PENDING",
    createdAt: "2026-03-10",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80",
    description:
      "Hành trình theo đuổi vận mệnh của cậu bé chăn cước Santiago, đem lại bài học sâu sắc về ước mơ.",
    rejectReason: null,
  },
  {
    id: "BOOK-1004",
    title: "Tư Duy Nhanh Và Chậm (Thinking, Fast and Slow)",
    author: "Daniel Kahneman",
    category: "Tâm lý học",
    isbn: "978-0374533557",
    price: 195000,
    originalPrice: 240000,
    stock: 28,
    status: "REJECTED",
    createdAt: "2026-02-01",
    coverImage:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80",
    description:
      "Tổng hợp hàng thập kỷ nghiên cứu về tâm lý học hành vi và tư duy đưa ra quyết định của con người.",
    rejectReason:
      "Hình ảnh ảnh bìa bị mờ, không rõ bản quyền. Vui lòng tải lại bản quét chất lượng cao hơn.",
  },
  {
    id: "BOOK-1005",
    title: "Cha Giàu Cha Nghèo (Rich Dad Poor Dad)",
    author: "Robert T. Kiyosaki",
    category: "Kinh tế",
    isbn: "978-1612680194",
    price: 115000,
    originalPrice: 135000,
    stock: 92,
    status: "ACTIVE",
    createdAt: "2026-03-01",
    coverImage:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&auto=format&fit=crop&q=80",
    description:
      "Bí quyết quản lý tài chính cá nhân và tư duy đầu tư khác biệt giữa người giàu và người nghèo.",
    rejectReason: null,
  },
  {
    id: "BOOK-1006",
    title: "Tâm Lý Học Về Tiền (The Psychology of Money)",
    author: "Morgan Housel",
    category: "Kinh tế",
    isbn: "978-0857197689",
    price: 142000,
    originalPrice: 168000,
    stock: 60,
    status: "PENDING",
    createdAt: "2026-03-22",
    coverImage:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&auto=format&fit=crop&q=80",
    description:
      "19 câu chuyện ngắn khám phá những cách thức kỳ lạ mà con người suy nghĩ về tiền bạc.",
    rejectReason: null,
  },
];

const CATEGORIES = [
  "Văn học",
  "Kinh tế",
  "Công nghệ",
  "Kỹ năng sống",
  "Tâm lý học",
  "Lịch sử",
  "Thiếu nhi",
];

const SellerBooksPage = () => {
  // State Management
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const [form] = Form.useForm();

  // Calculated Metrics
  const metrics = useMemo(() => {
    const total = books.length;
    const active = books.filter((b) => b.status === "ACTIVE").length;
    const pending = books.filter((b) => b.status === "PENDING").length;
    const rejected = books.filter((b) => b.status === "REJECTED").length;
    const totalValue = books.reduce((sum, b) => sum + b.price * b.stock, 0);
    return { total, active, pending, rejected, totalValue };
  }, [books]);

  // Filtering & Sorting Logic
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchSearch =
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

        const matchStatus = statusFilter === "ALL" || book.status === statusFilter;
        const matchCategory =
          categoryFilter === "ALL" || book.category === categoryFilter;

        return matchSearch && matchStatus && matchCategory;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "OLDEST") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "PRICE_ASC") return a.price - b.price;
        if (sortBy === "PRICE_DESC") return b.price - a.price;
        return 0;
      });
  }, [books, searchQuery, statusFilter, categoryFilter, sortBy]);

  // CRUD Operations
  const handleOpenFormModal = (book = null) => {
    setEditingBook(book);
    if (book) {
      form.setFieldsValue(book);
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: "PENDING",
        category: "Công nghệ",
        stock: 10,
        coverImage:
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&auto=format&fit=crop&q=80",
      });
    }
    setIsFormModalOpen(true);
  };

  const handleSaveBook = (values) => {
    if (editingBook) {
      // Update
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editingBook.id
            ? {
                ...b,
                ...values,
                rejectReason:
                  values.status === "REJECTED"
                    ? values.rejectReason || "Thông tin chưa đạt yêu cầu hệ thống."
                    : null,
              }
            : b
        )
      );
      showToast(
        "success",
        "Cập nhật thành công",
        `Đã cập nhật thông tin sách "${values.title}"`
      );
    } else {
      // Create
      const newBook = {
        id: `BOOK-${Date.now().toString().slice(-4)}`,
        ...values,
        createdAt: new Date().toISOString().split("T")[0],
        rejectReason:
          values.status === "REJECTED"
            ? values.rejectReason || "Đã bị từ chối phê duyệt."
            : null,
      };
      setBooks((prev) => [newBook, ...prev]);
      showToast(
        "success",
        "Thêm mới thành công",
        `Đã thêm sách "${values.title}" vào danh sách`
      );
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteBook = (id, title) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    showToast("info", "Đã xóa sách", `Sách "${title}" đã được xóa khỏi hệ thống.`);
  };

  const handleQuickStatusChange = (id, newStatus) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status: newStatus,
            rejectReason:
              newStatus === "REJECTED"
                ? "Bị từ chối qua thao tác phê duyệt nhanh."
                : null,
          };
        }
        return b;
      })
    );
    showToast("success", "Đổi trạng thái", "Cập nhật trạng thái sách thành công!");
  };

  // Render Badge Helper
  const renderStatusBadge = (status, rejectReason = null) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Tag
            color="success"
            className="px-2.5 py-1 rounded-full border-0 font-medium inline-flex items-center gap-1.5"
          >
            <CheckCircle2 size={13} /> Đang bán
          </Tag>
        );
      case "PENDING":
        return (
          <Tag
            color="warning"
            className="px-2.5 py-1 rounded-full border-0 font-medium inline-flex items-center gap-1.5"
          >
            <Clock size={13} /> Chờ duyệt
          </Tag>
        );
      case "REJECTED":
        return (
          <Tooltip title={rejectReason || "Không đạt tiêu chuẩn xuất bản"}>
            <Tag
              color="error"
              className="px-2.5 py-1 rounded-full border-0 font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle size={13} /> Bị từ chối
            </Tag>
          </Tooltip>
        );
      default:
        return <Tag>Khác</Tag>;
    }
  };

  // Table Columns Configuration
  const columns = [
    {
      title: "Sách & Tác giả",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex items-center gap-3 py-1">
          <img
            src={record.coverImage}
            alt={text}
            className="w-12 h-16 object-cover rounded-md shadow-sm border border-slate-200"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
            }}
          />
          <div>
            <div
              className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 max-w-xs"
              onClick={() => {
                setSelectedBook(record);
                setIsDetailModalOpen(true);
              }}
            >
              {text}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Tác giả: <span className="font-medium text-slate-700">{record.author}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              ISBN: {record.isbn}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (cat) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
          {cat}
        </span>
      ),
    },
    {
      title: "Giá bán & Tồn kho",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price, record) => (
        <div>
          <div className="font-semibold text-slate-900">
            {price.toLocaleString("vi-VN")} ₫
          </div>
          {record.originalPrice > price && (
            <div className="text-xs text-slate-400 line-through">
              {record.originalPrice.toLocaleString("vi-VN")} ₫
            </div>
          )}
          <div className="text-xs text-slate-500 mt-0.5">
            Kho: <span className="font-medium text-slate-700">{record.stock}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => renderStatusBadge(status, record.rejectReason),
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <span className="text-slate-600 text-xs">{date}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              shape="circle"
              icon={<Eye size={16} className="text-slate-500 hover:text-indigo-600" />}
              onClick={() => {
                setSelectedBook(record);
                setIsDetailModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              shape="circle"
              icon={<Edit3 size={16} className="text-slate-500 hover:text-amber-600" />}
              onClick={() => handleOpenFormModal(record)}
            />
          </Tooltip>

          <Dropdown
            menu={{
              items: [
                {
                  key: "ACTIVE",
                  label: "Chuyển sang Đang bán",
                  disabled: record.status === "ACTIVE",
                },
                {
                  key: "PENDING",
                  label: "Chuyển sang Chờ duyệt",
                  disabled: record.status === "PENDING",
                },
                {
                  key: "REJECTED",
                  label: "Chuyển sang Bị từ chối",
                  disabled: record.status === "REJECTED",
                },
              ],
              onClick: ({ key }) => handleQuickStatusChange(record.id, key),
            }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<MoreVertical size={16} className="text-slate-400" />}
            />
          </Dropdown>

          <Popconfirm
            title="Xóa sách này?"
            description={`Bạn có chắc muốn xóa "${record.title}" khỏi hệ thống?`}
            onConfirm={() => handleDeleteBook(record.id, record.title)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger shape="circle" icon={<Trash2 size={16} />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 text-slate-800">
      {/* TOP BAR */}
      <div className="mb-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Quản lý sách
            </h1>
            <p className="text-xs text-slate-500">Hệ thống quản lý kho sách & xuất bản</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            onClick={() => handleOpenFormModal(null)}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 flex items-center font-medium"
          >
            Thêm sách mới
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="space-y-6">
        {/* METRICS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: "Tổng số sách",
              value: metrics.total,
              icon: <BookOpen className="text-indigo-600" size={20} />,
              bg: "bg-indigo-50/60 border-indigo-100",
            },
            {
              title: "Đang bán",
              value: metrics.active,
              icon: <CheckCircle2 className="text-emerald-600" size={20} />,
              bg: "bg-emerald-50/60 border-emerald-100",
            },
            {
              title: "Chờ duyệt",
              value: metrics.pending,
              icon: <Clock className="text-amber-600" size={20} />,
              bg: "bg-amber-50/60 border-amber-100",
            },
            {
              title: "Bị từ chối",
              value: metrics.rejected,
              icon: <XCircle className="text-rose-600" size={20} />,
              bg: "bg-rose-50/60 border-rose-100",
            },
            {
              title: "Giá trị kho hàng",
              value: `${(metrics.totalValue / 1000000).toFixed(1)}M ₫`,
              icon: <BarChart3 className="text-cyan-600" size={20} />,
              bg: "bg-cyan-50/60 border-cyan-100",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-4 rounded-xl border ${item.bg} glass-card flex flex-col justify-between shadow-sm`}
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>{item.title}</span>
                {item.icon}
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Input
                placeholder="Tìm kiếm theo Tên sách, Tác giả hoặc mã ISBN..."
                prefix={<Search size={18} className="text-slate-400 mr-2" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                size="large"
                className="rounded-xl"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                size="large"
                className="w-40"
                options={[
                  { label: "Tất cả danh mục", value: "ALL" },
                  ...CATEGORIES.map((c) => ({ label: c, value: c })),
                ]}
              />

              {/* Sort Selector */}
              <Select
                value={sortBy}
                onChange={setSortBy}
                size="large"
                className="w-40"
                options={[
                  { label: "Mới nhất", value: "NEWEST" },
                  { label: "Cũ nhất", value: "OLDEST" },
                  { label: "Giá tăng dần", value: "PRICE_ASC" },
                  { label: "Giá giảm dần", value: "PRICE_DESC" },
                ]}
              />

              {/* View Switcher */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "table"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Chế độ bảng"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Chế độ lưới"
                >
                  <Grid size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Status Tabs (Segmented) */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "ALL", label: "Tất cả", count: books.length },
                {
                  id: "ACTIVE",
                  label: "Đang bán",
                  count: metrics.active,
                  color: "emerald",
                },
                {
                  id: "PENDING",
                  label: "Chờ duyệt",
                  count: metrics.pending,
                  color: "amber",
                },
                {
                  id: "REJECTED",
                  label: "Bị từ chối",
                  count: metrics.rejected,
                  color: "rose",
                },
              ].map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                        isActive
                          ? "bg-slate-700 text-slate-200"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-slate-400">
              Hiển thị{" "}
              <span className="font-semibold text-slate-700">{filteredBooks.length}</span>{" "}
              / {books.length} kết quả
            </span>
          </div>
        </div>

        {/* DATA TABLE / GRID VIEW */}
        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <motion.div
              key="table-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <Table
                dataSource={filteredBooks}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20"],
                  showTotal: (total) => `Tổng số ${total} bản ghi`,
                }}
                className="custom-table"
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x400?text=No+Cover";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        {renderStatusBadge(book.status, book.rejectReason)}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {book.category}
                      </span>

                      <h3
                        className="font-bold text-slate-800 line-clamp-2 hover:text-indigo-600 cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        {book.title}
                      </h3>

                      <p className="text-xs text-slate-500">
                        Tác giả:{" "}
                        <span className="font-medium text-slate-700">{book.author}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-slate-900">
                        {book.price.toLocaleString("vi-VN")} ₫
                      </span>
                      <div className="text-[11px] text-slate-400">
                        Tồn kho: {book.stock}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="text"
                        shape="circle"
                        icon={<Eye size={16} />}
                        onClick={() => {
                          setSelectedBook(book);
                          setIsDetailModalOpen(true);
                        }}
                      />
                      <Button
                        type="text"
                        shape="circle"
                        icon={<Edit3 size={16} />}
                        onClick={() => handleOpenFormModal(book)}
                      />
                      <Popconfirm
                        title="Xóa sách này?"
                        onConfirm={() => handleDeleteBook(book.id, book.title)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button
                          type="text"
                          danger
                          shape="circle"
                          icon={<Trash2 size={16} />}
                        />
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL: THÊM / CHỈNH SỬA SÁCH */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg border-b border-slate-100 pb-3">
            {editingBook ? (
              <Edit3 className="text-amber-500" size={20} />
            ) : (
              <Plus className="text-indigo-600" size={20} />
            )}
            <span>
              {editingBook ? "Chỉnh Sửa Thông Tin Sách" : "Thêm Sách Mới Vào Kho"}
            </span>
          </div>
        }
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        footer={null}
        destroyOnClose
        width={650}
        className="rounded-2xl overflow-hidden"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveBook}
          className="pt-3 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Tên sách"
              rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
              className="col-span-2 mb-2"
            >
              <Input placeholder="Ví dụ: Đắc Nhân Tâm" size="large" />
            </Form.Item>

            <Form.Item
              name="author"
              label="Tác giả"
              rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
              className="mb-2"
            >
              <Input placeholder="Ví dụ: Dale Carnegie" size="large" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true }]}
              className="mb-2"
            >
              <Select size="large">
                {CATEGORIES.map((c) => (
                  <Select.Option key={c} value={c}>
                    {c}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="isbn"
              label="Mã ISBN"
              rules={[{ required: true, message: "Vui lòng nhập mã ISBN!" }]}
              className="mb-2"
            >
              <Input placeholder="978-604-..." size="large" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true }]}
              className="mb-2"
            >
              <Select size="large">
                <Select.Option value="ACTIVE">Đang bán (ACTIVE)</Select.Option>
                <Select.Option value="PENDING">Chờ duyệt (PENDING)</Select.Option>
                <Select.Option value="REJECTED">Bị từ chối (REJECTED)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá bán (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              className="mb-2"
            >
              <Input
                type="number"
                min={0}
                placeholder="100000"
                size="large"
                addonAfter="₫"
              />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Số lượng kho"
              rules={[{ required: true }]}
              className="mb-2"
            >
              <Input type="number" min={0} placeholder="50" size="large" />
            </Form.Item>

            <Form.Item
              name="coverImage"
              label="URL Ảnh Bìa"
              rules={[{ required: true, message: "Vui lòng dán link ảnh bìa!" }]}
              className="col-span-2 mb-2"
            >
              <Input placeholder="https://images.unsplash.com/..." size="large" />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.status !== currentValues.status
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("status") === "REJECTED" ? (
                  <Form.Item
                    name="rejectReason"
                    label="Lý do từ chối phê duyệt"
                    rules={[{ required: true, message: "Vui lòng ghi rõ lý do từ chối" }]}
                    className="col-span-2 mb-2"
                  >
                    <Input.TextArea
                      rows={2}
                      placeholder="Nhập lý do không thông qua sách này..."
                    />
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả tóm tắt"
              className="col-span-2 mb-2"
            >
              <Input.TextArea
                rows={3}
                placeholder="Mô tả nội dung chính của cuốn sách..."
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button onClick={() => setIsFormModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" className="bg-indigo-600">
              {editingBook ? "Cập Nhật" : "Lưu Sách Mới"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL: XEM CHI TIẾT SÁCH */}
      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            className="bg-indigo-600"
            onClick={() => {
              setIsDetailModalOpen(false);
              handleOpenFormModal(selectedBook);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={600}
      >
        {selectedBook && (
          <div className="pt-2 space-y-4">
            <div className="flex gap-4">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                className="w-32 h-44 object-cover rounded-xl shadow-md border border-slate-200 shrink-0"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {renderStatusBadge(selectedBook.status, selectedBook.rejectReason)}
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedBook.id}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 leading-snug">
                  {selectedBook.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Tác giả:{" "}
                  <span className="font-semibold text-slate-700">
                    {selectedBook.author}
                  </span>
                </p>

                <div className="text-xl font-extrabold text-indigo-600 pt-1">
                  {selectedBook.price.toLocaleString("vi-VN")} ₫
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400">Danh mục:</span>{" "}
                    {selectedBook.category}
                  </div>
                  <div>
                    <span className="text-slate-400">Mã ISBN:</span> {selectedBook.isbn}
                  </div>
                  <div>
                    <span className="text-slate-400">Số lượng:</span> {selectedBook.stock}{" "}
                    bản
                  </div>
                  <div>
                    <span className="text-slate-400">Ngày đăng:</span>{" "}
                    {selectedBook.createdAt}
                  </div>
                </div>
              </div>
            </div>

            {selectedBook.status === "REJECTED" && selectedBook.rejectReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 text-xs text-rose-800">
                <ShieldAlert size={18} className="shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Lý do từ chối duyệt:</span>
                  {selectedBook.rejectReason}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mô tả nội dung
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedBook.description || "Chưa có mô tả cho cuốn sách này."}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SellerBooksPage;
