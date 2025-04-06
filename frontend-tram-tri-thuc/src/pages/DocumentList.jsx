import { useEffect, useState, useCallback } from "react";
import UploadDropzone from "../components/UploadDropzone/UploadDropzone";
import DocumentCard from "../components/DocumentCard/DocumentCard";
import Home from "./Home/Home";
import { FaDownload, FaList, FaTh, FaTimes } from "react-icons/fa";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments } from "../redux/slices/documentSlice";

ReactModal.setAppElement("#root");

// MIME types hỗ trợ preview
const IMAGE_TYPES = ["image/jpeg", "image/png"];
const DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Trích xuất Google Drive Embed URL
const getGoogleDriveEmbedUrl = (url) => {
    const idMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
    return idMatch
        ? `https://drive.google.com/file/d/${idMatch[1]}/preview`
        : null;
};

const DocumentList = () => {
    const [view, setView] = useState("grid");
    const [previewFile, setPreviewFile] = useState(null);
    const dispatch = useDispatch();
    const { documents, loading } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) dispatch(fetchDocuments());
    }, [token, dispatch]);

    const renderPreview = useCallback((file) => {
        if (!file) return null;
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

        if ([...IMAGE_TYPES, ...DOC_TYPES].includes(file.type)) {
            return (
                <iframe
                    src={embedUrl}
                    width="100%"
                    height="600px"
                    title={file.name}
                    className="border-0 rounded-lg"
                    allowFullScreen
                    loading="lazy"
                />
            );
        }

        return (
            <p className="text-gray-600 px-4 py-2">
                Preview không hỗ trợ cho loại file này.
            </p>
        );
    }, []);

    if (!token) return <Login />;

    return (
        <Home>
            <div className="space-y-6 gradient-bg p-6 rounded-lg">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Tài liệu của tôi
                    </h2>
                    <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
                        {["grid", "list"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setView(type)}
                                className={`p-2 rounded-full transition-colors ${
                                    view === type
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 dark:text-gray-300"
                                }`}
                            >
                                {type === "grid" ? (
                                    <FaTh size={16} />
                                ) : (
                                    <FaList size={16} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <UploadDropzone />

                {/* Danh sách tài liệu */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : documents.length ? (
                    <div
                        className={
                            view === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                                : "space-y-4"
                        }
                    >
                        {documents.map((doc) => (
                            <DocumentCard
                                key={doc._id}
                                document={doc}
                                view={view}
                                onPreview={() => setPreviewFile(doc)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center">
                        <p className="text-gray-600 dark:text-gray-300">
                            Chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên
                            của bạn!
                        </p>
                    </div>
                )}
            </div>

            {/* Modal xem trước tài liệu */}
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
                {previewFile ? (
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
                            {renderPreview(previewFile)}{" "}
                            {/* Hàm renderPreview sẽ kiểm tra và hiển thị đúng */}
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
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        Đang tải...
                    </div>
                )}
            </ReactModal>
        </Home>
    );
};

export default DocumentList;
