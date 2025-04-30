import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    FaDownload,
    FaEdit,
    FaEye,
    FaStar,
    FaTrash,
    FaTrashAlt,
    FaUndo,
    FaEllipsisV,
    FaShareAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { openShareModal } from "../../redux/slices/shareSlice";

const ActionButtonGroup = ({
    document,
    isTrash,
    onPreview,
    onRename,
    onStar,
    onDelete,
    onRestore,
    onPermanentlyDelete,
    onShare,
    view,
}) => {
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleShare = () => {
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 300); // Reset animation
        dispatch(openShareModal({ documentId: document._id }));
        onShare();
        setIsMenuOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title="Thêm hành động"
            >
                <FaEllipsisV size={16} />
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                    {isTrash ? (
                        <>
                            <button
                                onClick={() => {
                                    onRestore();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full px-4 py-2 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaUndo size={14} className="mr-2" /> Khôi phục
                            </button>
                            <button
                                onClick={() => {
                                    onPermanentlyDelete();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full px-4 py-2 flex items-center text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaTrashAlt size={14} className="mr-2" /> Xóa vĩnh viễn
                            </button>
                        </>
                    ) : (
                        <>
                            {document.type === "file" && (
                                <a
                                    href={document.directUrl}
                                    className="w-full px-4 py-2 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="Tải xuống"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FaDownload size={14} className="mr-2" /> Tải xuống
                                </a>
                            )}
                            <button
                                onClick={handleShare}
                                className={`w-full px-4 py-2 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${
                                    isSharing ? "animate-pulse scale-105" : ""
                                }`}
                            >
                                <FaShareAlt size={14} className="mr-2" /> Chia sẻ
                            </button>
                            <button
                                onClick={() => {
                                    onDelete();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full px-4 py-2 flex items-center text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaTrash size={14} className="mr-2" /> Xóa
                            </button>
                            <button
                                onClick={() => {
                                    onRename();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full px-4 py-2 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaEdit size={14} className="mr-2" /> Đổi tên
                            </button>
                            <button
                                onClick={() => {
                                    onStar();
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full px-4 py-2 flex items-center ${
                                    document.starred
                                        ? "text-yellow-500"
                                        : "text-gray-700 dark:text-gray-200"
                                } hover:bg-gray-100 dark:hover:bg-gray-700`}
                            >
                                <FaStar size={14} className="mr-2" />{" "}
                                {document.starred ? "Bỏ sao" : "Đánh dấu sao"}
                            </button>
                            {view === "list" && (
                                <button
                                    onClick={() => {
                                        onPreview();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-2 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <FaEye size={14} className="mr-2" /> Xem trước
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

ActionButtonGroup.propTypes = {
    document: PropTypes.object.isRequired,
    isTrash: PropTypes.bool,
    onPreview: PropTypes.func,
    onRename: PropTypes.func.isRequired,
    onStar: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onRestore: PropTypes.func,
    onPermanentlyDelete: PropTypes.func,
    onShare: PropTypes.func.isRequired,
    view: PropTypes.oneOf(["list", "grid"]).isRequired,
};

export default ActionButtonGroup;
