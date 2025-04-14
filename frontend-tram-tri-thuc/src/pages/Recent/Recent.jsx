import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDocuments } from "../../redux/slices/documentSlice";
import { toast } from "react-toastify";
import DocumentItem from "../../components/Document/DocumentItem";
import Home from "../Home/Home";

const Recent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { documents, loading } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);

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
        return uploadDate >= threeDaysAgo;
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
            <div className="max-w-6xl mx-auto p-6">
                {/* Header với bộ lọc */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Gần đây
                    </h1>
                    <div className="flex space-x-2">
                        {/* Bộ lọc Loại file */}
                        <select
                            value={filters.mimeType}
                            onChange={(e) =>
                                handleFilterChange("mimeType", e.target.value)
                            }
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="">Loại</option>
                            <option value="application/pdf">PDF</option>
                            <option value="application/msword">Word</option>
                            <option value="application/vnd.ms-excel">
                                Excel
                            </option>
                            <option value="image/jpeg">Hình ảnh</option>
                        </select>

                        {/* Bộ lọc Người sở hữu */}
                        <select
                            value={filters.userId}
                            onChange={(e) =>
                                handleFilterChange("userId", e.target.value)
                            }
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="">Người sở hữu</option>
                            <option value="tôi">Tôi</option>
                            {/* Thêm các user khác từ API nếu có */}
                        </select>

                        {/* Bộ lọc Lần sửa đổi */}
                        <select
                            value={filters.uploadDate}
                            onChange={(e) =>
                                handleFilterChange("uploadDate", e.target.value)
                            }
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="">Lần sửa đổi gần đây nhất</option>
                            <option value="today">Hôm nay</option>
                            <option value="lastWeek">Tuần trước</option>
                            <option value="lastMonth">Tháng trước</option>
                            <option value="earlier">Đầu năm nay</option>
                        </select>

                        {/* Bộ lọc Vị trí */}
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            onChange={(e) =>
                                handleFilterChange("location", e.target.value)
                            }
                        >
                            <option value="">Nguồn</option>
                            <option value="myDrive">Drive của tôi</option>
                            <option value="shared">Được chia sẻ</option>
                        </select>
                    </div>
                </div>

                {/* Danh sách file */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Gần đây */}
                        {recentFiles.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                    Gần đây
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                    Tuần trước
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                    Tháng trước
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                    Đầu năm nay
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {earlierThisYearFiles.map((file) => (
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

                        {/* Không có file */}
                        {documents.length === 0 && (
                            <div className="text-center text-gray-600 dark:text-gray-300 mt-6">
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
