// src/components/Navbar.jsx
import { useState } from "react";
import { FaBell, FaCog, FaMoon, FaQuestionCircle, FaSearch, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";

const Navbar = ({ isLoggedIn }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const handleLogout = () => {
        dispatch(logout(token));
        navigate("/login");
    };

    return (
        <nav className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <img src="/drive-icon.png" alt="logo" className="w-10 h-10" />
                <h1 className="text-xl font-medium text-gray-800 dark:text-white hidden sm:block">
                    Trạm Tri Thức
                </h1>
            </div>

            {/* Search Bar */}
            {isLoggedIn && (
                <div className="flex-1 max-w-2xl mx-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài liệu..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition"
                        />
                    </div>
                </div>
            )}

            {/* Right icons */}
            <div className="flex items-center space-x-1 sm:space-x-3">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    {darkMode ? (
                        <FaSun className="text-yellow-500" size={18} />
                    ) : (
                        <FaMoon className="text-gray-700 dark:text-gray-200" size={18} />
                    )}
                </button>

                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <FaQuestionCircle className="text-gray-600 dark:text-gray-300" size={18} />
                </button>

                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <FaCog className="text-gray-600 dark:text-gray-300" size={18} />
                </button>

                <div className="relative">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                        <FaBell className="text-gray-600 dark:text-gray-300" size={18} />
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>
                </div>

                {/* Avatar */}
                {isLoggedIn ? (
                    <div className="relative ml-2">
                        <button
                            className="flex items-center"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <img
                                src="../../../public/images/Avatar.png"
                                alt="Avatar"
                                className="w-8 h-8 rounded-full border hover:ring-2 hover:ring-blue-500 cursor-pointer"
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border dark:border-gray-700">
                                <div className="px-4 py-3 border-b dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Người dùng
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        user@example.com
                                    </p>
                                </div>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-white"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Hồ sơ
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-white"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Cài đặt
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 text-sm text-gray-700 dark:text-white"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
