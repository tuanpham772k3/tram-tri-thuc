import { useEffect, useState } from "react";
import UploadDropzone from "../components/UploadDropzone/UploadDropzone";
import DocumentCard from "../components/DocumentCard/DocumentCard";
import Home from "./Home/Home";
import { FaDownload, FaList, FaTh, FaTimes } from "react-icons/fa";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const DocumentList = () => {
    const [view, setView] = useState("grid");
    const [documents, setDocuments] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    // Hàm fetch danh sách tài liệu
    const fetchDocuments = async () => {
        if (!token) return;
        try {
            const res = await fetch("http://localhost:5000/api/documents", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch documents");
            const data = await res.json();
            setDocuments(data.documents);
        } catch (err) {
            console.error("Error fetching documents:", err);
        }
    };

    // Gọi fetch khi mount và sau khi upload
    useEffect(() => {
        fetchDocuments();
    }, [token]);

    const handleUploadSuccess = () => {
        // Không thêm file trực tiếp, mà fetch lại danh sách từ backend
        fetchDocuments();
    };

    if (!token) {
        return <Login onLogin={(newToken) => setToken(newToken)} />;
    }

    // Hàm tạo Google Drive Preview URL từ fileId
    const getGoogleDriveEmbedUrl = (url) => {
        // Trích xuất ID từ URL Google Drive
        const regex = /\/d\/([a-zA-Z0-9_-]+)/;
        const match = url.match(regex);
        if (match && match[1]) {
            return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
        return null;
    };

    // Hàm xác định cách preview dựa trên loại file
    const renderPreview = (file) => {
        if (!file) return null;

        const type = file.type;

        // Tạo URL embed từ Google Drive URL
        const embedUrl = getGoogleDriveEmbedUrl(file.url);
        if (!embedUrl) {
            return (
                <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-500 text-center">
                        Không thể tạo URL xem trước!
                        <br />
                        Vui lòng kiểm tra lại file.
                    </p>
                </div>
            );
        }

        if (["image/jpeg", "image/png"].includes(type)) {
            // Đối với ảnh, sử dụng URL Google Drive cho preview
            return (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner">
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="600px"
                        title={file.name}
                        className="border-0"
                        allowFullScreen
                        loading="lazy"
                    />
                </div>
            );
        } else if (
            [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ].includes(type)
        ) {
            // Sử dụng Google Drive Viewer cho tài liệu
            return (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner">
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="600px"
                        title={file.name}
                        className="border-0"
                        allowFullScreen
                        loading="lazy"
                    />
                </div>
            );
        } else {
            return (
                <p className="text-gray-600">
                    Preview không hỗ trợ cho loại file này.
                </p>
            );
        }
    };

    return (
        <Home>
            <div className="space-y-6 gradient-bg p-6 rounded-lg">
                {/* Header với toggle view */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Tài liệu của tôi
                    </h2>
                    <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
                        <button
                            onClick={() => setView("grid")}
                            className={`p-2 rounded-full ${view === "grid" ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300"} transition-colors`}
                        >
                            <FaTh size={16} />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`p-2 rounded-full ${view === "list" ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300"} transition-colors`}
                        >
                            <FaList size={16} />
                        </button>
                    </div>
                </div>
                {/* Upload Dropzone */}
                <UploadDropzone
                    onUploadSuccess={handleUploadSuccess}
                    token={token}
                />
                {/* Danh sách tài liệu */}
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div
                        className={
                            view === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                                : "space-y-4"
                        }
                    >
                        {documents.length > 0 ? (
                            documents.map((doc) => (
                                <DocumentCard
                                    key={doc._id}
                                    document={doc}
                                    view={view}
                                    onPreview={() => setPreviewFile(doc)}
                                />
                            ))
                        ) : (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center">
                                <p className="text-gray-600 dark:text-gray-300">
                                    Chưa có tài liệu nào. Hãy tải lên tài liệu
                                    đầu tiên của bạn!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Preview */}
            <ReactModal
                isOpen={!!previewFile}
                onRequestClose={() => setPreviewFile(null)}
                className="preview-modal bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl mx-auto mt-12 overflow-hidden"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center p-4 backdrop-blur-sm z-50"
                style={{
                    content: {
                        border: "none",
                        padding: 0,
                        maxHeight: "90vh",
                        width: "95%",
                    },
                }}
            >
                {previewFile && (
                    <div className="flex flex-col h-full">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white truncate pr-4">
                                {previewFile.name}
                            </h3>
                            <div className="flex space-x-2">
                                <a
                                    href={previewFile.directUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                                    title="Tải xuống"
                                >
                                    <FaDownload size={16} />
                                </a>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                    title="Đóng"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-grow overflow-auto">
                            {renderPreview(previewFile)}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3 border-t dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(
                                    previewFile.uploadDate
                                ).toLocaleDateString()}{" "}
                                • {(previewFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                            </div>
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </ReactModal>

            {/* CSS tùy chỉnh cho modal và preview */}
            <style jsx global>{`
                .preview-modal {
                    display: flex;
                    flex-direction: column;
                }

                @media (max-width: 640px) {
                    .preview-modal {
                        margin-top: 0;
                        max-height: 100vh;
                        height: 100%;
                        width: 100% !important;
                        border-radius: 0;
                    }
                }

                /* Animate modal */
                .ReactModal__Overlay {
                    opacity: 0;
                    transition: opacity 200ms ease-in-out;
                }

                .ReactModal__Overlay--after-open {
                    opacity: 1;
                }

                .ReactModal__Overlay--before-close {
                    opacity: 0;
                }
            `}</style>
        </Home>
    );
};

export default DocumentList;
