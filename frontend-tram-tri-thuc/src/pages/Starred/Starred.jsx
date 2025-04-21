import { useEffect, useState } from "react";
import { FaList, FaTh } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Home from "../Home/Home";
import DocumentItem from "../../components/Document/DocumentItem";
import { fetchDocuments } from "../../redux/slices/documentSlice";

const Starred = () => {
    const [view, setView] = useState("list");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    const dispatch = useDispatch();
    const { documents, loading } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Lấy danh sách tài liệu/thư mục được đánh dấu sao
    useEffect(() => {
        if (token) {
            dispatch(fetchDocuments({ starred: true, includeChildren: true }))
                .unwrap()
                .catch((error) => {
                    console.error("Fetch starred documents error:", error);
                    if (error === "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại") {
                        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
                        navigate("/login");
                    } else {
                        toast.error("Không thể tải danh sách tài liệu được đánh dấu sao");
                    }
                });
        }
    }, [token, dispatch, navigate]);

    // Loại bỏ trùng lặp và lọc dữ liệu không hợp lệ
    const uniqueDocuments = Array.from(
        new Map(
            documents
                .filter((doc) => doc && doc._id && doc.name && doc.starred && !doc.deleted) // Đảm bảo tài liệu hợp lệ và được đánh dấu sao
                .map((doc) => [doc._id, doc])
        )
    ).map(([_, doc]) => doc);

    // Sắp xếp tài liệu với kiểm tra an toàn
    const sortedDocuments = [...uniqueDocuments].sort((a, b) => {
        if (!a || !b || !a.name || !b.name) return 0;

        if (sortBy === "name") {
            return sortDirection === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } else if (sortBy === "date") {
            const aDate = a.uploadDate ? new Date(a.uploadDate) : new Date(0);
            const bDate = b.uploadDate ? new Date(b.uploadDate) : new Date(0);
            return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
        } else if (sortBy === "size") {
            const aSize = a.size || 0;
            const bSize = b.size || 0;
            return sortDirection === "asc" ? aSize - bSize : bSize - aSize;
        }
        return 0;
    });

    // Toggle sắp xếp
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    const folders = sortedDocuments.filter((doc) => doc.type === "folder");
    const files = sortedDocuments.filter((doc) => doc.type === "file");

    return (
        <Home>
            <div className="max-w-6xl mx-auto p-6 gradient-bg rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                        Có đánh dấu sao
                    </h1>
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
                                                    Ngày tải lên
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
                                            onPreview={() =>
                                                doc.type === "folder"
                                                    ? navigate(`/documents?parentId=${doc._id}`)
                                                    : navigate(`/documents/${doc._id}`)
                                            }
                                            onDoubleClick={() =>
                                                doc.type === "folder"
                                                    ? navigate(`/documents?parentId=${doc._id}`)
                                                    : navigate(`/documents/${doc._id}`)
                                            }
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
                                                onDoubleClick={() =>
                                                    navigate(`/documents?parentId=${folder._id}`)
                                                }
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
                                                onPreview={() => navigate(`/documents/${file._id}`)}
                                                onDoubleClick={() =>
                                                    navigate(`/documents/${file._id}`)
                                                }
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
                            Chưa có tài liệu nào được đánh dấu sao. Hãy đánh dấu sao cho tài liệu
                            hoặc thư mục yêu thích!
                        </p>
                    </div>
                )}
            </div>
        </Home>
    );
};

export default Starred;
