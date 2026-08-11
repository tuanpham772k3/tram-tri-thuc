import { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import FilterPanel from "../../components/Common/FilterPanel";
import CategorySidebar from "../../components/Category/CategorySidebar";
import DocumentList from "../../components/Document/DocumentList";
import { fetchFeaturedDocuments, clearError } from "../../store/slices/documentSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import useDebounce from "../../utils/useDebounce";
import showToast from "../../utils/toast";

// Import hero background image
import heroBackground from "../../assets/images/library-bg.jpg";
import Footer from "../../components/Layout/Footer/Footer";

export default function HomePage() {
    const dispatch = useDispatch();
    const { featuredDocuments, loading, error, featuredPagination } = useSelector(
        (state) => state.documents
    );
    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.categories);

    const [filters, setFilters] = useState({
        search: "",
        startDate: "",
        endDate: "",
        dateField: "createdAt",
        sort: "createdAt:desc",
        page: 1,
        limit: 6,
    });
    const debouncedSearch = useDebounce(filters.search, 500);

    // Fetch categories
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Fetch featured documents
    const fetchDocuments = useCallback(() => {
        const params = {
            ...filters,
            search: debouncedSearch,
            page: filters.page,
            limit: filters.limit,
        };
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== "")
        );
        dispatch(fetchFeaturedDocuments(cleanParams))
            .unwrap()
            .then((data) => console.log("Featured Documents Response:", data))
            .catch((err) => {
                showToast("error", err.message || "Lỗi khi tải tài liệu nổi bật.");
            });
    }, [
        dispatch,
        debouncedSearch,
        filters.page,
        filters.limit,
        filters.startDate,
        filters.endDate,
        filters.dateField,
        filters.sort,
    ]);

    // Trigger fetch when debouncedSearch or other filters change
    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments, debouncedSearch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            showToast("error", error);
            dispatch(clearError());
        }
        if (categoriesError) {
            showToast("error", categoriesError);
            dispatch(clearError());
        }
    }, [error, categoriesError, dispatch]);

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters) => {
        setFilters((prev) => ({ ...newFilters, page: 1 }));
    }, []);

    // Handle page change
    const handlePageChange = useCallback((newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    }, []);

    // Filter configuration - Tối ưu cho layout gọn
    const filtersConfig = useMemo(
        () => [
            {
                key: "search",
                label: "Tìm kiếm",
                type: "search",
                placeholder: "Tìm kiếm tài liệu...",
                icon: "🔍",
            },
            {
                key: "startDate",
                label: "Từ ngày",
                type: "date",
                placeholder: "Chọn ngày bắt đầu",
            },
            {
                key: "endDate",
                label: "Đến ngày",
                type: "date",
                placeholder: "Chọn ngày kết thúc",
            },
        ],
        []
    );

    // Sort options
    const sortOptions = useMemo(
        () => [
            { value: "createdAt:desc", label: "Mới nhất" },
            { value: "createdAt:asc", label: "Cũ nhất" },
        ],
        []
    );

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section với bộ lọc được tối ưu */}
            <div
                className="relative bg-cover bg-center min-h-[450px] flex items-center"
                style={{
                    backgroundImage: `url(${heroBackground})`,
                }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="container mx-auto px-4 pt-16 pb-0 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Khám Phá Kho Tàng Tri Thức
                        </motion.h1>
                        <motion.p
                            className="text-xl md:text-2xl mb-10 text-gray-100 drop-shadow-lg max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Truy cập hàng nghìn tài liệu chất lượng cao từ cộng đồng học thuật
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Bộ lọc được di chuyển đến đây, giữa Hero Section và Main Content */}
            <div className="container mx-auto px-4 py-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="max-w-4xl mx-auto mt-[-6rem] relative z-20"
                >
                    {categoriesLoading ? (
                        <div className="flex justify-center items-center h-16 backdrop-blur-sm bg-white/10 rounded-2xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                        </div>
                    ) : (
                        <div className="backdrop-blur-md bg-gradient-to-br from-white/20 to-gray-100/10 rounded-2xl p-6 border border-gray-200/20 shadow-lg">
                            {/* Search bar chính */}
                            <div className="mb-6">
                                <div className="relative max-w-2xl mx-auto">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tài liệu..."
                                        className="w-full px-6 py-3 text-lg rounded-full border-0 bg-white/95 text-gray-800 backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder-gray-500"
                                        value={filters.search}
                                        onChange={(e) =>
                                            handleFilterChange({
                                                ...filters,
                                                search: e.target.value,
                                            })
                                        }
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Bộ lọc nâng cao - compact layout */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                                {/* Date From */}
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 rounded-xl border-0 bg-white/90 text-gray-800 backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                        value={filters.startDate}
                                        onChange={(e) =>
                                            handleFilterChange({
                                                ...filters,
                                                startDate: e.target.value,
                                            })
                                        }
                                    />
                                    <label className="absolute -top-2 left-3 px-2 bg-white/90 text-sm font-medium text-gray-600 rounded">
                                        Từ ngày
                                    </label>
                                </div>

                                {/* Date To */}
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 rounded-xl border-0 bg-white/90 text-gray-800 backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                        value={filters.endDate}
                                        onChange={(e) =>
                                            handleFilterChange({
                                                ...filters,
                                                endDate: e.target.value,
                                            })
                                        }
                                    />
                                    <label className="absolute -top-2 left-3 px-2 bg-white/90 text-sm font-medium text-gray-600 rounded">
                                        Đến ngày
                                    </label>
                                </div>

                                {/* Sort */}
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2.5 rounded-xl border-0 bg-white/90 text-gray-800 backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 appearance-none cursor-pointer"
                                        value={filters.sort}
                                        onChange={(e) =>
                                            handleFilterChange({ ...filters, sort: e.target.value })
                                        }
                                    >
                                        {sortOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                                className="text-gray-800"
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="absolute -top-2 left-3 px-2 bg-white/90 text-sm font-medium text-gray-600 rounded">
                                        Sắp xếp
                                    </label>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Clear filters button */}
                            {(filters.search ||
                                filters.startDate ||
                                filters.endDate ||
                                filters.sort !== "createdAt:desc") && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() =>
                                            handleFilterChange({
                                                search: "",
                                                startDate: "",
                                                endDate: "",
                                                dateField: "createdAt",
                                                sort: "createdAt:desc",
                                                page: 1,
                                                limit: 6,
                                            })
                                        }
                                        className="inline-flex items-center px-5 py-2 text-sm font-medium text-gray-700 bg-white/80 hover:bg-gray-100 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pt-0 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.aside variants={itemVariants} className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">Danh Mục</h2>
                            <CategorySidebar />
                        </div>
                    </motion.aside>

                    {/* Featured Documents */}
                    <main className="lg:col-span-3">
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm p-6 mb-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Tài Liệu Nổi Bật
                                </h2>
                                {/* Hiển thị số lượng kết quả */}
                                {featuredPagination?.total && (
                                    <span className="text-sm text-gray-500">
                                        {featuredPagination.total} tài liệu
                                    </span>
                                )}
                            </div>

                            {loading && (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}

                            {!loading && !error && featuredDocuments?.length === 0 && (
                                <div className="bg-gray-50 p-8 rounded-lg text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg
                                            className="w-16 h-16 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 text-lg mb-2">
                                        Không tìm thấy tài liệu
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                                    </p>
                                </div>
                            )}

                            <DocumentList
                                type="featured"
                                documents={featuredDocuments}
                                pagination={featuredPagination}
                                onPageChange={handlePageChange}
                                isLoading={loading}
                            />
                        </motion.div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
