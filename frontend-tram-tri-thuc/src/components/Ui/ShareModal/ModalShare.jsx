// frontend/src/components/ShareModal/ModalShare.js
import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaInfoCircle, FaCog } from "react-icons/fa";
import ShareLinkSection from "./ShareLinkSection";
import PermissionSection from "./PermissionSection";
import { closeShareModal, getPermissions, getShareLink } from "../../../redux/slices/shareSlice";
import LoadingSpinner from "../../Common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";

const ModalShare = () => {
    const dispatch = useDispatch();
    const {
        shareLink,
        sharedUsers,
        loadingLink,
        loadingPermission,
        error,
        isShareModalOpen,
        currentDocumentId,
    } = useSelector((state) => state.share);
    const { documents } = useSelector((state) => state.documents);
    const document = documents.find((doc) => doc._id === currentDocumentId);
    const [activeTab, setActiveTab] = useState("link");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "link" && !shareLink) {
            dispatch(getShareLink(currentDocumentId));
        } else if (tab === "permission" && !sharedUsers.length) {
            dispatch(getPermissions(currentDocumentId));
        }
    };

    if (!isShareModalOpen || !document) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-xl font-medium text-gray-800 dark:text-white">
                        Chia sẻ "{document.name}"
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            title="Thông tin"
                        >
                            <FaInfoCircle size={20} />
                        </button>
                        <button
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            title="Cài đặt"
                        >
                            <FaCog size={20} />
                        </button>
                    </div>
                </div>
                <div className="px-6 pb-4">
                    <div className="flex border-b mb-4">
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "link"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600"
                            }`}
                            onClick={() => handleTabChange("link")}
                        >
                            Chia sẻ qua link
                        </button>
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "permission"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600"
                            }`}
                            onClick={() => handleTabChange("permission")}
                        >
                            Chia sẻ với người dùng
                        </button>
                    </div>
                    {error && <ErrorMessage message={error} />}
                    {(loadingLink || loadingPermission) && <LoadingSpinner />}
                    {!loadingLink && !loadingPermission && (
                        <div className="max-h-[60vh] overflow-y-auto">
                            {activeTab === "link" && (
                                <ShareLinkSection
                                    documentId={currentDocumentId}
                                    shareLink={shareLink}
                                    loading={loadingLink}
                                />
                            )}
                            {activeTab === "permission" && (
                                <PermissionSection
                                    documentId={currentDocumentId}
                                    sharedUsers={sharedUsers}
                                    loading={loadingPermission}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 flex justify-end">
                    <button
                        onClick={() => dispatch(closeShareModal())}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 animate-pulseHover"
                        disabled={loadingLink || loadingPermission}
                    >
                        Xong
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalShare;
