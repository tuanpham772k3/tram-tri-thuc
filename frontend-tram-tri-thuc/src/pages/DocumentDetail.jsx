import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteDocument,
    renameDocument,
    fetchDocuments,
} from "../redux/slices/documentSlice";
import { FaArrowLeft, FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import Home from "./Home/Home";

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { documents, loading } = useSelector((state) => state.documents);
    const [document, setDocument] = useState(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        const doc = documents.find((doc) => doc._id === id);
        if (doc) {
            console.log("Document data:", doc); // Debug
            setDocument(doc);
            setNewName(doc.name);
        } else {
            dispatch(fetchDocuments());
        }
    }, [id, documents, dispatch]);

    const handleDelete = useCallback(() => {
        if (window.confirm(`Bạn có chắc muốn xóa "${document?.name}" không?`)) {
            dispatch(deleteDocument(id)).then(() => navigate("/"));
        }
    }, [dispatch, id, document, navigate]);

    const handleRename = useCallback(() => {
        if (newName && newName !== document.name) {
            dispatch(renameDocument({ id, name: newName })).then(() => {
                setIsRenaming(false);
                setDocument({ ...document, name: newName });
            });
        } else {
            setIsRenaming(false);
        }
    }, [dispatch, id, newName, document]);

    const getPreviewUrl = useCallback(() => {
        if (!document) return null;
        return `https://drive.google.com/file/d/${document.driveId}/preview`; // URL preview cho iframe
    }, [document]);

    const renderPreview = useCallback(() => {
        if (!document) return null;

        const previewUrl = getPreviewUrl();
        console.log("Preview URL:", previewUrl); // Debug

        if (!previewUrl) {
            return (
                <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-500 text-center">
                        Không thể tạo URL xem trước! Vui lòng kiểm tra file.
                    </p>
                </div>
            );
        }

        return (
            <iframe
                src={previewUrl}
                title={document.name}
                className="w-full h-[600px] rounded-lg border-0 shadow-md"
                allowFullScreen
                loading="lazy"
                onError={(e) => console.error("Iframe load error:", e)} // Debug lỗi iframe
            />
        );
    }, [document, getPreviewUrl]);

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    if (loading || !document) {
        return (
            <Home>
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Home>
        );
    }

    return (
        <Home>
            <div className="p-6 gradient-bg rounded-lg min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white truncate max-w-[70%]">
                        {document.name}
                    </h1>
                    <button
                        onClick={() => navigate("/documents")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors"
                    >
                        <FaArrowLeft /> Quay lại
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            Xem trước
                        </h2>
                        <div className="relative">{renderPreview()}</div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            Thông tin chi tiết
                        </h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p>
                                <span className="font-medium">Tên file:</span>{" "}
                                {document.name}
                            </p>
                            <p>
                                <span className="font-medium">Loại:</span>{" "}
                                {document.type.split("/")[1] || document.type}
                            </p>
                            <p>
                                <span className="font-medium">Kích thước:</span>{" "}
                                {formatFileSize(document.size)}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Ngày upload:
                                </span>{" "}
                                {formatDate(document.uploadDate)}
                            </p>
                            <p>
                                <span className="font-medium">URL:</span>{" "}
                                <a
                                    href={document.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline break-all"
                                >
                                    Xem trên Google Drive
                                </a>
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col space-y-3">
                            <a
                                href={document.directUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <FaDownload /> Tải xuống
                            </a>
                            <button
                                onClick={handleDelete}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <FaTrash /> Xóa
                            </button>
                            <button
                                onClick={() => setIsRenaming(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                <FaEdit /> Đổi tên
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isRenaming && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            Đổi tên tài liệu
                        </h3>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên mới"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsRenaming(false)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleRename}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Home>
    );
};

export default DocumentDetail;
