import { Link, useNavigate } from "react-router-dom";
import { Bell, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../../../utils/toast";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { logoutThunk } from "../../../store/slices/authSlice";
import { fetchUserInfo, resetUserState } from "../../../store/slices/userSlice";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
    const { userInfo, loading: userLoading, error: userError } = useSelector((state) => state.user);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

    // Lấy thông tin người dùng khi đã đăng nhập
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUserInfo());
        }
    }, [dispatch, isAuthenticated]);

    // Xử lý lỗi khi lấy thông tin người dùng
    useEffect(() => {
        if (userError) {
            showToast("error", userError);
        }
    }, [userError]);

    // Đóng dropdown khi không đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            closeDropdown();
            dispatch(resetUserState()); // Reset user state khi đăng xuất
        }
    }, [isAuthenticated, dispatch]);

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            closeDropdown();
            await dispatch(logoutThunk()).unwrap();
            showToast("success", "Đăng xuất thành công.");
            setTimeout(() => navigate("/"), 100);
        } catch (error) {
            showToast("error", "Đăng xuất thất bại. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-avatar")) {
                closeDropdown();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <nav className="bg-white shadow-sm px-4 py-2 flex items-center justify-between sticky top-0 z-40">
            <Link to="/" className="text-xl font-bold text-blue-600">
                📚 DocuLib
            </Link>
            <div className="flex items-center gap-3">
                <Link to="/search" className="text-gray-700 hover:text-blue-500">
                    🔍 Tìm kiếm
                </Link>

                <Link
                    to="/user/notifications"
                    className="relative text-gray-600 hover:text-blue-500"
                >
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Link>

                {isAuthenticated ? (
                    <div className="relative dropdown-avatar">
                        {authLoading || userLoading ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                disabled={authLoading || userLoading}
                            >
                                <img
                                    src={userInfo?.avatar || "/src/assets/default-avatar.png"}
                                    onError={(e) =>
                                        (e.currentTarget.src = "/src/assets/default-avatar.png")
                                    }
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            </button>
                        )}

                        {isDropdownOpen && isAuthenticated && userInfo && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                                <div className="px-4 py-2">
                                    <p className="text-sm font-semibold">
                                        {userInfo.name || "Người dùng"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {userInfo.email || "Không có email"}
                                    </p>
                                </div>
                                <hr />
                                <Link
                                    to="/user/profile"
                                    onClick={closeDropdown}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Hồ sơ cá nhân
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    disabled={authLoading || userLoading}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/auth/login"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                    >
                        <UserCircle size={24} />
                        <span>Đăng nhập</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
