import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { fetchDocuments, renameDocument, starDocument } from "../redux/slices/documentSlice";
import showToast from "../utils/toast";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import Home from "./Home/Home";
import DocumentInfoCard from "../components/Document/DocumentInfoCard";
import Modal from "../components/Ui/Modal";
import { deleteDocument } from "../redux/slices/trashSlice";

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { documents, loading, error } = useSelector((state) => state.documents);
    const [document, setDocument] = useState(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        const doc = documents.find((doc) => doc._id === id);
        if (doc) {
            setDocument(doc);
            setNewName(doc.name);
        } else {
            dispatch(fetchDocuments());
        }
    }, [id, documents, dispatch]);

    const handleDelete = useCallback(() => {
        if (window.confirm(`Bạn có chắc muốn xóa "${document?.name}" không?`)) {
            dispatch(deleteDocument(id)).then(() => navigate("/documents"));
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

    const handleStar = useCallback(async () => {
        try {
            await dispatch(starDocument(id)).unwrap();
            showToast(
                "success",
                document.starred ? "Bỏ đánh dấu sao thành công" : "Đánh dấu sao thành công"
            );
            setDocument({ ...document, starred: !document.starred });
        } catch (error) {
            showToast("error", error || "Thao tác thất bại");
        }
    }, [dispatch, id, document]);

    const getPreviewUrl = useCallback(() => {
        if (!document) return null;
        return `https://drive.google.com/file/d/${document.driveId}/preview`;
    }, [document]);

    const renderPreview = useCallback(() => {
        if (!document) return null;
        const previewUrl = getPreviewUrl();
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
            />
        );
    }, [document, getPreviewUrl]);

    if (loading || !document) {
        return (
            <Home>
                <LoadingSpinner size="medium" />
            </Home>
        );
    }

    if (error) {
        return (
            <Home>
                <ErrorMessage message={error} />
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
                    <DocumentInfoCard
                        document={document}
                        showActions
                        onPreview={() => navigate(`/documents/${document._id}`)}
                        onRename={() => setIsRenaming(true)}
                        onStar={handleStar}
                        onDelete={handleDelete}
                    />
                </div>
                <Modal
                    isOpen={isRenaming}
                    title="Đổi tên tài liệu"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onSave={handleRename}
                    onCancel={() => setIsRenaming(false)}
                />
            </div>
        </Home>
    );
};

export default DocumentDetail;
