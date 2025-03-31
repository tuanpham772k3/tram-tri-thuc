import React, { useState } from "react";
import { FaBell, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);
    return (
        <nav
            className={`w-full bg-white shadow-md p-4 flex justify-between items-center ${darkMode ? "bg-gray-800 text-white" : ""}`}
        >
            <h2 className="text-xl font-bold mb-4">📚 Trạm Tri Thức</h2>
            <input
                type="text"
                placeholder="🔍 Tìm kiếm..."
                className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex items-center gap-4">
                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? (
                        <FaSun className="text-yellow-400" />
                    ) : (
                        <FaMoon />
                    )}
                </button>
                <FaBell className="cursor-pointer hover:text-blue-500" />
                <FaUserCircle className="text-2xl cursor-pointer hover:text-blue-500" />
            </div>
        </nav>
    );
};

export default Navbar;
