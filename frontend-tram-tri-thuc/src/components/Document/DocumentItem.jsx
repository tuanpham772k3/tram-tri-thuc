import { useState, useCallback } from "react";
import {
    FaDownload,
    FaEdit,
    FaEye,
    FaFileExcel,
    FaFilePdf,
    FaFileWord,
    FaFolder,
    FaImage,
    FaStar,
    FaTrash,
    FaTrashAlt,
    FaUndo,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { renameDocument, fetchDocuments, starDocument } from "../../redux/slices/documentSlice";
import {
    deleteDocument,
    fetchTrash,
    permanentlyDeleteDocument,
    restoreDocument,
} from "../../redux/slices/trashSlice";
import showToast from "../../utils/toast";

// Sub-component cho modal đổi tên
const RenameModal = ({ isOpen, newName, setNewName, onSave, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Đổi tên tài liệu
                </h2>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên mới"
                    autoFocus
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-red-500"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sub-component cho các hành động
const DocumentActions = ({
    document,
    isTrash,
    onPreview,
    onRename,
    onStar,
    onDelete,
    onRestore,
    onPermanentlyDelete,
    view,
}) => (
    <div className={view === "list" ? "flex justify-center space-x-3" : "flex space-x-2"}>
        {isTrash ? (
            <>
                <button
                    onClick={onRestore}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    title="Khôi phục"
                >
                    <FaUndo size={16} />
                </button>
                <button
                    onClick={onPermanentlyDelete}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Xóa vĩnh viễn"
                >
                    <FaTrashAlt size={16} />
                </button>
            </>
        ) : (
            <>
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
                    onClick={onDelete}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Xóa"
                >
                    <FaTrash size={16} />
                </button>
                <button
                    onClick={onRename}
                    className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                    title="Đổi tên"
                >
                    <FaEdit size={16} />
                </button>
                <button
                    onClick={onStar}
                    className={`${
                        document.starred
                            ? "text-yellow-500 dark:text-yellow-400"
                            : "text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
                    } transition-colors`}
                    title={document.starred ? "Bỏ đánh dấu sao" : "Đánh dấu sao"}
                >
                    <FaStar size={16} />
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
            </>
        )}
    </div>
);

const DocumentItem = ({
    document,
    onPreview,
    onDoubleClick,
    onDrop,
    view = "list",
    isTrash = false,
}) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.documents);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(document.name);

    // Lấy biểu tượng dựa trên loại tài liệu và kiểu MIME
    const getIcon = useCallback(
        (type, mimeType) => {
            if (type === "folder")
                return <FaFolder size={view === "list" ? 20 : 30} className="text-yellow-500" />;

            switch (mimeType) {
                case "application/pdf":
                    return <FaFilePdf size={view === "list" ? 20 : 30} className="text-red-500" />;
                case "application/msword":
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    return (
                        <FaFileWord size={view === "list" ? 20 : 30} className="text-blue-500" />
                    );
                case "application/vnd.ms-excel":
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return (
                        <FaFileExcel size={view === "list" ? 20 : 30} className="text-green-500" />
                    );
                case "image/jpeg":
                case "image/png":
                    return <FaImage size={view === "list" ? 20 : 30} className="text-purple-500" />;
                default:
                    return <FaFilePdf size={view === "list" ? 20 : 30} className="text-gray-500" />;
            }
        },
        [view]
    );

    // Thay đổi định dạng kích thước tệp
    const formatFileSize = useCallback(
        (bytes) =>
            bytes
                ? bytes < 1024
                    ? bytes + " B"
                    : bytes < 1024 * 1024
                      ? (bytes / 1024).toFixed(1) + " KB"
                      : (bytes / (1024 * 1024)).toFixed(2) + " MB"
                : "-",
        []
    );

    // Thay đổi định dạng ngày tháng
    const formatDate = useCallback(
        (dateString) =>
            new Date(dateString).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
        []
    );

    // Xử lý xóa tạm
    const handleDelete = useCallback(async () => {
        if (!window.confirm(`Bạn có chắc muốn xóa "${document.name}" không?`)) return;

        try {
            await dispatch(deleteDocument(document._id)).unwrap();
            showToast("success", "Đã chuyển vào thùng rác");
            dispatch(fetchDocuments({ parentId: document.parentId || null }));
        } catch (error) {
            showToast("error", error || "Xóa thất bại");
        }
    }, [dispatch, document._id, document.name, document.parentId]);

    // Xử lý xóa vĩnh viễn
    const handlePermanentlyDelete = useCallback(async () => {
        if (!window.confirm(`Bạn có chắc muốn xóa vĩnh viễn "${document.name}" không?`)) return;

        try {
            await dispatch(permanentlyDeleteDocument(document._id)).unwrap();
            showToast("success", "Xóa vĩnh viễn thành công");
            dispatch(fetchTrash());
        } catch (error) {
            showToast("error", error || "Xóa vĩnh viễn thất bại");
        }
    }, [dispatch, document._id, document.name]);

    // Xử lý khôi phục
    const handleRestore = useCallback(async () => {
        if (!window.confirm(`Bạn có chắc muốn khôi phục "${document.name}" không?`)) return;

        try {
            await dispatch(restoreDocument(document._id)).unwrap();
            showToast("success", "Khôi phục thành công");
            dispatch(fetchTrash());
        } catch (error) {
            showToast("error", error || "Khôi phục thất bại");
        }
    }, [dispatch, document._id, document.name]);

    // Xử lý đổi tên tài liệu
    const handleRename = useCallback(async () => {
        const trimmedName = newName.trim();
        if (!trimmedName) {
            showToast("error", "Tên không được để trống");
            setIsRenaming(false);
            return;
        }

        if (trimmedName.length > 255) {
            showToast("error", "Tên không được vượt quá 255 ký tự");
            setIsRenaming(false);
            return;
        }

        if (trimmedName === document.name) {
            setIsRenaming(false);
            return;
        }

        try {
            await dispatch(renameDocument({ id: document._id, name: trimmedName })).unwrap();
            showToast("success", "Đổi tên tài liệu thành công");
            dispatch(fetchDocuments({ parentId: document.parentId || null }));
            setIsRenaming(false);
        } catch (error) {
            showToast("error", error || "Đổi tên thất bại");
            setIsRenaming(false);
        }
    }, [dispatch, document._id, document.name, document.parentId, newName]);

    // Xử lý kéo và thả
    const handleDragStart = useCallback(
        (e) => {
            e.dataTransfer.setData("documentId", document._id);
        },
        [document._id]
    );

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            if (document.type === "folder" && onDrop) onDrop(e, document._id);
        },
        [document.type, onDrop]
    );

    // Xử lý đánh dấu/bỏ đánh dấu sao
    const handleStar = useCallback(async () => {
        try {
            await dispatch(starDocument(document._id)).unwrap();
            showToast(
                "success",
                document.starred ? "Bỏ đánh dấu sao thành công" : "Đánh dấu sao thành công"
            );
        } catch (error) {
            showToast("error", error || "Thao tác thất bại");
        }
    }, [dispatch, document._id, document.starred]);

    return (
        <>
            {view === "list" ? (
                <tr
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
                    draggable={!isTrash}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={(e) => !isTrash && e.preventDefault()}
                    onDoubleClick={isTrash ? () => {} : onDoubleClick}
                >
                    <td className="py-3 px-4 flex items-center">
                        {getIcon(document.type, document.mimeType)}
                        <span className="ml-3 text-gray-800 dark:text-gray-200 truncate">
                            {document.name}
                        </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {formatDate(document.deletedAt || document.uploadDate)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {formatFileSize(document.size)}
                    </td>
                    <td className="py-3 px-4">
                        <DocumentActions
                            document={document}
                            isTrash={isTrash}
                            onPreview={onPreview}
                            onRename={() => setIsRenaming(true)}
                            onStar={handleStar}
                            onDelete={handleDelete}
                            onRestore={handleRestore}
                            onPermanentlyDelete={handlePermanentlyDelete}
                            view={view}
                        />
                    </td>
                </tr>
            ) : (
                <div
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    draggable={!isTrash}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={(e) => !isTrash && e.preventDefault()}
                    onDoubleClick={isTrash ? () => {} : onDoubleClick}
                >
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 flex items-center">
                        {getIcon(document.type, document.mimeType)}
                        <div className="ml-3 flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                                {document.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(document.size)} •{" "}
                                {formatDate(document.deletedAt || document.uploadDate)}
                            </p>
                        </div>
                    </div>
                    <div className="aspect-square bg-gray-100 dark:bg-gray-600 flex items-center justify-center p-2">
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                            Xem trước nội dung
                        </div>
                    </div>
                    <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between space-x-2">
                        <DocumentActions
                            document={document}
                            isTrash={isTrash}
                            onPreview={onPreview}
                            onRename={() => setIsRenaming(true)}
                            onStar={handleStar}
                            onDelete={handleDelete}
                            onRestore={handleRestore}
                            onPermanentlyDelete={handlePermanentlyDelete}
                            view={view}
                        />
                    </div>
                </div>
            )}
            <RenameModal
                isOpen={isRenaming}
                newName={newName}
                setNewName={setNewName}
                onSave={handleRename}
                onCancel={() => setIsRenaming(false)}
            />
        </>
    );
};

export default DocumentItem;
