// src/components/Navbar.jsx
import { useState } from "react";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";
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
        <nav className="flex items-center justify-between px-6 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm h-full">
            {/* Logo */}
            <div className="flex items-center space-x-3">
                <img src="/drive-icon.png" alt="logo" className="w-8 h-8" />
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Trạm Tri Thức
                </h1>
            </div>

            {/* Search Bar */}
            {isLoggedIn && (
                <div className="flex-1 max-w-xl mx-6">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tài liệu..."
                        className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>
            )}

            {/* Right icons */}
            <div className="flex items-center space-x-4">
                <button onClick={toggleDarkMode}>
                    {darkMode ? (
                        <FaSun className="text-yellow-500" />
                    ) : (
                        <FaMoon className="text-gray-700 dark:text-white" />
                    )}
                </button>

                <div className="relative">
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        3
                    </span>
                    <FaBell
                        className="text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer"
                        size={20}
                    />
                </div>

                {/* Avatar */}
                {isLoggedIn ? (
                    <div className="relative">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="Avatar"
                            className="w-9 h-9 rounded-full border hover:ring-2 hover:ring-blue-500 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        />
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-white"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Hồ sơ
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white text-sm text-gray-700 dark:text-white"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
