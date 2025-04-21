import { useEffect, useState, useCallback } from "react";
import { FaFolderPlus, FaList, FaTh } from "react-icons/fa";
import Home from "./Home/Home";
import { useDispatch, useSelector } from "react-redux";
import {
    createFolder,
    fetchDocuments,
    moveDocument,
    clearError,
} from "../redux/slices/documentSlice";
import { useLocation, useNavigate } from "react-router-dom";
import showToast from "../utils/toast";
import UploadDropzone from "../components/Document/UploadDropzone";
import DocumentItem from "../components/Document/DocumentItem";

// Sub-component cho modal tạo thư mục
const CreateFolderModal = ({ isOpen, folderName, setFolderName, onCreate, onCancel, loading }) => {
    if (!isOpen) return null;

    return (
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
                    disabled={loading}
                    autoFocus
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-red-500"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onCreate}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={loading}
                    >
                        Tạo
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sub-component cho bảng danh sách tài liệu
const DocumentTable = ({ documents, sortBy, sortDirection, handleSort, onDrop, navigate }) => (
    <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
                <tr className="border-b dark:border-gray-700">
                    <th className="py-3 px-4 text-left" onClick={() => handleSort("name")}>
                        <div className="flex items-center cursor-pointer">
                            <span className="text-gray-700 dark:text-gray-300">Tên</span>
                            {sortBy === "name" && (
                                <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                        </div>
                    </th>
                    <th className="py-3 px-4 text-left" onClick={() => handleSort("date")}>
                        <div className="flex items-center cursor-pointer">
                            <span className="text-gray-700 dark:text-gray-300">Ngày tải lên</span>
                            {sortBy === "date" && (
                                <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                        </div>
                    </th>
                    <th className="py-3 px-4 text-left" onClick={() => handleSort("size")}>
                        <div className="flex items-center cursor-pointer">
                            <span className="text-gray-700 dark:text-gray-300">Dung lượng</span>
                            {sortBy === "size" && (
                                <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                        </div>
                    </th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {documents.map((doc) => (
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
                        onDrop={onDrop}
                    />
                ))}
            </tbody>
        </table>
    </div>
);

// Sub-component cho lưới tài liệu
const DocumentGrid = ({ folders, files, navigate, onDrop }) => (
    <div className="mt-6">
        {folders.length > 0 && (
            <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Thư mục
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {folders.map((folder) => (
                        <DocumentItem
                            key={folder._id}
                            document={folder}
                            view="grid"
                            onDoubleClick={() => navigate(`/documents?parentId=${folder._id}`)}
                            onDrop={onDrop}
                        />
                    ))}
                </div>
            </div>
        )}
        {files.length > 0 && (
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Tệp</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {files.map((file) => (
                        <DocumentItem
                            key={file._id}
                            document={file}
                            view="grid"
                            onPreview={() => navigate(`/documents/${file._id}`)}
                            onDoubleClick={() => navigate(`/documents/${file._id}`)}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
);

const DocumentList = () => {
    const [view, setView] = useState("list");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");

    const dispatch = useDispatch();
    const { documents, loading, error } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const parentId =
        searchParams.get("parentId") === "null" ? "root" : searchParams.get("parentId") || "root";

    // Lấy danh sách tài liệu
    useEffect(() => {
        if (token && parentId) {
            if (parentId !== "root" && !/^[0-9a-fA-F]{24}$/.test(parentId)) {
                showToast("error", "parentId không hợp lệ");
                navigate("/documents");
                return;
            }
            dispatch(fetchDocuments({ parentId: parentId === "root" ? null : parentId }))
                .unwrap()
                .catch((error) => {
                    showToast("error", error);
                    if (error.includes("Session expired")) {
                        navigate("/login");
                    }
                });
            dispatch(clearError());
        }
    }, [token, dispatch, parentId, navigate]);

    // Sắp xếp và lọc tài liệu
    const getSortedDocuments = useCallback(() => {
        const sorted = [...documents].sort((a, b) => {
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
        return {
            folders: sorted.filter((doc) => doc.type === "folder"),
            files: sorted.filter((doc) => doc.type === "file"),
        };
    }, [documents, sortBy, sortDirection]);

    const { folders, files } = getSortedDocuments();

    // Toggle sort
    const handleSort = useCallback(
        (column) => {
            if (sortBy === column) {
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
            } else {
                setSortBy(column);
                setSortDirection("asc");
            }
        },
        [sortBy, sortDirection]
    );

    // Xử lý kéo và thả
    const handleDrop = useCallback(
        async (e, targetFolderId) => {
            const draggedId = e.dataTransfer.getData("documentId");
            try {
                await dispatch(
                    moveDocument({ id: draggedId, newParentId: targetFolderId })
                ).unwrap();
                showToast("success", "Di chuyển tài liệu thành công");
                dispatch(fetchDocuments({ parentId: parentId === "root" ? null : parentId }));
            } catch (error) {
                showToast("error", error || "Di chuyển tài liệu thất bại");
            }
        },
        [dispatch, parentId]
    );

    // Xử lý tạo thư mục
    const handleCreateFolder = useCallback(async () => {
        const trimmedName = folderName.trim();
        if (!trimmedName) {
            showToast("error", "Tên thư mục không được để trống");
            return;
        }
        if (trimmedName.length > 255) {
            showToast("error", "Tên thư mục không được vượt quá 255 ký tự");
            return;
        }
        try {
            await dispatch(
                createFolder({ name: trimmedName, parentId: parentId === "root" ? null : parentId })
            ).unwrap();
            setFolderName("");
            setIsModalOpen(false);
        } catch (error) {
            showToast("error", error || "Tạo thư mục thất bại");
        }
    }, [dispatch, folderName, parentId]);

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
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center disabled:bg-blue-400"
                            disabled={loading}
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
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg text-center">
                        <p className="text-red-600 dark:text-red-300">{error}</p>
                    </div>
                ) : documents.length ? (
                    view === "list" ? (
                        <DocumentTable
                            documents={documents}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                            onDrop={handleDrop}
                            navigate={navigate}
                        />
                    ) : (
                        <DocumentGrid
                            folders={folders}
                            files={files}
                            navigate={navigate}
                            onDrop={handleDrop}
                        />
                    )
                ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center mt-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            Chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên của bạn!
                        </p>
                    </div>
                )}

                <CreateFolderModal
                    isOpen={isModalOpen}
                    folderName={folderName}
                    setFolderName={setFolderName}
                    onCreate={handleCreateFolder}
                    onCancel={() => setIsModalOpen(false)}
                    loading={loading}
                />
            </div>
        </Home>
    );
};

export default DocumentList;
