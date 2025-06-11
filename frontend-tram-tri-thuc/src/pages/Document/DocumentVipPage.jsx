import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import SearchBar from "../../components/Document/SearchBar";
import FilterPanel from "../../components/Document/FilterPanel";
import DocumentList from "../../components/Document/DocumentList";
import { fetchVipDocuments, clearError } from "../../store/slices/documentSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import useDebounce from "../../utils/useDebounce";

const DocumentVipPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        vipDocuments,
        loading: documentsLoading,
        error: documentsError,
        vipPagination,
    } = useSelector((state) => state.documents);
    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.categories);
    const { userInfo } = useSelector((state) => state.user);
    const { isAuthenticated } = useSelector((state) => state.auth);

    console.log("userInfo: ", userInfo);

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        format: "",
        startDate: "",
        endDate: "",
        dateField: "createdAt",
        sort: "createdAt:desc",
        page: 1,
        limit: 12,
    });
    const debouncedSearch = useDebounce(filters.search, 300);
    const prevParamsRef = useRef({});

    // Kiểm tra quyền VIP
    const hasVipAccess =
        isAuthenticated && (userInfo?.isVip === "active" || userInfo?.role === "admin");

    // Fetch categories
    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 100 }));
    }, [dispatch]);

    // Fetch VIP documents
    const fetchVipDocumentsCallback = useCallback(() => {
        if (!hasVipAccess) return;

        const params = {
            search: debouncedSearch,
            category: filters.category,
            format: filters.format,
            startDate: filters.startDate,
            endDate: filters.endDate,
            dateField: filters.dateField,
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

        console.log("Fetching VIP documents with params:", cleanParams);
        dispatch(fetchVipDocuments(cleanParams))
            .unwrap()
            .then((data) => console.log("VIP API Response:", data))
            .catch((err) => {
                console.error("VIP API Error:", err);
                if (err.status === 401) {
                    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    localStorage.removeItem("accessToken");
                    navigate("/auth/login");
                } else if (err.status === 403) {
                    toast.error("Bạn không có quyền truy cập tài liệu VIP.");
                } else {
                    toast.error(err.message || "Lỗi khi tải tài liệu VIP.");
                }
            });
    }, [
        dispatch,
        navigate,
        hasVipAccess,
        debouncedSearch,
        filters.category,
        filters.format,
        filters.startDate,
        filters.endDate,
        filters.dateField,
        filters.sort,
        filters.page,
        filters.limit,
    ]);

    // Trigger fetch
    useEffect(() => {
        fetchVipDocumentsCallback();
    }, [fetchVipDocumentsCallback]);

    // Handle errors
    useEffect(() => {
        if (documentsError) {
            toast.error(documentsError);
            dispatch(clearError());
        }
        if (categoriesError) {
            toast.error(categoriesError);
            dispatch(clearError());
        }
    }, [documentsError, categoriesError, dispatch]);

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
                key: "format",
                label: "Định dạng",
                type: "select",
                placeholder: "Tất cả định dạng",
                defaultValue: "",
                options: [
                    { value: "pdf", label: "PDF" },
                    { value: "docx", label: "DOCX" },
                    { value: "pptx", label: "PPTX" },
                    { value: "zip", label: "ZIP" },
                ],
            },
            {
                key: "startDate",
                label: "Ngày bắt đầu",
                type: "date",
                placeholder: "Chọn ngày bắt đầu",
            },
        ],
        []
    );

    // Sort options
    const sortOptions = useMemo(
        () => [
            { value: "createdAt:desc", label: "Mới nhất" },
            { value: "createdAt:asc", label: "Cũ nhất" },
            { value: "viewCount:desc", label: "Xem nhiều nhất" },
            { value: "downloadCount:desc", label: "Tải nhiều nhất" },
            { value: "averageRating:desc", label: "Đánh giá cao nhất" },
        ],
        []
    );

    // Render khi không có quyền
    if (!hasVipAccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-md mx-auto px-4 text-center"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Tài liệu VIP chỉ dành cho thành viên VIP
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Nâng cấp tài khoản của bạn để truy cập các tài liệu độc quyền và nhiều lợi
                        ích khác.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-emerald-600 transition"
                        onClick={() => navigate("/upgradeAccount")} // Giả sử có trang pricing
                    >
                        Nâng cấp ngay
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
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
                        📚 Tài liệu VIP
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
                            placeholder="Tìm tài liệu VIP..."
                            isLoading={documentsLoading}
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
                                filters={filters}
                                defaultFilters={{
                                    category: "",
                                    format: "",
                                    startDate: "",
                                    endDate: "",
                                    dateField: "createdAt",
                                    sort: "createdAt:desc",
                                }}
                            />
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {documentsLoading ? (
                            <div className="text-center text-gray-500 py-8">
                                Đang tải tài liệu VIP...
                            </div>
                        ) : vipDocuments.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                Không có tài liệu VIP trong danh mục{" "}
                                {filters.category
                                    ? categories.find((cat) => cat.slug === filters.category)
                                          ?.name || "đã chọn"
                                    : "tất cả"}
                            </div>
                        ) : (
                            <DocumentList
                                documents={vipDocuments}
                                pagination={vipPagination}
                                onPageChange={handlePageChange}
                                isLoading={documentsLoading}
                            />
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default DocumentVipPage;
