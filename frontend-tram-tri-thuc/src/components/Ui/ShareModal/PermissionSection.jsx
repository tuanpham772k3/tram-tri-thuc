// frontend/src/components/ShareModal/PermissionSection.js
import React, { useCallback, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addPermission, removePermission } from "../../../redux/slices/shareSlice";
import showToast from "../../../utils/toast";
import LoadingSpinner from "../../Common/LoadingSpinner";

const PermissionSection = ({ documentId, sharedUsers, loadingPermission }) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const [email, setEmail] = useState("");
    const [permission, setPermission] = useState("viewer");

    const validateEmail = (email) => {
        const trimmed = email.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254;
    };

    const handleAddPermission = useCallback(() => {
        if (!validateEmail(email)) {
            showToast(
                "error",
                "Vui lòng nhập email hợp lệ (không chứa khoảng trắng, tối đa 254 ký tự)"
            );
            return;
        }
        dispatch(addPermission({ documentId, email: email.trim(), permission })).then(() => {
            setEmail("");
        });
    }, [dispatch, documentId, email, permission]);

    const handleRemovePermission = useCallback(
        (userId) => {
            if (window.confirm("Bạn có chắc muốn xóa quyền của người dùng này?")) {
                dispatch(removePermission({ documentId, userId }));
            }
        },
        [dispatch, documentId]
    );

    return (
        <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Những người có quyền truy cập
            </h3>
            {token && (
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                            <FaUser size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-white">Bạn</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Chủ sở hữu</p>
                        </div>
                    </div>
                    <span className="text-gray-500 dark:text-gray-300">Chủ sở hữu</span>
                </div>
            )}
            {loadingPermission ? (
                <LoadingSpinner size="medium" />
            ) : (
                sharedUsers.map((user) => (
                    <div
                        key={user.userId || user.email}
                        className="flex items-center justify-between py-2 animate-slideIn"
                    >
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                                <FaUser size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {user.email}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.permission === "editor" ? "Người chỉnh sửa" : "Người xem"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemovePermission(user.userId)}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                            disabled={loadingPermission}
                        >
                            Xóa
                        </button>
                    </div>
                ))
            )}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Thêm email người nhận"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-blue-500 rounded-md focus:outline-none dark:bg-gray-700 dark:text-white"
                    disabled={loadingPermission}
                />
                <div className="mt-2 flex items-center gap-2">
                    <select
                        value={permission}
                        onChange={(e) => setPermission(e.target.value)}
                        className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        disabled={loadingPermission}
                    >
                        <option value="viewer">Người xem</option>
                        <option value="editor">Người chỉnh sửa</option>
                    </select>
                    <button
                        onClick={handleAddPermission}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 animate-pulseHover"
                        disabled={loadingPermission}
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PermissionSection;
