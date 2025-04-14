// src/pages/DocumentList.jsx
import { useEffect, useState } from "react";
import { FaFolderPlus, FaList, FaTh } from "react-icons/fa";
import Home from "./Home/Home";
import { useDispatch, useSelector } from "react-redux";
import {
    createFolder,
    fetchDocuments,
    moveDocument,
} from "../redux/slices/documentSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UploadDropzone from "../components/Document/UploadDropzone";
import DocumentItem from "../components/Document/DocumentItem";

const DocumentList = () => {
    const [view, setView] = useState("list");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal tạo folder
    const [folderName, setFolderName] = useState(""); // Tên folder

    const dispatch = useDispatch();
    const { documents, loading } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const parentId =
        searchParams.get("parentId") === "null"
            ? "root"
            : searchParams.get("parentId") || "root";

    useEffect(() => {
        if (token && parentId) {
            if (parentId !== "root" && !/^[0-9a-fA-F]{24}$/.test(parentId)) {
                toast.error("parentId không hợp lệ");
                navigate("/documents");
                return;
            }
            dispatch(
                fetchDocuments({
                    parentId: parentId === "root" ? null : parentId,
                })
            )
                .unwrap()
                .catch((error) => {
                    console.error("Fetch error:", error);
                    if (
                        error ===
                        "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
                    ) {
                        toast.error(
                            "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
                        );
                        navigate("/login");
                    } else {
                        toast.error("Không thể tải danh sách tài liệu");
                    }
                });
        }
    }, [token, dispatch, parentId, navigate]);

    // Loại bỏ trùng lặp documents
    const uniqueDocuments = Array.from(
        new Map(documents.map((doc) => [doc._id, doc])).values()
    );

    // Sort documents
    const sortedDocuments = [...uniqueDocuments].sort((a, b) => {
        if (sortBy === "name") {
            return sortDirection === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } else if (sortBy === "date") {
            return sortDirection === "asc"
                ? new Date(a.uploadDate) - new Date(b.uploadDate)
                : new Date(b.uploadDate) - new Date(a.uploadDate);
        } else if (sortBy === "size") {
            return sortDirection === "asc" ? a.size - b.size : b.size - a.size;
        }
        return 0;
    });

    // Toggle sort
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

    const handleDrop = async (e, targetFolderId) => {
        const draggedId = e.dataTransfer.getData("documentId");
        try {
            await dispatch(
                moveDocument({ id: draggedId, newParentId: targetFolderId })
            ).unwrap();
            toast.success("Di chuyển tài liệu thành công");
            dispatch(
                fetchDocuments({
                    parentId: parentId === "root" ? null : parentId,
                })
            );
        } catch (error) {
            toast.error("Di chuyển tài liệu thất bại");
        }
    };

    // Tạo folder con
    const handleCreateFolder = async () => {
        if (!folderName.trim()) {
            toast.error("Tên thư mục không được để trống");
            return;
        }
        try {
            await dispatch(
                createFolder({
                    name: folderName,
                    parentId: parentId === "root" ? null : parentId,
                })
            ).unwrap();
            toast.success("Tạo thư mục thành công");
            setFolderName("");
            setIsModalOpen(false);
        } catch (error) {
            toast.error(
                "Tạo thư mục thất bại: " +
                    (error.message || "Lỗi không xác định")
            );
            console.error("Create folder error:", error);
        }
    };

    return (
        <Home>
            <div className="max-w-6xl mx-auto p-6 gradient-bg rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                        Trạm của tôi
                    </h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                        >
                            <FaFolderPlus className="mr-2" /> Tạo thư mục
                        </button>
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

                <UploadDropzone parentId={parentId} />

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
                                                        {sortDirection === "asc"
                                                            ? "↑"
                                                            : "↓"}
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
                                                        {sortDirection === "asc"
                                                            ? "↑"
                                                            : "↓"}
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
                                                        {sortDirection === "asc"
                                                            ? "↑"
                                                            : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="py-3 px-4 text-center">
                                            Thao tác
                                        </th>
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
                                                    ? navigate(
                                                          `/documents?parentId=${doc._id}`
                                                      )
                                                    : navigate(
                                                          `/documents/${doc._id}`
                                                      )
                                            }
                                            onDoubleClick={() =>
                                                doc.type === "folder"
                                                    ? navigate(
                                                          `/documents?parentId=${doc._id}`
                                                      )
                                                    : navigate(
                                                          `/documents/${doc._id}`
                                                      )
                                            }
                                            onDrop={handleDrop}
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
                                                    navigate(
                                                        `/documents?parentId=${folder._id}`
                                                    )
                                                }
                                                onDrop={handleDrop}
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
                        </div>
                    )
                ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center mt-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            Chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên
                            của bạn!
                        </p>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-96">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                Tạo thư mục mới
                            </h2>
                            <input
                                type="text"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                className="w-full px-4 py-2 mb-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên thư mục"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-red-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleCreateFolder}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Tạo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Home>
    );
};

export default DocumentList;
