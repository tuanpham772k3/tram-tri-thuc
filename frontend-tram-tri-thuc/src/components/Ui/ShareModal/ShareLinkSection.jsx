// frontend/src/components/ShareModal/ShareLinkSection.js
import React, { useCallback, useState } from "react";
import { FaLink } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createShareLink, deleteShareLink } from "../../../redux/slices/shareSlice";
import showToast from "../../../utils/toast";
import LoadingSpinner from "../../Common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";

const ShareLinkSection = ({ documentId, shareLink, loadingLink }) => {
    const dispatch = useDispatch();
    const [linkPermission, setLinkPermission] = useState("viewer");
    const [expiresInDays, setExpiresInDays] = useState(7);
    const [isCopied, setIsCopied] = useState(false);

    const handleCreateShareLink = useCallback(() => {
        dispatch(createShareLink({ documentId, permission: linkPermission, expiresInDays }));
    }, [dispatch, documentId, linkPermission, expiresInDays]);

    const handleDeleteShareLink = useCallback(() => {
        dispatch(deleteShareLink(documentId));
    }, [dispatch, documentId]);

    const handleCopyLink = useCallback(() => {
        if (!shareLink?.link) {
            showToast("error", "Vui lòng tạo link trước khi sao chép!");
            return;
        }
        navigator.clipboard.writeText(shareLink.link);
        setIsCopied(true);
        showToast("success", "Đã sao chép liên kết!");
        setTimeout(() => setIsCopied(false), 2000);
    }, [shareLink]);

    return (
        <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Quyền truy cập chung
            </h3>
            {loadingLink ? (
                <LoadingSpinner size="medium" />
            ) : !shareLink ? (
                <div className="animate-fadeIn">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Chưa có link chia sẻ. Tạo link để chia sẻ tài liệu!
                    </p>
                    <select
                        value={linkPermission}
                        onChange={(e) => setLinkPermission(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white mb-2"
                        disabled={loadingLink}
                    >
                        <option value="viewer">Người xem</option>
                        <option value="editor">Người chỉnh sửa</option>
                    </select>
                    <input
                        type="number"
                        value={expiresInDays}
                        onChange={(e) => setExpiresInDays(Number(e.target.value))}
                        placeholder="Số ngày hết hạn"
                        min="1"
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white mb-2"
                        disabled={loadingLink}
                    />
                    <button
                        onClick={handleCreateShareLink}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 animate-pulseHover"
                        disabled={loadingLink || expiresInDays < 1}
                    >
                        Tạo link
                    </button>
                </div>
            ) : (
                <div className="animate-slideIn">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <FaLink size={20} className="text-green-800" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    Bất kỳ ai có đường liên kết
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Có thể {shareLink.permission === "editor" ? "chỉnh sửa" : "xem"}
                                    {shareLink.expiryDate &&
                                        ` (Hết hạn: ${new Date(
                                            shareLink.expiryDate
                                        ).toLocaleDateString()})`}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDeleteShareLink}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                            disabled={loadingLink}
                        >
                            Tắt
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            value={shareLink.link}
                            readOnly
                            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white transition-all ${
                                isCopied ? "border-green-500" : "border-gray-300"
                            }`}
                        />
                        <button
                            onClick={handleCopyLink}
                            className={`px-4 py-2 rounded-md text-white transition-all ${
                                isCopied ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
                            } disabled:opacity-50 animate-pulseHover`}
                            disabled={loadingLink || !shareLink}
                        >
                            {isCopied ? "Đã copy!" : "Copy"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareLinkSection;
