import { useEffect, useState } from "react";
import { FaList, FaTh, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Home from "../Home/Home";
import DocumentItem from "../../components/Document/DocumentItem";
import { emptyTrash, fetchTrash } from "../../redux/slices/trashSlice";

const Trash = () => {
    const [view, setView] = useState("list");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterType, setFilterType] = useState("all");
    const [filterDate, setFilterDate] = useState("all");

    const dispatch = useDispatch();
    const { trashDocuments, loading } = useSelector((state) => state.trash);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Lấy danh sách tài liệu trong thùng rác
    useEffect(() => {
        if (token) {
            dispatch(fetchTrash())
                .unwrap()
                .then(() => {
                    console.log("Trash documents loaded:", trashDocuments);
                })
                .catch((error) => {
                    console.error("Fetch trash documents error:", error);
                    if (error === "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại") {
                        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
                        navigate("/login");
                    } else {
                        toast.error("Không thể tải danh sách thùng rác");
                    }
                });
        }
    }, [token, dispatch, navigate]);

    // Loại bỏ trùng lặp và lọc dữ liệu không hợp lệ
    const uniqueDocuments = Array.from(
        new Map(
            trashDocuments
                .filter((doc) => doc && doc._id && doc.name && doc.deleted === true) // Lọc các tài liệu hợp lệ
                .map((doc) => [doc._id, doc])
        )
    ).map(([_, doc]) => doc);

    // Lọc theo loại tệp
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

    // Lọc theo ngày xóa
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

    // Sắp xếp với kiểm tra an toàn
    const sortedDocuments = [...filteredByDate].sort((a, b) => {
        // Kiểm tra xem a và b có tồn tại và có các thuộc tính cần thiết
        if (!a || !b || !a.name || !b.name) return 0;

        if (sortBy === "name") {
            return sortDirection === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } else if (sortBy === "date") {
            // Kiểm tra deletedAt
            if (!a.deletedAt || !b.deletedAt) return 0;
            return sortDirection === "asc"
                ? new Date(a.deletedAt) - new Date(b.deletedAt)
                : new Date(b.deletedAt) - new Date(a.deletedAt);
        } else if (sortBy === "size") {
            // Kiểm tra size, mặc định là 0 nếu không có
            const aSize = a.size || 0;
            const bSize = b.size || 0;
            return sortDirection === "asc" ? aSize - bSize : bSize - aSize;
        }
        return 0;
    });
    
    const folders = sortedDocuments.filter((doc) => doc.type === "folder");
    const files = sortedDocuments.filter((doc) => doc.type === "file");

    // Toggle sắp xếp
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    // Dọn sạch thùng rác
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Thùng rác</h1>
                    <div className="flex space-x-2">
                        {sortedDocuments.length > 0 && (
                            <button
                                onClick={handleEmptyTrash}
                                className="bg-red-600 text-white px-4 py-2 rounded flex items-center hover:bg-red-700"
                                disabled={loading || !trashDocuments.length}
                            >
                                <FaTrash className="mr-2" /> Dọn sạch thùng rác
                            </button>
                        )}
                        <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
                            <button
                                onClick={() => setView("list")}
                                className={`p-2 rounded-full ${
                                    view === "list"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 dark:text-gray-300"
                                }`}
                            >
                                <FaList size={16} />
                            </button>
                            <button
                                onClick={() => setView("grid")}
                                className={`p-2 rounded-full ${
                                    view === "grid"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 dark:text-gray-300"
                                }`}
                            >
                                <FaTh size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ô phân loại */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="text-gray-700 dark:text-gray-300 mr-2">
                                Loại tệp:
                            </label>
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
                            <label className="text-gray-700 dark:text-gray-300 mr-2">
                                Ngày xóa:
                            </label>
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
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : sortedDocuments.length ? (
                    view === "list" ? (
                        <div className="overflow-x-auto mt-6">
                            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th
                                            className="py-3 px-4 text-left"
                                            onClick={() => handleSort("name")}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    Tên
                                                </span>
                                                {sortBy === "name" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            className="py-3 px-4 text-left"
                                            onClick={() => handleSort("date")}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    Ngày xóa
                                                </span>
                                                {sortBy === "date" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            className="py-3 px-4 text-left"
                                            onClick={() => handleSort("size")}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    Dung lượng
                                                </span>
                                                {sortBy === "size" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="py-3 px-4 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedDocuments.map((doc) => (
                                        <DocumentItem
                                            key={doc._id}
                                            document={doc}
                                            view="list"
                                            isTrash={true}
                                            onDoubleClick={() => {}}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="mt-6">
                            {folders.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-black">
                                        Thư mục
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {folders.map((folder) => (
                                            <DocumentItem
                                                key={folder._id}
                                                document={folder}
                                                view="grid"
                                                isTrash={true}
                                                onDoubleClick={() => {}}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {files.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-black">
                                        Tệp
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {files.map((file) => (
                                            <DocumentItem
                                                key={file._id}
                                                document={file}
                                                view="grid"
                                                isTrash={true}
                                                onDoubleClick={() => {}}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
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
