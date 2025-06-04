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
import { fetchFavoriteDocuments } from "../../store/slices/userSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import useDebounce from "../../utils/useDebounce";
import { toast } from "react-toastify";

const MyFavoritesDocuments = () => {
    const dispatch = useDispatch();
    const {
        favoriteDocuments = [],
        pagination,
        loading: userLoading,
        error: userError,
        favoritesFetched,
    } = useSelector((state) => state.user);
    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.categories);
    const { userInfo } = useSelector((state) => state.user);

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        startDate: "",
        endDate: "",
        sort: "favoritedAt:desc",
        page: 1,
        limit: 12,
    });

    const debouncedSearch = useDebounce(filters.search, 300);
    const prevParamsRef = useRef({});

    // Fetch categories
    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 100 }));
    }, [dispatch]);

    // Fetch favorite documents
    const fetchFavoritesCallback = useCallback(() => {
        if (!userInfo) return; // Không gọi API nếu chưa đăng nhập
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
        // Skip if params unchanged or already fetched
        if (
            JSON.stringify(cleanParams) === JSON.stringify(prevParamsRef.current) ||
            (favoritesFetched && cleanParams.page === prevParamsRef.current.page)
        ) {
            return;
        }
        prevParamsRef.current = cleanParams;

        console.log("Fetching favorite documents with params:", cleanParams);
        dispatch(fetchFavoriteDocuments(cleanParams))
            .unwrap()
            .catch((err) => {
                console.error("API Error:", err);
                toast.error(err.message || "Lỗi khi tải danh sách yêu thích.");
            });
    }, [
        dispatch,
        userInfo,
        debouncedSearch,
        filters.category,
        filters.startDate,
        filters.endDate,
        filters.sort,
        filters.page,
        filters.limit,
        favoritesFetched,
    ]);

    useEffect(() => {
        fetchFavoritesCallback();
    }, [fetchFavoritesCallback]);

    // Handle errors
    useEffect(() => {
        if (userError) {
            toast.error(userError);
            dispatch({ type: "user/clearError" });
        }
        if (categoriesError) {
            toast.error(categoriesError);
            dispatch({ type: "categories/clearError" });
        }
    }, [userError, categoriesError, dispatch]);

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
                label: "Ngày yêu thích từ",
                type: "date",
                placeholder: "Chọn ngày bắt đầu",
            },
        ],
        [categories]
    );

    // Sort options
    const sortOptions = useMemo(
        () => [
            { value: "favoritedAt:desc", label: "Mới yêu thích nhất" },
            { value: "favoritedAt:asc", label: "Yêu thích cũ nhất" },
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
                {/* Tương tự MyDownloadedHistory, giữ nguyên animation */}
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
                    {/* ... giữ nguyên các animation khác ... */}
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
                        // ... giữ nguyên các icon khác ...
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
                        ❤️ Tài liệu yêu thích
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
                            isLoading={userLoading}
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
                                    sort: "favoritedAt:desc",
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
                        {userLoading ? (
                            <div className="text-center text-gray-500 py-8">
                                Đang tải danh sách yêu thích...
                            </div>
                        ) : favoriteDocuments.length === 0 ? (
                            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                                <img
                                    src="/empty-heart.svg"
                                    alt="Empty"
                                    className="w-24 h-24 mb-2"
                                />
                                Bạn chưa "thả tim" tài liệu nào cả 😢 <br />
                                Hãy khám phá và thêm vào danh sách yêu thích nhé!
                            </div>
                        ) : (
                            <DocumentList
                                documents={favoriteDocuments}
                                pagination={pagination.favoriteDocuments}
                                onPageChange={handlePageChange}
                                isLoading={userLoading}
                                type="favorite"
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
                // ... giữ nguyên các animation khác ...
            `}</style>
        </div>
    );
};

export default MyFavoritesDocuments;
