import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDocuments } from "../../redux/slices/documentSlice";
import DocumentItem from "../../components/Document/DocumentItem";
import Home from "../Home/Home";
import { toast } from "react-toastify";
import { FaList, FaTh } from "react-icons/fa";

const Recent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { documents, loading } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);

    const [view, setView] = useState("grid"); // Mặc định là grid
    const [filters, setFilters] = useState({
        type: "file",
        mimeType: "",
        uploadDate: "",
        userId: "",
    });

    useEffect(() => {
        if (token) {
            dispatch(fetchDocuments({ type: "file" }))
                .unwrap()
                .catch((error) => {
                    toast.error("Không thể tải danh sách tài liệu");
                    if (
                        error ===
                        "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
                    ) {
                        navigate("/login");
                    }
                });
        }
    }, [token, dispatch, navigate]);

    // Phân loại file theo thời gian
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const recentFiles = documents.filter((doc) => {
        const uploadDate = new Date(doc.uploadDate);
        return uploadDate >= threeDaysAgo && uploadDate <= today;
    });

    const lastWeekFiles = documents.filter((doc) => {
        const uploadDate = new Date(doc.uploadDate);
        return uploadDate >= tenDaysAgo && uploadDate < threeDaysAgo;
    });

    const lastMonthFiles = documents.filter((doc) => {
        const uploadDate = new Date(doc.uploadDate);
        return uploadDate >= thirtyDaysAgo && uploadDate < tenDaysAgo;
    });

    const earlierThisYearFiles = documents.filter((doc) => {
        const uploadDate = new Date(doc.uploadDate);
        return uploadDate >= startOfYear && uploadDate < thirtyDaysAgo;
    });

    // Xử lý bộ lọc
    const handleFilterChange = (key, value) => {
        setFilters((prev) => {
            const newFilters = { ...prev, [key]: value };
            dispatch(fetchDocuments(newFilters));
            return newFilters;
        });
    };

    return (
        <Home>
            <div className="max-w-7xl mx-auto p-4">
                {/* Header với bộ lọc và chuyển đổi view */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Gần đây
                    </h1>
                    <div className="flex items-center space-x-2">
                        {/* Bộ lọc */}
                        <select
                            value={filters.mimeType}
                            onChange={(e) =>
                                handleFilterChange("mimeType", e.target.value)
                            }
                            className="border rounded px-2 py-1 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Loại</option>
                            <option value="application/pdf">PDF</option>
                            <option value="application/msword">Word</option>
                            <option value="application/vnd.ms-excel">
                                Excel
                            </option>
                            <option value="image/jpeg">Hình ảnh</option>
                        </select>

                        <select
                            value={filters.userId}
                            onChange={(e) =>
                                handleFilterChange("userId", e.target.value)
                            }
                            className="border rounded px-2 py-1 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Người sở hữu</option>
                            <option value="tôi">Tôi</option>
                            {/* Thêm user khác từ API nếu có */}
                        </select>

                        <select
                            value={filters.uploadDate}
                            onChange={(e) =>
                                handleFilterChange("uploadDate", e.target.value)
                            }
                            className="border rounded px-2 py-1 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Lần sửa đổi gần đây nhất</option>
                            <option value="today">Hôm nay</option>
                            <option value="lastWeek">Tuần trước</option>
                            <option value="lastMonth">Tháng trước</option>
                            <option value="earlier">Đầu năm nay</option>
                        </select>

                        <select
                            className="border rounded px-2 py-1 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                                handleFilterChange("location", e.target.value)
                            }
                        >
                            <option value="">Nguồn</option>
                            <option value="myDrive">Drive của tôi</option>
                            <option value="shared">Được chia sẻ</option>
                        </select>

                        {/* Nút chuyển đổi list/grid */}
                        <div className="bg-gray-100 rounded-full p-1 flex items-center">
                            <button
                                onClick={() => setView("list")}
                                className={`p-2 rounded-full ${
                                    view === "list"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600"
                                }`}
                            >
                                <FaList size={16} />
                            </button>
                            <button
                                onClick={() => setView("grid")}
                                className={`p-2 rounded-full ${
                                    view === "grid"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600"
                                }`}
                            >
                                <FaTh size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danh sách file */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {view === "list" ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg shadow-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                                                Tên
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                                                Chủ sở hữu
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                                                Kích cỡ
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                                                Vị trí
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                                                Ngày sửa đổi
                                            </th>
                                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ...recentFiles,
                                            ...lastWeekFiles,
                                            ...lastMonthFiles,
                                            ...earlierThisYearFiles,
                                        ].map((file) => (
                                            <DocumentItem
                                                key={file._id}
                                                document={file}
                                                view="list"
                                                onPreview={() =>
                                                    navigate(
                                                        `/documents/${file._id}`
                                                    )
                                                }
                                                onDoubleClick={() =>
                                                    navigate(
                                                        `/documents/${file._id}`
                                                    )
                                                }
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <>
                                {/* Gần đây */}
                                {recentFiles.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-medium text-gray-700 mb-3">
                                            Gần đây
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {recentFiles.map((file) => (
                                                <DocumentItem
                                                    key={file._id}
                                                    document={file}
                                                    view="grid"
                                                    onPreview={() =>
                                                        navigate(
                                                            `/documents/${file._id}`
                                                        )
                                                    }
                                                    onDoubleClick={() =>
                                                        navigate(
                                                            `/documents/${file._id}`
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tuần trước */}
                                {lastWeekFiles.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-medium text-gray-700 mb-3">
                                            Tuần trước
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {lastWeekFiles.map((file) => (
                                                <DocumentItem
                                                    key={file._id}
                                                    document={file}
                                                    view="grid"
                                                    onPreview={() =>
                                                        navigate(
                                                            `/documents/${file._id}`
                                                        )
                                                    }
                                                    onDoubleClick={() =>
                                                        navigate(
                                                            `/documents/${file._id}`
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tháng trước */}
                                {lastMonthFiles.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-medium text-gray-700 mb-3">
                                            Tháng trước
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {lastMonthFiles.map((file) => (
                                                <DocumentItem
                                                    key={file._id}
                                                    document={file}
                                                    view="grid"
                                                    onPreview={() =>
                                                        navigate(
                                                            `/documents/${file._id}`
                                                        )
                                                    }
                                                    onDoubleClick={() =>
                                                        navigate(
                                                            `/documents/${file._id}`
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Đầu năm nay */}
                                {earlierThisYearFiles.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-medium text-gray-700 mb-3">
                                            Đầu năm nay
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {earlierThisYearFiles.map(
                                                (file) => (
                                                    <DocumentItem
                                                        key={file._id}
                                                        document={file}
                                                        view="grid"
                                                        onPreview={() =>
                                                            navigate(
                                                                `/documents/${file._id}`
                                                            )
                                                        }
                                                        onDoubleClick={() =>
                                                            navigate(
                                                                `/documents/${file._id}`
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Không có file */}
                        {documents.length === 0 && (
                            <div className="text-center text-gray-500 mt-6">
                                Không có file nào gần đây.
                            </div>
                        )}
                    </>
                )}
            </div>
        </Home>
    );
};

export default Recent;
