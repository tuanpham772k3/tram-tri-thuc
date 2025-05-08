import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FiChevronLeft,
    FiChevronRight,
    FiRefreshCw,
    FiStar,
    FiClock,
    FiMessageSquare,
    FiFileText,
    FiShare2,
    FiMenu,
    FiSearch,
    FiArrowLeft,
    FiArrowRight,
    FiBold,
    FiItalic,
    FiUnderline,
    FiLink,
    FiImage,
    FiAlignLeft,
    FiAlignCenter,
    FiAlignRight,
    FiList,
    FiHelpCircle,
    FiDownload,
} from "react-icons/fi";
import {
    accessSharedDocument,
    editDocument,
    fetchSharedDocument,
    openShareModal,
} from "../redux/slices/shareSlice";
import showToast from "../utils/toast";
import { fetchDocuments, renameDocument, starDocument } from "../redux/slices/documentSlice";
import { deleteDocument } from "../redux/slices/trashSlice";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Modal from "../components/Ui/Modal";

const DocumentDetailPage = () => {
    const { id, linkId, secretKey } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const {
        documents,
        loading: docLoading,
        error: docError,
    } = useSelector((state) => state.documents);
    const {
        sharedDocuments,
        loading: shareLoading,
        error: shareError,
    } = useSelector((state) => state.share);
    const { user, token } = useSelector((state) => state.auth);

    const [doc, setDoc] = useState(null);
    const [permission, setPermission] = useState("viewer");
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Thêm state để quản lý LoadingSpinner

    const isSharedLink = location.pathname.includes("/share");
    const isSharedWithMe = location.pathname.includes("/shared");
    const isOwnedDocument = location.pathname.includes("/documents");

    useEffect(() => {
        setIsLoading(true); // Bắt đầu với trạng thái loading
        if (isSharedLink && linkId && secretKey) {
            dispatch(accessSharedDocument({ linkId, secretKey }))
                .unwrap()
                .then((result) => {
                    setDoc(result.document);
                    setPermission(result.permission);
                    setNewName(result.document.name);
                    setIsLoading(false);
                })
                .catch((error) => {
                    showToast(
                        "error",
                        error.message || "Không thể truy cập tài liệu chia sẻ qua link"
                    );
                    setIsLoading(false);
                });
        } else if (isSharedWithMe && id) {
            dispatch(fetchSharedDocument(id))
                .unwrap()
                .then((result) => {
                    setDoc(result.document);
                    setPermission(result.permission);
                    setNewName(result.document.name);
                    setIsLoading(false);
                })
                .catch((error) => {
                    showToast(
                        "error",
                        error.message || "Không thể truy cập tài liệu được chia sẻ qua email"
                    );
                    setIsLoading(false);
                });
        } else if (isOwnedDocument && id) {
            const foundDoc = documents.find((d) => d._id === id);
            if (foundDoc) {
                setDoc(foundDoc);
                setPermission("owner");
                setNewName(foundDoc.name);
                setIsLoading(false);
            } else {
                dispatch(fetchDocuments({ parentId: null }))
                    .unwrap()
                    .then((docs) => {
                        const foundDoc = docs.find((d) => d._id === id);
                        if (foundDoc) {
                            setDoc(foundDoc);
                            setPermission("owner");
                            setNewName(foundDoc.name);
                        } else {
                            showToast("error", "Tài liệu không tìm thấy");
                        }
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        showToast("error", error.message || "Không thể tải tài liệu được tải lên");
                        setIsLoading(false);
                    });
            }
        }
    }, [dispatch, id, linkId, secretKey, documents, isSharedLink, isSharedWithMe, isOwnedDocument]);

    useEffect(() => {
        if (isSharedLink && doc?.expiryDate && new Date() > new Date(doc.expiryDate)) {
            showToast(
                "error",
                `Link chia sẻ đã hết hạn vào ${new Date(doc.expiryDate).toLocaleDateString()}`
            );
            setDoc(null);
            setIsLoading(false);
        }
    }, [doc, isSharedLink]);

    const handleDelete = useCallback(() => {
        if (!doc) return;
        if (window.confirm(`Bạn có chắc muốn xóa "${doc.name}" không?`)) {
            dispatch(deleteDocument(id))
                .unwrap()
                .then(() => {
                    showToast("success", "Đã chuyển vào thùng rác");
                    navigate("/documents");
                })
                .catch((error) => {
                    showToast("error", error.message || "Không thể xóa tài liệu");
                });
        }
    }, [dispatch, id, doc, navigate]);

    const handleRename = useCallback(() => {
        if (!doc) return;
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
        if (trimmedName !== doc.name) {
            dispatch(renameDocument({ id: doc._id, name: trimmedName }))
                .unwrap()
                .then(() => {
                    setDoc({ ...doc, name: trimmedName });
                    setIsRenaming(false);
                    showToast("success", "Đổi tên tài liệu thành công");
                })
                .catch((error) => {
                    showToast("error", error.message || "Không thể đổi tên tài liệu");
                });
        } else {
            setIsRenaming(false);
        }
    }, [dispatch, doc, newName]);

    const handleStar = useCallback(() => {
        if (!doc) return;
        dispatch(starDocument(doc._id))
            .unwrap()
            .then(() => {
                setDoc({ ...doc, starred: !doc.starred });
                showToast(
                    "success",
                    doc.starred ? "Bỏ đánh dấu sao thành công" : "Đánh dấu sao thành công"
                );
            })
            .catch((error) => {
                showToast("error", error.message || "Không thể đánh dấu sao");
            });
    }, [dispatch, doc]);

    const handleShare = useCallback(() => {
        if (!doc) return;
        dispatch(openShareModal({ documentId: doc._id }));
    }, [dispatch, doc]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ];
            if (!allowedTypes.includes(file.type)) {
                showToast("error", "Định dạng file không hỗ trợ");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showToast("error", "Kích thước file vượt quá 10MB");
                return;
            }
            setSelectedFile(file);
        }
    }, []);

    const handleEdit = useCallback(() => {
        if (!doc || !selectedFile) {
            showToast("error", "Vui lòng chọn file để chỉnh sửa");
            return;
        }
        dispatch(editDocument({ documentId: doc._id, file: selectedFile }))
            .unwrap()
            .then((result) => {
                setDoc(result.document);
                setPermission(result.permission);
                setIsEditing(false);
                setSelectedFile(null);
                showToast("success", "Tài liệu đã được chỉnh sửa thành công");
            })
            .catch((error) => {
                showToast("error", error.message || "Không thể chỉnh sửa tài liệu");
            });
    }, [dispatch, doc, selectedFile]);

    const renderDocument = useCallback(() => {
        if (!doc) {
            return (
                <ErrorMessage message="Không tìm thấy tài liệu hoặc bạn không có quyền truy cập" />
            );
        }

        const handleLoad = () => {
            setIsLoading(false); // Dừng loading khi tài liệu tải xong
        };

        const renderIframe = (url, title) => (
            <div className="relative">
                {isLoading && (
                    <LoadingSpinner
                        size="medium"
                        className="animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                )}
                <iframe
                    src={url}
                    className="w-full h-[80vh] border rounded-lg"
                    title={title}
                    loading="lazy"
                    onLoad={handleLoad}
                />
            </div>
        );

        if (doc.mimeType === "application/pdf") {
            return renderIframe(doc.previewUrl || doc.directUrl, doc.name);
        } else if (doc.mimeType.includes("image")) {
            return (
                <div className="relative">
                    {isLoading && (
                        <LoadingSpinner
                            size="medium"
                            className="animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        />
                    )}
                    <img
                        src={doc.directUrl}
                        alt={doc.name}
                        className="max-w-full h-auto rounded-lg"
                        loading="lazy"
                        onLoad={handleLoad}
                    />
                </div>
            );
        } else if (
            doc.mimeType.includes("application/vnd.openxmlformats-officedocument") ||
            doc.mimeType.includes("application/msword") ||
            doc.mimeType.includes("application/vnd.ms-excel")
        ) {
            if (doc.previewUrl) {
                return renderIframe(doc.previewUrl, doc.name);
            }
            return (
                <div className="relative">
                    {isLoading && (
                        <LoadingSpinner
                            size="medium"
                            className="animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        />
                    )}
                    <ErrorMessage message="Không thể xem trước tài liệu này." />
                </div>
            );
        } else {
            return (
                <div className="relative">
                    {isLoading && (
                        <LoadingSpinner
                            size="medium"
                            className="animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        />
                    )}
                    <ErrorMessage
                        message={`Không hỗ trợ xem trước loại tệp này (${doc.mimeType}).`}
                    />
                </div>
            );
        }
    }, [doc, isLoading]);

    const loading = docLoading || shareLoading;
    const error = docError || shareError;

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-gray-50">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    if (error || !doc) {
        return (
            <div className="flex flex-col h-screen bg-gray-50">
                <ErrorMessage
                    message={
                        error?.message ||
                        error ||
                        "Không tìm thấy tài liệu hoặc bạn không có quyền truy cập"
                    }
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gray-900 text-white px-4 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => navigate(isSharedWithMe ? "/shared" : "/documents")}
                        className="p-1 hover:bg-gray-700 rounded"
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <FiChevronRight className="w-5 h-5 opacity-50" />
                    <FiRefreshCw className="w-5 h-5 cursor-pointer hover:bg-gray-700 rounded p-1" />
                </div>
                <div className="ml-2 text-gray-200 text-sm truncate">
                    {`${window.location.origin}${location.pathname}`}
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center gap-3">
                    <button onClick={handleStar} className="p-1 hover:bg-gray-700 rounded">
                        <FiStar
                            className={`w-5 h-5 ${doc.starred ? "text-yellow-400 fill-current" : ""}`}
                        />
                    </button>
                    <FiClock className="w-5 h-5" />
                    <FiMessageSquare className="w-5 h-5" />
                    <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                </div>
            </header>

            {/* Document Header */}
            <div className="bg-white border-b px-4 py-3 flex flex-col gap-2">
                <div className="flex items-center">
                    <FiFileText className="w-5 h-5 text-blue-600 mr-2" />
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => permission !== "viewer" && setNewName(e.target.value)}
                        onBlur={handleRename}
                        readOnly={permission === "viewer"}
                        className={`text-lg font-medium focus:outline-none focus:border-b-2 focus:border-blue-500 ${permission === "viewer" ? "bg-white cursor-default" : ""}`}
                    />
                    <div className="flex-grow"></div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
                        >
                            <FiShare2 className="w-4 h-4" /> Chia Sẻ
                        </button>
                        <div className="relative group">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <FiMenu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu tabs */}
                <div className="flex gap-6 text-sm">
                    <button className="border-b-2 border-blue-500 text-blue-600 font-medium px-1 py-1">
                        Tệp
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 px-1 py-1">
                        Chỉnh sửa
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 px-1 py-1">Xem</button>
                    <button className="text-gray-600 hover:text-gray-900 px-1 py-1">Chèn</button>
                    <button className="text-gray-600 hover:text-gray-900 px-1 py-1">
                        Định dạng
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 px-1 py-1">Công cụ</button>
                    <button className="text-gray-600 hover:text-gray-900 px-1 py-1">
                        Trợ giúp
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white border-b px-4 py-1 flex items-center gap-2">
                <div className="flex items-center gap-2 text-gray-700">
                    <FiSearch className="w-4 h-4" />
                    <FiArrowLeft
                        className={`w-4 h-4 ${permission === "viewer" ? "text-gray-400" : "cursor-pointer"}`}
                    />
                    <FiArrowRight
                        className={`w-4 h-4 ${permission === "viewer" ? "text-gray-400" : "cursor-pointer"}`}
                    />
                    {permission !== "viewer" && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-2 py-1 hover:bg-gray-100 rounded text-sm"
                            >
                                Thay thế file
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-2 py-1 hover:bg-gray-100 rounded text-sm text-red-600"
                            >
                                Xóa
                            </button>
                            <FiBold className="w-4 h-4 cursor-pointer" />
                            <FiItalic className="w-4 h-4 cursor-pointer" />
                            <FiUnderline className="w-4 h-4 cursor-pointer" />
                            <FiLink className="w-4 h-4 cursor-pointer" />
                            <FiImage className="w-4 h-4 cursor-pointer" />
                            <div className="flex border rounded">
                                <button className="px-2 py-1 hover:bg-gray-100">
                                    <FiAlignLeft className="w-4 h-4" />
                                </button>
                                <button className="px-2 py-1 hover:bg-gray-100 border-l border-r">
                                    <FiAlignCenter className="w-4 h-4" />
                                </button>
                                <button className="px-2 py-1 hover:bg-gray-100">
                                    <FiAlignRight className="w-4 h-4" />
                                </button>
                            </div>
                            <FiList className="w-4 h-4 cursor-pointer" />
                        </>
                    )}
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center gap-2">
                    <a
                        href={doc.directUrl}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FiDownload className="w-4 h-4" /> Tải xuống
                    </a>
                    <button className="p-1 hover:bg-gray-100 rounded">
                        <FiHelpCircle className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Document Content */}
            <div className="flex-grow overflow-auto">
                <div className="max-w-4xl mx-auto bg-white shadow-sm my-6 p-8 min-h-full">
                    {renderDocument()}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t px-4 py-1 flex justify-between text-xs text-gray-600">
                <div>Đã lưu vào Drive</div>
                <div className="flex items-center gap-4">
                    <span>Chế độ xem</span>
                    <span>Trang 1 / 1</span>
                </div>
            </footer>

            {/* Modals */}
            <Modal
                isOpen={isRenaming}
                title="Đổi tên tài liệu"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onSave={handleRename}
                onCancel={() => setIsRenaming(false)}
                loading={loading}
            />
            <Modal
                isOpen={isEditing}
                title="Chỉnh sửa tài liệu"
                onSave={handleEdit}
                onCancel={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                }}
                loading={loading}
            >
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
            </Modal>
        </div>
    );
};

export default DocumentDetailPage;
