import { useEffect, useState } from "react";
import UploadDropzone from "../components/UploadDropzone/UploadDropzone";
import DocumentCard from "../components/DocumentCard/DocumentCard";
import Home from "./Home/Home";
import { FaList, FaTh } from "react-icons/fa";
import Modal from "react-modal";

Modal.setAppElement("#root");

const DocumentList = () => {
    const [view, setView] = useState("grid");
    const [documents, setDocuments] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const token = "your_random_string_!@#$%^&*()_64_chars_long";

    // Lấy danh sách tài liệu khi component mount
    useEffect(() => {
        fetch("http://localhost:5000/api/documents", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch documents");
                return res.json();
            })
            .then((data) => setDocuments(data.documents))
            .catch((err) => console.error("Error fetching documents:", err));
    }, []);

    // Xử lý khi upload file thành công
    const handleUploadSuccess = (newFile) => {
        setDocuments((prev) => [...prev, newFile]);
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
                                onPreview={() => setPreviewFile(doc)} // Truyền hàm preview
                            />
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300">
                            Chưa có tài liệu nào.
                        </p>
                    )}
                </div>
            </div>

            {/* Modal Preview */}
            <Modal
                isOpen={!!previewFile}
                onRequestClose={() => setPreviewFile(null)}
                className="bg-white p-4 rounded-lg max-w-4xl mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                {previewFile && (
                    <div>
                        {/* Chỉ preview PDF và ảnh */}
                        {[
                            "application/pdf",
                            "image/jpeg",
                            "image/png",
                        ].includes(previewFile.type) ? (
                            <iframe
                                src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
                                    previewFile.url
                                )}`}
                                width="100%"
                                height="500px"
                                title={previewFile.name}
                            />
                        ) : (
                            <p className="text-gray-600">
                                Preview không hỗ trợ cho loại file này.
                            </p>
                        )}
                        <button
                            onClick={() => setPreviewFile(null)}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </Modal>
        </Home>
    );
};

export default DocumentList;
