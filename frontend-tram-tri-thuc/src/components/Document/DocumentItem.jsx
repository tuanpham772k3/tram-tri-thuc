import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FaFileExcel, FaFilePdf, FaFileWord, FaFolder, FaImage } from "react-icons/fa";
import { renameDocument, fetchDocuments, starDocument } from "../../redux/slices/documentSlice";
import {
    deleteDocument,
    fetchTrash,
    permanentlyDeleteDocument,
    restoreDocument,
} from "../../redux/slices/trashSlice";
import showToast from "../../utils/toast";
import ActionButtonGroup from "./ActionButtonGroup";
import { formatFileSize, formatDate } from "../../utils/helpers";
import Modal from "../Ui/Modal";

const DocumentItem = ({
    document,
    onPreview,
    onDoubleClick,
    onDrop,
    view = "list",
    isTrash = false,
    sharerInfo, // Thêm prop để nhận thông tin người chia sẻ
}) => {
    const dispatch = useDispatch();
    const { _id, name, type, mimeType, size, uploadDate, deletedAt, permission, userId } = document;
    const { loading } = useSelector((state) => state.documents);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(document.name);

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

    const handleShare = useCallback(() => {
        // Logic đã được xử lý trong ActionButtonGroup
    }, []);

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

    // Sử dụng sharerInfo nếu có (cho SharedWithMePage), nếu không thì dùng userId (cho Trash hoặc các trang khác)
    const displayInfo = sharerInfo || userId || { email: "Không xác định", avatar: null };
    const avatar = displayInfo.avatar ? (
        <img
            src={displayInfo.avatar}
            alt="Avatar"
            className={`rounded-full ${view === "list" ? "w-6 h-6" : "w-5 h-5"} mr-1`}
            onError={(e) => (e.target.src = "/default-avatar.png")} // Fallback avatar
        />
    ) : (
        <span
            className={`rounded-full ${
                view === "list" ? "w-6 h-6" : "w-5 h-5"
            } bg-gray-300 flex items-center justify-center mr-1 text-xs text-gray-700`}
        >
            {displayInfo.email?.charAt(0).toUpperCase() || "?"}
        </span>
    );

    return (
        <>
            {view === "list" ? (
                <tr
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 group relative"
                    draggable={!isTrash}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={(e) => !isTrash && e.preventDefault()}
                    onDoubleClick={onDoubleClick}
                >
                    <td className="py-3 px-4 flex items-center">
                        {getIcon(document.type, document.mimeType)}
                        <span className="ml-3 text-gray-800 dark:text-gray-200 truncate">
                            {document.name}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                        <div className="flex items-center group relative">
                            {avatar}
                            <span className="truncate max-w-[150px] text-gray-600 dark:text-gray-400">
                                {displayInfo.email}
                            </span>
                            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                                {displayInfo.email}
                            </div>
                        </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {formatDate(document.deletedAt || document.uploadDate)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {formatFileSize(document.size)}
                    </td>
                    <td className="py-3 px-4">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButtonGroup
                                document={document}
                                isTrash={isTrash}
                                onPreview={onPreview}
                                onRename={() => setIsRenaming(true)}
                                onStar={handleStar}
                                onDelete={handleDelete}
                                onRestore={handleRestore}
                                onPermanentlyDelete={handlePermanentlyDelete}
                                onShare={handleShare}
                                view={view}
                            />
                        </div>
                    </td>
                </tr>
            ) : (
                <div
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    draggable={!isTrash}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={(e) => !isTrash && e.preventDefault()}
                    onDoubleClick={onDoubleClick}
                >
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 flex items-center relative">
                        {getIcon(document.type, document.mimeType)}
                        <div className="ml-3 flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                                {document.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(document.size)} •{" "}
                                {formatDate(document.deletedAt || document.uploadDate)}
                            </p>
                            <div className="flex items-center mt-1 group relative">
                                {avatar}
                                <span className="text-xs truncate max-w-[120px] text-gray-600 dark:text-gray-400">
                                    {displayInfo.email}
                                </span>
                                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                                    {displayInfo.email}
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButtonGroup
                                document={document}
                                isTrash={isTrash}
                                onPreview={onPreview}
                                onRename={() => setIsRenaming(true)}
                                onStar={handleStar}
                                onDelete={handleDelete}
                                onRestore={handleRestore}
                                onPermanentlyDelete={handlePermanentlyDelete}
                                onShare={handleShare}
                                view={view}
                            />
                        </div>
                    </div>
                    <div className="aspect-square bg-gray-100 dark:bg-gray-600 flex items-center justify-center p-2">
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                            Xem trước nội dung
                        </div>
                    </div>
                </div>
            )}
            <Modal
                isOpen={isRenaming}
                title="Đổi tên tài liệu"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onSave={handleRename}
                onCancel={() => setIsRenaming(false)}
                loading={loading}
            />
        </>
    );
};

DocumentItem.propTypes = {
    document: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["file", "folder"]).isRequired,
        mimeType: PropTypes.string,
        size: PropTypes.number,
        uploadDate: PropTypes.string,
        deletedAt: PropTypes.string,
        parentId: PropTypes.string,
        starred: PropTypes.bool,
        userId: PropTypes.shape({
            _id: PropTypes.string,
            email: PropTypes.string,
            avatar: PropTypes.string,
        }),
    }).isRequired,
    onPreview: PropTypes.func,
    onDoubleClick: PropTypes.func.isRequired,
    onDrop: PropTypes.func,
    view: PropTypes.oneOf(["list", "grid"]),
    isTrash: PropTypes.bool,
    sharerInfo: PropTypes.shape({
        email: PropTypes.string,
        avatar: PropTypes.string,
    }),
};

export default DocumentItem;
