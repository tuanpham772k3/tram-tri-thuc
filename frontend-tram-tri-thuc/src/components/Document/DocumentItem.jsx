// src/components/Document/DocumentItem.jsx
import { useState } from "react";
import {
    FaDownload,
    FaEdit,
    FaEye,
    FaFileExcel,
    FaFilePdf,
    FaFileWord,
    FaFolder,
    FaImage,
    FaTrash,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
    deleteDocument,
    renameDocument,
    fetchDocuments,
} from "../../redux/slices/documentSlice";

const DocumentItem = ({
    document,
    onPreview,
    onDoubleClick,
    onDrop,
    view = "list",
}) => {
    const dispatch = useDispatch();
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(document.name);

    // Lấy biểu tượng dựa trên loại tài liệu và kiểu MIME
    const getIcon = (type, mimeType) => {
        if (type === "folder")
            return (
                <FaFolder
                    size={view === "list" ? 20 : 30}
                    className="text-yellow-500"
                />
            );
        switch (mimeType) {
            case "application/pdf":
                return (
                    <FaFilePdf
                        size={view === "list" ? 20 : 30}
                        className="text-red-500"
                    />
                );
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return (
                    <FaFileWord
                        size={view === "list" ? 20 : 30}
                        className="text-blue-500"
                    />
                );
            case "application/vnd.ms-excel":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return (
                    <FaFileExcel
                        size={view === "list" ? 20 : 30}
                        className="text-green-500"
                    />
                );
            case "image/jpeg":
            case "image/png":
                return (
                    <FaImage
                        size={view === "list" ? 20 : 30}
                        className="text-purple-500"
                    />
                );
            default:
                return (
                    <FaFilePdf
                        size={view === "list" ? 20 : 30}
                        className="text-gray-500"
                    />
                );
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

    // Xử lý xóa tài liệu
    const handleDelete = async () => {
        if (!window.confirm(`Bạn có chắc muốn xóa "${document.name}" không?`))
            return;
        try {
            await dispatch(deleteDocument(document._id)).unwrap();
            toast.success("Xóa tài liệu thành công");
            dispatch(fetchDocuments({ parentId: document.parentId || null }));
        } catch (error) {
            toast.error(error.message || "Xóa tài liệu thất bại");
        }
    };

    // Xử lý đổi tên tài liệu
    const handleRename = async () => {
        const trimmedName = newName.trim();

        if (!trimmedName || trimmedName === document.name) {
            setIsRenaming(false);
            return;
        }

        try {
            await dispatch(
                renameDocument({ id: document._id, name: trimmedName })
            ).unwrap();

            toast.success("Đổi tên tài liệu thành công");
            dispatch(fetchDocuments({ parentId: document.parentId || null }));
            setIsRenaming(false);
        } catch (error) {
            toast.error(error.message || "Đổi tên thất bại");
            setIsRenaming(false);
        }
    };

    // Xử lý kéo và thả
    const handleDragStart = (e) =>
        e.dataTransfer.setData("documentId", document._id);
    const handleDrop = (e) => {
        e.preventDefault();
        if (document.type === "folder" && onDrop) onDrop(e, document._id);
    };

    // Giao diện chung
    const renderActions = () => (
        <div
            className={
                view === "list"
                    ? "flex justify-center space-x-3"
                    : "flex space-x-2"
            }
        >
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
            {view === "list" && (
                <>
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
                </>
            )}
            {/* {view === "grid" && (
                <button
                    onClick={onPreview}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
                    title="Xem trước"
                >
                    <FaEye size={16} /> Xem
                </button>
            )} */}
        </div>
    );

    const renderRenameModal = () => (
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
    );

    return view === "list" ? (
        <tr
            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
            draggable
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDoubleClick={onDoubleClick}
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
            <td className="py-3 px-4">{renderActions()}</td>
            {isRenaming && renderRenameModal()}
        </tr>
    ) : (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
            draggable
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDoubleClick={onDoubleClick}
        >
            <div className="p-4 bg-gray-50 dark:bg-gray-700 flex items-center">
                {getIcon(document.type, document.mimeType)}
                <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                        {document.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(document.size)} •{" "}
                        {formatDate(document.uploadDate)}
                    </p>
                </div>
            </div>
            <div className="aspect-square bg-gray-100 dark:bg-gray-600 flex items-center justify-center p-2">
                <div className="text-xs text-gray-500 dark:text-gray-300">
                    Xem trước nội dung
                </div>
            </div>
            <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between space-x-2">
                {renderActions()}
            </div>
            {isRenaming && renderRenameModal()}
        </div>
    );
};

export default DocumentItem;
