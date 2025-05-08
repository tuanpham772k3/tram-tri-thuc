import React, { useEffect, useState, useCallback } from "react";
import { FaFolderPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    createFolder,
    fetchDocuments,
    moveDocument,
    clearError,
} from "../redux/slices/documentSlice";
import Home from "./Home/Home";
import showToast from "../utils/toast";
import PageHeader from "../components/Layout/Header/PageHeader";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import DocumentListView from "../components/Document/DocumentListView";
import Modal from "../components/Ui/Modal";
import UploadDropzone from "../components/Document/UploadDropzone";

const DocumentList = () => {
    const [view, setView] = useState("list");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");

    const dispatch = useDispatch();
    const { documents, loading, error } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const parentId =
        searchParams.get("parentId") === "null" ? "root" : searchParams.get("parentId") || "root";

    useEffect(() => {
        if (token && parentId) {
            if (parentId !== "root" && !/^[0-9a-fA-F]{24}$/.test(parentId)) {
                showToast("error", "parentId không hợp lệ");
                navigate("/documents");
                return;
            }
            dispatch(fetchDocuments({ parentId: parentId === "root" ? null : parentId }))
                .unwrap()
                .catch((error) => {
                    showToast("error", error);
                    if (error.includes("Session expired")) {
                        navigate("/login");
                    }
                });
            dispatch(clearError());
        }
    }, [token, dispatch, parentId, navigate]);

    const handleSort = useCallback(
        (column) => {
            if (sortBy === column) {
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
            } else {
                setSortBy(column);
                setSortDirection("asc");
            }
        },
        [sortBy, sortDirection]
    );

    const handleDrop = useCallback(
        async (e, targetFolderId) => {
            const draggedId = e.dataTransfer.getData("documentId");
            try {
                await dispatch(
                    moveDocument({ id: draggedId, newParentId: targetFolderId })
                ).unwrap();
                showToast("success", "Di chuyển tài liệu thành công");
                dispatch(fetchDocuments({ parentId: parentId === "root" ? null : parentId }));
            } catch (error) {
                showToast("error", error || "Di chuyển tài liệu thất bại");
            }
        },
        [dispatch, parentId]
    );

    const handleCreateFolder = useCallback(async () => {
        const trimmedName = folderName.trim();
        if (!trimmedName) {
            showToast("error", "Tên thư mục không được để trống");
            return;
        }
        if (trimmedName.length > 255) {
            showToast("error", "Tên thư mục không được vượt quá 255 ký tự");
            return;
        }
        try {
            await dispatch(
                createFolder({ name: trimmedName, parentId: parentId === "root" ? null : parentId })
            ).unwrap();
            setFolderName("");
            setIsModalOpen(false);
            showToast("success", "Tạo thư mục thành công");
        } catch (error) {
            showToast("error", error || "Tạo thư mục thất bại");
        }
    }, [dispatch, folderName, parentId]);

    return (
        <Home>
            <div className="max-w-6xl mx-auto p-6 gradient-bg rounded-lg shadow">
                <PageHeader title="Trạm của tôi" view={view} onViewChange={setView} />
                <div className="mb-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition disabled:bg-blue-400"
                        disabled={loading}
                    >
                        <FaFolderPlus className="mr-2" /> Tạo thư mục
                    </button>
                </div>
                <UploadDropzone parentId={parentId} />
                {loading ? (
                    <LoadingSpinner size="medium" />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : documents.length ? (
                    <DocumentListView
                        documents={documents}
                        view={view}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onDrop={handleDrop}
                        navigate={navigate}
                    />
                ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center mt-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            Chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên của bạn!
                        </p>
                    </div>
                )}
                <Modal
                    isOpen={isModalOpen}
                    title="Tạo thư mục mới"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onSave={handleCreateFolder}
                    onCancel={() => setIsModalOpen(false)}
                    loading={loading}
                />
            </div>
        </Home>
    );
};

export default DocumentList;
