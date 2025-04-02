import { useState } from "react";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-lg p-4 flex items-center justify-between z-10 transition-all duration-300">
            <Link
                to="/"
                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
                Trạm Tri thức
            </Link>
            {isLoggedIn ? (
                <div className="flex items-center space-x-6">
                    <Link
                        to="/documents"
                        className="text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors"
                    >
                        Sách
                    </Link>
                    <Link
                        to="/documents"
                        className="text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors"
                    >
                        Tài liệu của tôi
                    </Link>
                    <input
                        type="text"
                        placeholder="Tìm kiếm tài liệu..."
                        className="rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                        onClick={toggleDarkMode}
                        className="text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors"
                    >
                        {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                    </button>
                    <div className="relative">
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            3
                        </span>
                        <FaBell
                            size={20}
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-500 cursor-pointer transition-colors"
                        />
                    </div>
                    {/* Avatar với Dropdown */}

                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="focus:outline-none"
                        >
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Avatar"
                                className="w-10 h-10 rounded-full border-2 border-blue-500 hover:scale-105 transition-transform"
                            />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-20 animate-fadeIn">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Hồ sơ người dùng
                                </Link>
                                <button
                                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white transition-colors"
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        // Logic đăng xuất ở đây (ví dụ: xóa token, chuyển hướng)
                                        console.log("Đăng xuất");
                                    }}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Link
                    to="/login"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                    Đăng nhập
                </Link>
            )}
        </nav>
    );
};

export default Navbar;
