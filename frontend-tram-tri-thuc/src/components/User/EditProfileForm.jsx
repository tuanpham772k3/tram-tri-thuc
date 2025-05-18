import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { clearUpdateSuccess, updateUserInfo } from "../../store/slices/authSlice";

const EditProfileForm = () => {
    const dispatch = useDispatch();
    const { user, loading, error, updateSuccess } = useSelector((state) => state.auth);
    const initialFormData = useMemo(
        () => ({
            name: user?.name || "",
            avatar: user?.avatar || "",
        }),
        [user]
    );
    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({ name: "", avatar: "" });
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

    // Reset updateSuccess sau khi hiển thị
    useEffect(() => {
        if (updateSuccess) {
            dispatch(clearUpdateSuccess());
        }
    }, [updateSuccess, dispatch]);

    // Reset form khi user thay đổi
    useEffect(() => {
        setFormData(initialFormData);
        setAvatarPreview(user?.avatar || "");
        setFormErrors({ name: "", avatar: "" });
    }, [initialFormData, user]);

    const validateForm = () => {
        let isValid = true;
        const errors = { name: "", avatar: "" };

        if (!formData.name.trim()) {
            errors.name = "Tên không được để trống";
            isValid = false;
        }

        if (formData.avatar && !/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)$/.test(formData.avatar)) {
            errors.avatar = "Avatar phải là URL hình ảnh hợp lệ (png, jpg, jpeg, gif, webp)";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            await dispatch(updateUserInfo(formData));
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setAvatarPreview(user?.avatar || "");
        setFormErrors({ name: "", avatar: "" });
    };

    const handleAvatarChange = (e) => {
        const url = e.target.value;
        setFormData({ ...formData, avatar: url });
        setAvatarPreview(url);
        setFormErrors({ ...formErrors, avatar: "" });
    };

    return (
        <div className="max-w-lg mx-auto">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Thông tin người dùng</h3>
                <div className="flex items-center gap-4">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Avatar</span>
                        </div>
                    )}
                    <div>
                        <p className="text-gray-700">
                            <strong>Email:</strong> {user?.email || "N/A"}
                        </p>
                        <p className="text-gray-700">
                            <strong>Vai trò:</strong> {user?.role || "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Tên
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`mt-1 block w-full p-2 border rounded-md ${
                            formErrors.name ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        aria-label="Tên người dùng"
                    />
                    {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                        Avatar (URL)
                    </label>
                    <input
                        id="avatar"
                        type="text"
                        value={formData.avatar}
                        onChange={handleAvatarChange}
                        className={`mt-1 block w-full p-2 border rounded-md ${
                            formErrors.avatar ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        aria-label="URL avatar"
                    />
                    {formErrors.avatar && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.avatar}</p>
                    )}
                    {avatarPreview && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">Preview:</p>
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="w-24 h-24 rounded-md object-cover"
                                onError={() => setAvatarPreview("")}
                            />
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-red-500 text-sm">
                        {error.message || error.errors?.join(", ") || "Lỗi không xác định"}
                    </p>
                )}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-white ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } transition-colors`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                </svg>
                                Đang cập nhật...
                            </span>
                        ) : (
                            "Cập nhật"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileForm;
