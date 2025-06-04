import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
    FaBook,
    FaGraduationCap,
    FaPencilAlt,
    FaLightbulb,
    FaBrain,
    FaChalkboardTeacher,
    FaBookReader,
    FaAtom,
    FaUniversity,
    FaUserGraduate,
    FaSchool,
    FaBookOpen,
    FaDesktop,
    FaCalculator,
} from "react-icons/fa";
import SearchBar from "../../components/Document/SearchBar";
import FilterPanel from "../../components/Document/FilterPanel";
import DocumentList from "../../components/Document/DocumentList";
import { fetchDownloadedHistory } from "../../store/slices/userSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import useDebounce from "../../utils/useDebounce";
import { toast } from "react-toastify";

const MyDownloadedHistory = () => {
    const dispatch = useDispatch();
    const { downloadedHistory, pagination, loading, error } = useSelector((state) => state.user);
    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.categories);

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        startDate: "",
        endDate: "",
        sort: "downloadedAt:desc",
        page: 1,
        limit: 12,
    });

    const debouncedSearch = useDebounce(filters.search, 300);
    const prevParamsRef = useRef({});

    // Fetch categories
    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 100 }));
    }, [dispatch]);

    // Fetch downloaded history
    const fetchHistoryCallback = useCallback(() => {
        const params = {
            search: debouncedSearch,
            category: filters.category,
            startDate: filters.startDate,
            endDate: filters.endDate,
            sort: filters.sort,
            page: filters.page,
            limit: filters.limit,
        };
        // Clean params
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== "")
        );
        // Skip if params unchanged
        if (JSON.stringify(cleanParams) === JSON.stringify(prevParamsRef.current)) return;
        prevParamsRef.current = cleanParams;

        console.log("Fetching downloaded history with params:", cleanParams);
        dispatch(fetchDownloadedHistory(cleanParams))
            .unwrap()
            .catch((err) => {
                console.error("API Error:", err);
                toast.error(err.message || "Lỗi khi tải lịch sử tải xuống.");
            });
    }, [
        dispatch,
        debouncedSearch,
        filters.category,
        filters.startDate,
        filters.endDate,
        filters.sort,
        filters.page,
        filters.limit,
    ]);

    useEffect(() => {
        fetchHistoryCallback();
    }, [fetchHistoryCallback]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (categoriesError) {
            toast.error(categoriesError);
            dispatch({ type: "categories/clearError" });
        }
    }, [error, categoriesError, dispatch]);

    // Handle filter change
    const handleFilterChange = useCallback((newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    }, []);

    // Handle page change
    const handlePageChange = useCallback((newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    }, []);

    // Filters configuration
    const filtersConfig = useMemo(
        () => [
            {
                key: "category",
                label: "Danh mục",
                type: "select",
                placeholder: "Tất cả danh mục",
                defaultValue: "",
                options: [
                    ...categories.map((cat) => ({
                        value: cat.slug,
                        label: cat.name,
                    })),
                ],
            },
            {
                key: "startDate",
                label: "Ngày tải từ",
                type: "date",
                placeholder: "Chọn ngày bắt đầu",
            },
        ],
        [categories]
    );

    // Sort options
    const sortOptions = useMemo(
        () => [
            { value: "downloadedAt:desc", label: "Mới nhất" },
            { value: "downloadedAt:asc", label: "Cũ nhất" },
        ],
        []
    );

    return (
        <div className="min-h-screen relative -mt-16">
            {/* Background Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: "30px 30px",
                    }}
                />
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-full h-full">
                    <div
                        className="absolute w-96 h-96 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-slow"
                        style={{ top: "10%", left: "15%" }}
                    />
                    <div
                        className="absolute text-emerald-600 opacity-50 animate-float-icon-1"
                        style={{ top: "15%", left: "20%" }}
                    >
                        <FaGraduationCap className="w-20 h-20" />
                    </div>
                    <div
                        className="absolute w-72 h-72 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-medium"
                        style={{ top: "40%", right: "15%" }}
                    />
                    <div
                        className="absolute text-teal-600 opacity-50 animate-float-icon-2"
                        style={{ top: "45%", right: "20%" }}
                    >
                        <FaBook className="w-16 h-16" />
                    </div>
                    <div
                        className="absolute w-48 h-48 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-fast"
                        style={{ bottom: "20%", left: "25%" }}
                    />
                    <div
                        className="absolute text-cyan-600 opacity-50 animate-float-icon-3"
                        style={{ bottom: "25%", left: "30%" }}
                    >
                        <FaLightbulb className="w-12 h-12" />
                    </div>
                </div>
                <div className="absolute inset-0">
                    {[
                        {
                            icon: FaBrain,
                            color: "emerald-500",
                            top: "35%",
                            right: "35%",
                            delay: "icon-4",
                        },
                        {
                            icon: FaPencilAlt,
                            color: "teal-500",
                            top: "65%",
                            right: "25%",
                            delay: "icon-5",
                        },
                        {
                            icon: FaChalkboardTeacher,
                            color: "cyan-500",
                            bottom: "40%",
                            left: "40%",
                            delay: "icon-6",
                        },
                        {
                            icon: FaBookReader,
                            color: "blue-500",
                            top: "25%",
                            left: "45%",
                            delay: "icon-7",
                        },
                        {
                            icon: FaAtom,
                            color: "purple-500",
                            bottom: "30%",
                            right: "45%",
                            delay: "icon-8",
                        },
                        {
                            icon: FaUniversity,
                            color: "indigo-500",
                            top: "55%",
                            left: "15%",
                            delay: "icon-9",
                        },
                        {
                            icon: FaUserGraduate,
                            color: "green-500",
                            bottom: "60%",
                            right: "20%",
                            delay: "icon-10",
                        },
                        {
                            icon: FaSchool,
                            color: "pink-500",
                            top: "20%",
                            left: "35%",
                            delay: "icon-11",
                        },
                        {
                            icon: FaBookOpen,
                            color: "red-500",
                            bottom: "25%",
                            left: "15%",
                            delay: "icon-12",
                        },
                        {
                            icon: FaDesktop,
                            color: "yellow-500",
                            top: "15%",
                            left: "45%",
                            delay: "icon-13",
                        },
                        {
                            icon: FaCalculator,
                            color: "blue-400",
                            top: "40%",
                            right: "10%",
                            delay: "icon-14",
                        },
                    ].map(({ icon: Icon, color, top, right, bottom, left, delay }, index) => (
                        <div
                            key={index}
                            className={`absolute text-${color} opacity-30 animate-float-${delay}`}
                            style={{ top, right, bottom, left }}
                        >
                            <Icon className="w-10 h-10" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto px-4"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold mb-6 text-center text-gray-800"
                    >
                        📥 Lịch sử tải xuống
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-4"
                    >
                        <SearchBar
                            onSearch={(value) =>
                                setFilters((prev) => ({ ...prev, search: value, page: 1 }))
                            }
                            placeholder="Tìm tiêu đề, mô tả, thẻ..."
                            isLoading={loading}
                        />
                        {categoriesLoading ? (
                            <div className="flex justify-center items-center h-10">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
                            </div>
                        ) : (
                            <FilterPanel
                                filtersConfig={filtersConfig}
                                sortOptions={sortOptions}
                                onFilterChange={handleFilterChange}
                                defaultFilters={{
                                    category: "",
                                    startDate: "",
                                    endDate: "",
                                    sort: "downloadedAt:desc",
                                }}
                                hideDateField={true}
                            />
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {loading ? (
                            <div className="text-center text-gray-500 py-8">
                                Đang tải lịch sử...
                            </div>
                        ) : downloadedHistory.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                Không có tài liệu nào trong lịch sử tải xuống
                                {filters.category
                                    ? ` thuộc danh mục "${
                                          categories.find((cat) => cat.slug === filters.category)
                                              ?.name || "đã chọn"
                                      }"`
                                    : ""}
                            </div>
                        ) : (
                            <DocumentList
                                documents={downloadedHistory}
                                pagination={pagination.downloadedHistory}
                                onPageChange={handlePageChange}
                                isLoading={loading}
                                type="download"
                            />
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    25% {
                        transform: translate(20px, -20px) rotate(5deg);
                    }
                    50% {
                        transform: translate(-10px);
                    }
                    75% {
                        transform: translate(-20px, -10px);
                    }
                }

                .animate-float-slow {
                    animation: float 20s ease-in-out infinite;
                }

                .animate-float-medium {
                    animation: float 15s ease-in-out infinite;
                }

                .animate-float-fast {
                    animation: float 10s ease-in-out infinite;
                }

                .animate-float-icon-4 {
                    animation: float 18s ease-in-out infinite;
                }
                .animate-float-icon-5 {
                    animation: float 20s ease-in-out infinite;
                }
                .animate-float-icon-6 {
                    animation: float 22s ease-in-out infinite;
                }
                .animate-float-icon-7 {
                    animation: float 19s ease-in-out infinite;
                }
                .animate-float-icon-8 {
                    animation: float 21s ease-in-out infinite;
                }
                .animate-float-icon-9 {
                    animation: float 17s ease-in-out infinite;
                }
                .animate-float-icon {
                    animation: float 23s ease-in-out infinite;
                }
                .animate-float-icon-11 {
                    animation: float 16s ease-in-out infinite;
                }
                .animate-float-icon-12 {
                    animation: float 24s ease-in-out infinite;
                }
                .animate-float-icon-13 {
                    animation: float 18s ease-in-out infinite;
                }
                .animate-float-icon-14 {
                    animation: float 20s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default MyDownloadedHistory;
