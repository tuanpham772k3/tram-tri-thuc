import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, deleteDocument, fetchMyDocuments } from "../../store/slices/documentSlice";
import showToast from "../../utils/toast";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiUpload, FiClock, FiCheck } from "react-icons/fi";
import {
    FaBook,
    FaGraduationCap,
    FaPencilAlt,
    FaLightbulb,
    FaBrain,
    FaChalkboardTeacher,
    FaUniversity,
    FaUserGraduate,
    FaSchool,
    FaBookOpen,
    FaDesktop,
    FaMicroscope,
    FaFlask,
    FaCalculator,
} from "react-icons/fa";
import useDebounce from "../../utils/useDebounce";
import { fetchCategories } from "../../store/slices/categorySlice";
import SearchBar from "../../components/Document/SearchBar";
import FilterPanel from "../../components/Document/FilterPanel";
import Pagination from "../../components/Common/Pagination";

export default function MyDocumentsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        myDocuments,
        loading: documentsLoading,
        error: documentsError,
        myDocumentsPagination,
    } = useSelector((state) => state.documents);
    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.categories);
    const { userInfo } = useSelector((state) => state.user);

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        status: "",
        startDate: "",
        endDate: "",
        dateField: "createdAt",
        sort: "createdAt:desc",
        page: 1,
    });
    const debouncedSearch = useDebounce(filters.search, 500);

    // Fetch categories
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Fetch documents
    const fetchDocuments = useCallback(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            showToast("error", "Vui lòng đăng nhập để xem tài liệu.");
            navigate("/auth/login");
            return;
        }

        const params = {
            ...filters,
            search: debouncedSearch,
            page: filters.page,
        };
        // Clean params: remove empty values
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== "")
        );
        console.log("API Params:", cleanParams);
        dispatch(fetchMyDocuments(cleanParams))
            .unwrap()
            .then((data) => console.log("API Response:", data))
            .catch((err) => {
                console.error("API Error:", err);
                showToast("error", err.message || "Lỗi khi tải tài liệu.");
            });
    }, [
        dispatch,
        navigate,
        debouncedSearch,
        filters.page,
        filters.category,
        filters.status,
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
        if (documentsError) {
            showToast("error", documentsError);
            dispatch(clearError());
        }
        if (categoriesError) {
            showToast("error", categoriesError);
            dispatch(clearError());
        }
    }, [documentsError, categoriesError, dispatch]);

    const handleDelete = useCallback(
        (id) => {
            if (!window.confirm("Bạn có chắc muốn xóa tài liệu này?")) return;

            dispatch(deleteDocument(id))
                .unwrap()
                .then(() => {
                    showToast("success", "Xóa tài liệu thành công!");
                    fetchDocuments(); // Refresh danh sách
                })
                .catch((err) => showToast("error", err?.message || "Lỗi khi xóa tài liệu."));
        },
        [dispatch, fetchDocuments]
    );

    const handleFilterChange = useCallback((newFilters) => {
        setFilters({ ...newFilters, page: 1 }); // Reset page when filters change
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    }, []);

    const filtersConfig = useMemo(
        () => [
            {
                key: "category",
                label: "Danh mục",
                type: "select",
                placeholder: "Chọn danh mục",
                options: categories.map((cat) => ({
                    value: cat.slug,
                    label: cat.name,
                })),
            },
            {
                key: "status",
                label: "Trạng thái",
                type: "select",
                placeholder: "Chọn trạng thái",
                options: [
                    { value: "approved", label: "Đã duyệt" },
                    { value: "pending", label: "Chờ duyệt" },
                    { value: "rejected", label: "Bị từ chối" },
                ],
            },
            {
                key: "startDate",
                label: "Ngày bắt đầu",
                type: "date",
                placeholder: "Chọn ngày bắt đầu",
            },
        ],
        [categories]
    );

    const sortOptions = useMemo(
        () => [
            { value: "createdAt:desc", label: "Mới nhất" },
            { value: "createdAt:asc", label: "Cũ nhất" },
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
                        className="absolute w-96 h-96 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                        style={{
                            top: "10%",
                            left: "15%",
                            animation: "float 20s ease-in-out infinite",
                        }}
                    />
                    <div
                        className="absolute text-emerald-600 opacity-50"
                        style={{
                            top: "15%",
                            left: "20%",
                            animation: "float 12s ease-in-out infinite",
                        }}
                    >
                        <FaGraduationCap className="w-20 h-20" />
                    </div>
                    <div
                        className="absolute w-72 h-72 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                        style={{
                            top: "40%",
                            right: "15%",
                            animation: "float 15s ease-in-out infinite",
                            animationDelay: "-5s",
                        }}
                    />
                    <div
                        className="absolute text-teal-600 opacity-50"
                        style={{
                            top: "45%",
                            right: "20%",
                            animation: "float 14s ease-in-out infinite",
                            animationDelay: "-3s",
                        }}
                    >
                        <FaBook className="w-16 h-16" />
                    </div>
                    <div
                        className="absolute w-48 h-48 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                        style={{
                            bottom: "20%",
                            left: "25%",
                            animation: "float 10s ease-in-out infinite",
                            animationDelay: "-7s",
                        }}
                    />
                    <div
                        className="absolute text-cyan-600 opacity-50"
                        style={{
                            bottom: "25%",
                            left: "30%",
                            animation: "float 16s ease-in-out infinite",
                            animationDelay: "-6s",
                        }}
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
                            delay: "-2s",
                        },
                        {
                            icon: FaPencilAlt,
                            color: "teal-500",
                            top: "65%",
                            right: "25%",
                            delay: "-7s",
                        },
                        {
                            icon: FaChalkboardTeacher,
                            color: "cyan-500",
                            bottom: "40%",
                            left: "40%",
                            delay: "-4s",
                        },
                        {
                            icon: FaUniversity,
                            color: "blue-500",
                            top: "20%",
                            right: "45%",
                            delay: "-1s",
                        },
                        {
                            icon: FaUserGraduate,
                            color: "purple-500",
                            bottom: "30%",
                            right: "15%",
                            delay: "-8s",
                        },
                        {
                            icon: FaSchool,
                            color: "indigo-500",
                            top: "50%",
                            left: "20%",
                            delay: "-3s",
                        },
                        {
                            icon: FaBookOpen,
                            color: "pink-500",
                            top: "25%",
                            left: "35%",
                            delay: "-6s",
                        },
                        {
                            icon: FaDesktop,
                            color: "red-500",
                            bottom: "25%",
                            left: "15%",
                            delay: "-5s",
                        },
                        {
                            icon: FaMicroscope,
                            color: "yellow-500",
                            top: "15%",
                            left: "45%",
                            delay: "-9s",
                        },
                        {
                            icon: FaFlask,
                            color: "green-500",
                            bottom: "15%",
                            right: "40%",
                            delay: "-4s",
                        },
                        {
                            icon: FaCalculator,
                            color: "blue-400",
                            top: "40%",
                            right: "10%",
                            delay: "-7s",
                        },
                    ].map(({ icon: Icon, color, top, right, bottom, left, delay }, index) => (
                        <div
                            key={index}
                            className={`absolute text-${color} opacity-30`}
                            style={{
                                top,
                                right,
                                bottom,
                                left,
                                animation: `float 18s ease-in-out infinite`,
                                animationDelay: delay,
                            }}
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
                    className="max-w-4xl mx-auto px-4"
                >
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-900">Tài liệu của tôi</h1>
                            <Link
                                to="/uploader/upload"
                                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <FiUpload className="mr-2" />
                                Tải lên tài liệu mới
                            </Link>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Quản lý và theo dõi các tài liệu bạn đã đăng tải
                        </p>
                    </div>

                    {/* Filter and Search */}
                    <div className="mb-6">
                        <SearchBar
                            onSearch={(value) =>
                                setFilters((prev) => ({ ...prev, search: value, page: 1 }))
                            }
                            placeholder="Tìm kiếm tiêu đề, mô tả, thẻ..."
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
                                    status: "",
                                    startDate: "",
                                    endDate: "",
                                    dateField: "createdAt",
                                    sort: "createdAt:desc",
                                }}
                            />
                        )}
                    </div>

                    {/* Loading State */}
                    {documentsLoading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
                        </div>
                    )}

                    {/* Error State */}
                    {documentsError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{documentsError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents List */}
                    {!documentsLoading && !documentsError && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                            {myDocuments.length > 0 ? (
                                <>
                                    <ul className="divide-y divide-gray-200">
                                        {myDocuments.map((doc) => (
                                            <motion.li
                                                key={doc._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="hover:bg-gray-50/50 transition-colors"
                                            >
                                                <div className="px-6 py-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                                {doc.title}
                                                            </h3>
                                                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                                <span>
                                                                    Đăng ngày:{" "}
                                                                    {new Date(
                                                                        doc.createdAt
                                                                    ).toLocaleDateString("vi-VN")}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <span
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                            doc.status ===
                                                                            "approved"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : doc.status ===
                                                                                    "pending"
                                                                                  ? "bg-yellow-100 text-yellow-800"
                                                                                  : "bg-red-100 text-red-800"
                                                                        }`}
                                                                    >
                                                                        {doc.status ===
                                                                        "approved" ? (
                                                                            <FiCheck className="w-4 h-4 mr-1" />
                                                                        ) : (
                                                                            <FiClock className="w-4 h-4 mr-1" />
                                                                        )}
                                                                        {doc.status === "approved"
                                                                            ? "Đã duyệt"
                                                                            : doc.status ===
                                                                                "pending"
                                                                              ? "Chờ duyệt"
                                                                              : "Bị từ chối"}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <Link
                                                                to={`/uploader/edit-document/${doc._id}`}
                                                                className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <FiEdit2 className="w-5 h-5" />
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(doc._id)
                                                                }
                                                                className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                                                title="Xóa"
                                                            >
                                                                <FiTrash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <Pagination
                                        page={myDocumentsPagination.currentPage}
                                        totalPages={myDocumentsPagination.totalPages}
                                        onNext={() =>
                                            handlePageChange(myDocumentsPagination.currentPage + 1)
                                        }
                                        onPrev={() =>
                                            handlePageChange(myDocumentsPagination.currentPage - 1)
                                        }
                                        onPageChange={handlePageChange}
                                        isLoading={documentsLoading}
                                    />
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Chưa có tài liệu nào.</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                <style>
                    {`
            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(20px, -20px) rotate(5deg); }
              50% { transform: translate(-20px, 20px) rotate(-5deg); }
              75% { transform: translate(-20px, -10px) rotate(3deg); }
            }
          `}
                </style>
            </div>
        </div>
    );
}
