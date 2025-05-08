// frontend/src/components/SharedDocumentViewer.js
import React, { useEffect } from "react";
import { accessSharedDocument } from "../../redux/slices/shareSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import showToast from "../../utils/toast";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ErrorMessage from "../../components/Common/ErrorMessage";

const SharedDocumentViewer = () => {
    const { linkId, secretKey } = useParams();
    const dispatch = useDispatch();
    const { sharedDocuments, loadingLink, error } = useSelector((state) => state.share);
    const sharedDocument = sharedDocuments[linkId]; // Lấy theo linkId

    useEffect(() => {
        if (linkId && secretKey) {
            dispatch(accessSharedDocument({ linkId, secretKey }));
        } else {
            showToast("error", "Link không hợp lệ");
        }
    }, [dispatch, linkId, secretKey]);

    if (loadingLink) return <LoadingSpinner size="large" />;

    if (error) {
        return <ErrorMessage message={error.message} />;
    }

    if (!sharedDocument) {
        return <ErrorMessage message="Không tìm thấy tài liệu." />;
    }

    const { document, permission } = sharedDocument;

    if (
        sharedDocument.document.expiryDate &&
        new Date() > new Date(sharedDocument.document.expiryDate)
    ) {
        return (
            <ErrorMessage
                message={`Link chia sẻ đã hết hạn vào ${new Date(
                    sharedDocument.document.expiryDate
                ).toLocaleDateString()}.`}
            />
        );
    }

    const renderDocument = () => {
        if (!document.directUrl) {
            return <ErrorMessage message="Lỗi: Không có đường dẫn tải xuống cho tài liệu này." />;
        }
        const renderIframe = (url, title) => (
            <div className="relative">
                <LoadingSpinner size="medium" /> {/* Hiển thị khi iframe tải */}
                <iframe
                    src={url}
                    className="w-full h-[80vh] border rounded-lg"
                    title={title}
                    onLoad={() => document.querySelector(".animate-spin")?.remove()} // Ẩn spinner khi tải xong
                />
                <div className="text-center mt-4">
                    <a
                        href={document.directUrl}
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tải xuống
                    </a>
                </div>
            </div>
        );

        if (document.mimeType === "application/pdf") {
            return renderIframe(document.previewUrl || document.directUrl, document.name);
        } else if (document.mimeType.includes("image")) {
            return (
                <div className="text-center">
                    <img
                        src={document.directUrl}
                        alt={document.name}
                        className="max-w-full h-auto rounded-lg"
                    />
                    <a
                        href={document.directUrl}
                        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tải xuống
                    </a>
                </div>
            );
        } else if (
            document.mimeType.includes("application/vnd.openxmlformats-officedocument") ||
            document.mimeType.includes("application/msword") ||
            document.mimeType.includes("application/vnd.ms-excel")
        ) {
            if (document.previewUrl) {
                return renderIframe(document.previewUrl, document.name);
            }
            return (
                <div className="text-center">
                    <ErrorMessage message="Không thể xem trước tài liệu này." />
                    <a
                        href={document.directUrl}
                        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tải xuống
                    </a>
                </div>
            );
        } else {
            return (
                <div className="text-center">
                    <ErrorMessage
                        message={`Không hỗ trợ xem trước loại tệp này (${document.mimeType}).`}
                    />
                    <a
                        href={document.directUrl}
                        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tải xuống
                    </a>
                </div>
            );
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {document.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Quyền truy cập: {permission === "viewer" ? "Chỉ xem" : "Chỉnh sửa"}
            </p>
            {renderDocument()}
            {permission === "viewer" && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
                    Bạn chỉ có quyền xem tài liệu này.
                </p>
            )}
        </div>
    );
};

export default SharedDocumentViewer;
