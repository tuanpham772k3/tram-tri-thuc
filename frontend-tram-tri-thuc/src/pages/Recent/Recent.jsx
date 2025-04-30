import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Home from "../Home/Home";
import PageHeader from "../../components/Layout/PageHeader";
import DocumentItem from "../../components/Document/DocumentItem";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { fetchDocuments } from "../../redux/slices/documentSlice";

const Recent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { documents, loading } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);

    const [view, setView] = useState("grid");
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
                    if (error === "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại") {
                        navigate("/login");
                    }
                });
        }
    }, [token, dispatch, navigate]);

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
                <PageHeader
                    title="Gần đây"
                    view={view}
                    onViewChange={setView}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                {loading ? (
                    <LoadingSpinner size="medium" />
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
                                                onPreview={() => navigate(`/documents/${file._id}`)}
                                                onDoubleClick={() =>
                                                    navigate(`/documents/${file._id}`)
                                                }
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <>
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
                                                        navigate(`/documents/${file._id}`)
                                                    }
                                                    onDoubleClick={() =>
                                                        navigate(`/documents/${file._id}`)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                                        navigate(`/documents/${file._id}`)
                                                    }
                                                    onDoubleClick={() =>
                                                        navigate(`/documents/${file._id}`)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                                        navigate(`/documents/${file._id}`)
                                                    }
                                                    onDoubleClick={() =>
                                                        navigate(`/documents/${file._id}`)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {earlierThisYearFiles.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-medium text-gray-700 mb-3">
                                            Đầu năm nay
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {earlierThisYearFiles.map((file) => (
                                                <DocumentItem
                                                    key={file._id}
                                                    document={file}
                                                    view="grid"
                                                    onPreview={() =>
                                                        navigate(`/documents/${file._id}`)
                                                    }
                                                    onDoubleClick={() =>
                                                        navigate(`/documents/${file._id}`)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
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
