import { useEffect, useState, useCallback } from "react";
import UploadDropzone from "../components/UploadDropzone/UploadDropzone";
import DocumentCard from "../components/DocumentCard/DocumentCard";
import Home from "./Home/Home";
import { FaDownload, FaList, FaTh, FaTimes } from "react-icons/fa";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments } from "../redux/slices/documentSlice";
import { Navigate, useNavigate } from "react-router-dom";

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

const DocumentList = () => {
    const [view, setView] = useState("grid");
    // const [previewFile, setPreviewFile] = useState(null);
    const dispatch = useDispatch();
    const { documents, loading } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);
    const Navigate = useNavigate();

    useEffect(() => {
        if (token) dispatch(fetchDocuments());
    }, [token, dispatch]);

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
                                onPreview={() =>
                                    Navigate(`/documents/${doc._id}`)
                                }
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
        </Home>
    );
};

export default DocumentList;
