import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { deleteMyAccount, updateUserInfo } from "../../store/slices/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FaUser, FaCamera, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import showToast from "../../utils/toast";

const EditProfileForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, loading: userLoading, error: userError } = useSelector((state) => state.user);

    const initialFormData = useMemo(
        () => ({
            name: userInfo?.name || "",
            avatar: userInfo?.avatar || "",
        }),
        [userInfo]
    );

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({ name: "", avatar: "" });
    const [avatarPreview, setAvatarPreview] = useState(userInfo?.avatar || "");
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State cho modal
    const [deleteLoading, setDeleteLoading] = useState(false); // State cho loading xóa

    useEffect(() => {
        setFormData(initialFormData);
        setAvatarPreview(userInfo?.avatar || "");
        setFormErrors({ name: "", avatar: "" });
    }, [initialFormData, userInfo]);

    const validateForm = () => {
        let isValid = true;
        const errors = { name: "", avatar: "" };

        if (!formData.name.trim()) {
            errors.name = "Tên không được để trống";
            isValid = false;
        }

        if (formData.avatar && !/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)$/i.test(formData.avatar)) {
            errors.avatar = "Avatar phải là URL hình ảnh hợp lệ";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await dispatch(updateUserInfo(formData)).unwrap();
                setIsEditing(false);
                showToast("success", "Cập nhật hồ sơ thành công!");
            } catch (error) {
                console.error("Update failed:", error);
                showToast("error", error.message || "Cập nhật hồ sơ thất bại!");
            }
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setAvatarPreview(userInfo?.avatar || "");
        setFormErrors({ name: "", avatar: "" });
        setIsEditing(false);
    };

    const handleAvatarChange = (e) => {
        const url = e.target.value;
        setFormData({ ...formData, avatar: url });
        setAvatarPreview(url);
        setFormErrors({ ...formErrors, avatar: "" });
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await dispatch(deleteMyAccount()).unwrap();
            showToast("success", "Tài khoản đã được xóa!");
            setShowDeleteModal(false);
            // Clear localStorage và redirect
            localStorage.removeItem("accessToken");
            navigate("/auth/login");
        } catch (error) {
            showToast("error", error.message || "Xóa tài khoản thất bại!");
            console.error("Delete failed:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-10 px-4 overflow-hidden">
            {/* Background Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />

            {/* Animated Circles */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Circle 1 - Bouncy Green */}
                <div
                    className="absolute w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-1"
                    style={{
                        left: "10%",
                        top: "20%",
                        animationDuration: "8s",
                        animationDelay: "0s",
                        zIndex: 0,
                    }}
                />

                {/* Circle 2 - Floating Teal */}
                <div
                    className="absolute w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-2"
                    style={{
                        right: "15%",
                        top: "15%",
                        animationDuration: "7s",
                        animationDelay: "-2s",
                        zIndex: 0,
                    }}
                />

                {/* Circle 3 - Dancing Emerald */}
                <div
                    className="absolute w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-3"
                    style={{
                        left: "30%",
                        bottom: "20%",
                        animationDuration: "6s",
                        animationDelay: "-3s",
                        zIndex: 0,
                    }}
                />

                {/* Circle 4 - Playful Light Green */}
                <div
                    className="absolute w-56 h-56 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-4"
                    style={{
                        right: "25%",
                        bottom: "25%",
                        animationDuration: "5s",
                        animationDelay: "-1s",
                        zIndex: 0,
                    }}
                />
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-2xl"
                style={{ zIndex: 20 }}
            >
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl overflow-hidden border border-white/20">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="relative inline-block"
                            >
                                <img
                                    src={avatarPreview || "/src/assets/default-avatar.png"}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                {isEditing && (
                                    <button
                                        onClick={() =>
                                            document.getElementById("avatar-input").focus()
                                        }
                                        className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                                    >
                                        <FaCamera className="w-4 h-4" />
                                    </button>
                                )}
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-800 mt-4">Hồ sơ của bạn</h2>
                            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                                <span className="px-3 py-1 bg-green-100 rounded-full">
                                    {userInfo?.email}
                                </span>
                                <span className="px-3 py-1 bg-blue-100 rounded-full capitalize">
                                    {userInfo?.role}
                                </span>
                            </div>
                        </div>

                        {userError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                            >
                                <p className="text-red-600 text-center">
                                    {userError.message ||
                                        userError.userError?.join(", ") ||
                                        "Có lỗi xảy ra khi cập nhật"}
                                </p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <FaUser className="w-4 h-4 mr-2" />
                                        Tên hiển thị
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            formErrors.name ? "border-red-500" : "border-gray-300"
                                        } ${
                                            isEditing
                                                ? "bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                : "bg-gray-50"
                                        } transition-all`}
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <FaCamera className="w-4 h-4 mr-2" />
                                        URL Avatar
                                    </label>
                                    <input
                                        id="avatar-input"
                                        type="text"
                                        value={formData.avatar}
                                        onChange={handleAvatarChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            formErrors.avatar ? "border-red-500" : "border-gray-300"
                                        } ${
                                            isEditing
                                                ? "bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                : "bg-gray-50"
                                        } transition-all`}
                                    />
                                    {formErrors.avatar && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formErrors.avatar}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <FaTrash className="w-4 h-4" />
                                    Xóa tài khoản
                                </motion.button>

                                <div className="flex gap-3">
                                    {!isEditing ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                                        >
                                            Chỉnh sửa
                                        </motion.button>
                                    ) : (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="button"
                                                onClick={handleReset}
                                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors flex items-center gap-2"
                                            >
                                                <FaTimes className="w-4 h-4" />
                                                Hủy
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={userLoading}
                                                className={`px-6 py-2 rounded-xl text-white flex items-center gap-2 ${
                                                    userLoading
                                                        ? "bg-green-400 cursor-not-allowed"
                                                        : "bg-green-500 hover:bg-green-600"
                                                } transition-colors`}
                                            >
                                                {userLoading ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin h-4 w-4"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            />
                                                        </svg>
                                                        <span>Đang lưu...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCheck className="w-4 h-4" />
                                                        <span>Lưu thay đổi</span>
                                                    </>
                                                )}
                                            </motion.button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Xác nhận xóa tài khoản
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác và
                                tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                            </p>
                            <div className="flex justify-end gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                                >
                                    Hủy
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDeleteAccount}
                                    disabled={deleteLoading}
                                    className={`px-4 py-2 rounded-xl text-white flex items-center gap-2 ${
                                        deleteLoading
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-red-500 hover:bg-red-600"
                                    } transition-colors`}
                                >
                                    {deleteLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Đang xóa...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaTrash className="w-4 h-4" />
                                            <span>Xóa</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Updated animation styles */}
            <style jsx>{`
                @keyframes bounce-1 {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    25% {
                        transform: translate(150px, 100px) scale(1.2);
                    }
                    50% {
                        transform: translate(50px, -150px) scale(0.8);
                    }
                    75% {
                        transform: translate(-100px, 50px) scale(1.1);
                    }
                }

                @keyframes bounce-2 {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(0.9);
                    }
                    25% {
                        transform: translate(-120px, -80px) scale(1.1);
                    }
                    50% {
                        transform: translate(-60px, 120px) scale(1);
                    }
                    75% {
                        transform: translate(80px, -60px) scale(0.8);
                    }
                }

                @keyframes bounce-3 {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    25% {
                        transform: translate(-80px, -120px) scale(0.9);
                    }
                    50% {
                        transform: translate(100px, 80px) scale(1.2);
                    }
                    75% {
                        transform: translate(60px, -100px) scale(1);
                    }
                }

                @keyframes bounce-4 {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1.1);
                    }
                    25% {
                        transform: translate(100px, -60px) scale(0.9);
                    }
                    50% {
                        transform: translate(-120px, -80px) scale(1.2);
                    }
                    75% {
                        transform: translate(-60px, 100px) scale(1);
                    }
                }

                .animate-bounce-1 {
                    animation: bounce-1 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }

                .animate-bounce-2 {
                    animation: bounce-2 7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }

                .animate-bounce-3 {
                    animation: bounce-3 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }

                .animate-bounce-4 {
                    animation: bounce-4 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default EditProfileForm;
