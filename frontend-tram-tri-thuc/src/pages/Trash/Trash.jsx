import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Home from "../Home/Home";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ErrorMessage from "../../components/Common/ErrorMessage";
import { emptyTrash, fetchTrash } from "../../redux/slices/trashSlice";
import PageHeader from "../../components/Layout/Header/PageHeader";
import DocumentListView from "../../components/Document/DocumentListView";

const Trash = () => {
    const [view, setView] = useState("list");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterType, setFilterType] = useState("all");
    const [filterDate, setFilterDate] = useState("all");

    const dispatch = useDispatch();
    const { trashDocuments, loading, error } = useSelector((state) => state.trash);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            dispatch(fetchTrash())
                .unwrap()
                .catch((error) => {
                    toast.error(error);
                    if (error === "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại") {
                        navigate("/login");
                    }
                });
        }
    }, [token, dispatch, navigate]);

    const uniqueDocuments = Array.from(
        new Map(
            trashDocuments
                .filter((doc) => doc && doc._id && doc.name && doc.deleted === true)
                .map((doc) => [doc._id, doc])
        )
    ).map(([_, doc]) => doc);

    const filteredDocuments = uniqueDocuments.filter((doc) => {
        if (filterType === "all") return true;
        if (filterType === "folders") return doc.type === "folder";
        if (filterType === "pdf") return doc.mimeType === "application/pdf";
        if (filterType === "word")
            return (
                doc.mimeType === "application/msword" ||
                doc.mimeType ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );
        if (filterType === "excel")
            return (
                doc.mimeType === "application/vnd.ms-excel" ||
                doc.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
        if (filterType === "images")
            return doc.mimeType === "image/jpeg" || doc.mimeType === "image/png";
        return true;
    });

    const filteredByDate = filteredDocuments.filter((doc) => {
        if (filterDate === "all") return true;
        const deletedAt = new Date(doc.deletedAt);
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        if (filterDate === "today") return deletedAt.toDateString() === today.toDateString();
        if (filterDate === "week") return deletedAt >= oneWeekAgo;
        if (filterDate === "month") return deletedAt >= oneMonthAgo;
        if (filterDate === "older") return deletedAt < oneMonthAgo;
        return true;
    });

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    const handleEmptyTrash = async () => {
        if (!window.confirm("Bạn có chắc muốn dọn sạch thùng rác? Tất cả mục sẽ bị xóa vĩnh viễn!"))
            return;
        try {
            await dispatch(emptyTrash()).unwrap();
            toast.success("Dọn sạch thùng rác thành công");
            dispatch(fetchTrash());
        } catch (error) {
            toast.error(error || "Dọn sạch thùng rác thất bại");
        }
    };

    return (
        <Home>
            <div className="max-w-6xl mx-auto p-6 gradient-bg rounded-lg shadow">
                <PageHeader title="Thùng rác" view={view} onViewChange={setView} />
                <div className="mb-6 flex flex-wrap gap-4">
                    <div>
                        <label className="text-gray-700 dark:text-gray-300 mr-2">Loại tệp:</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                        >
                            <option value="all">Tất cả</option>
                            <option value="folders">Thư mục</option>
                            <option value="pdf">PDF</option>
                            <option value="word">Word</option>
                            <option value="excel">Excel</option>
                            <option value="images">Hình ảnh</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-700 dark:text-gray-300 mr-2">Ngày xóa:</label>
                        <select
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                        >
                            <option value="all">Tất cả</option>
                            <option value="today">Hôm nay</option>
                            <option value="week">Tuần này</option>
                            <option value="month">Tháng này</option>
                            <option value="older">Trước đó</option>
                        </select>
                    </div>
                    {filteredByDate.length > 0 && (
                        <button
                            onClick={handleEmptyTrash}
                            className="bg-red-600 text-white px-4 py-2 rounded flex items-center hover:bg-red-700 transition disabled:bg-red-400"
                            disabled={loading || !trashDocuments.length}
                        >
                            <FaTrash className="mr-2" /> Dọn sạch thùng rác
                        </button>
                    )}
                </div>
                {loading ? (
                    <LoadingSpinner size="medium" />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : filteredByDate.length ? (
                    <DocumentListView
                        documents={filteredByDate}
                        view={view}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        isTrash={true}
                        navigate={navigate}
                    />
                ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center mt-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            Thùng rác trống. Các mục đã xóa sẽ xuất hiện tại đây.
                        </p>
                    </div>
                )}
            </div>
        </Home>
    );
};

export default Trash;
