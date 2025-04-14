import { useState } from "react";
import {
    FaDownload,
    FaEdit,
    FaEye,
    FaFileExcel,
    FaFilePdf,
    FaFileWord,
    FaImage,
    FaTrash,
    FaFolder,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import {
    deleteDocument,
    fetchDocuments,
    renameDocument,
} from "../../redux/slices/documentSlice";

const DocumentRow = ({ document, onPreview, onDrop }) => {
    const dispatch = useDispatch();
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(document.name);

    // Lấy biểu tượng dựa trên loại tài liệu và kiểu MIME
    const getIcon = (type, mimeType) => {
        if (type === "folder")
            return <FaFolder size={20} className="text-yellow-500" />;
        switch (mimeType) {
            case "application/pdf":
                return <FaFilePdf size={20} className="text-red-500" />;
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return <FaFileWord size={20} className="text-blue-500" />;
            case "application/vnd.ms-excel":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return <FaFileExcel size={20} className="text-green-500" />;
            case "image/jpeg":
            case "image/png":
                return <FaImage size={20} className="text-purple-500" />;
            default:
                return <FaFilePdf size={20} className="text-gray-500" />;
        }
    };

    // Thay đổi định dạng kích thước tệp
    const formatFileSize = (bytes) =>
        bytes
            ? bytes < 1024
                ? bytes + " B"
                : bytes < 1024 * 1024
                  ? (bytes / 1024).toFixed(1) + " KB"
                  : (bytes / (1024 * 1024)).toFixed(2) + " MB"
            : "-";

    // Thay đổi định dạng ngày tháng
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    // Xóa tài liệu
    const handleDelete = () => {
        if (window.confirm(`Bạn có chắc muốn xóa "${document.name}" không?`))
            dispatch(deleteDocument(document._id)).then(() => {
                dispatch(
                    fetchDocuments({ parentId: document.parentId || null })
                );
            });
    };

    // Đổi tên tài liệu
    const handleRename = () => {
        if (newName && newName !== document.name)
            dispatch(renameDocument({ id: document._id, name: newName })).then(
                () => {
                    dispatch(
                        fetchDocuments({ parentId: document.parentId || null })
                    );
                }
            );
        setIsRenaming(false);
    };

    // Kéo và thả tài liệu
    const handleDragStart = (e) =>
        e.dataTransfer.setData("documentId", document._id);
    const handleDrop = (e) => {
        e.preventDefault();
        if (document.type === "folder" && onDrop) onDrop(e, document._id);
    };

    return (
        <tr
            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
            draggable
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <td className="py-3 px-4 flex items-center">
                {getIcon(document.type, document.mimeType)}
                <span className="ml-3 text-gray-800 dark:text-gray-200 truncate">
                    {document.name}
                </span>
            </td>
            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                {formatDate(document.uploadDate)}
            </td>
            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                {formatFileSize(document.size)}
            </td>
            <td className="py-3 px-4">
                <div className="flex justify-center space-x-3">
                    {document.type === "file" && (
                        <a
                            href={document.directUrl}
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            title="Tải xuống"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaDownload size={16} />
                        </a>
                    )}
                    <button
                        onClick={handleDelete}
                        className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Xóa"
                    >
                        <FaTrash size={16} />
                    </button>
                    <button
                        onClick={() => setIsRenaming(true)}
                        className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                        title="Đổi tên"
                    >
                        <FaEdit size={16} />
                    </button>
                    <button
                        onClick={onPreview}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        title="Xem trước"
                    >
                        <FaEye size={16} />
                    </button>
                    <button
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                        title="Thêm"
                    >
                        <BsThreeDotsVertical size={16} />
                    </button>
                </div>
                {isRenaming && (
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 p-4 flex flex-col justify-center z-10 rounded-lg shadow-lg">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            autoFocus
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsRenaming(false)}
                                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleRename}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default DocumentRow;
