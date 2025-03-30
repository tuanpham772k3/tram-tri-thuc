import React from "react";
import { FaFileAlt, FaFolder, FaShareAlt, FaTrash } from "react-icons/fa";

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white shadow-md p-4 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">📚 Trạm Tri Thức</h2>
            <nav className="flex-1">
                <ul>
                    <li className="mb-2 flex items-center gap-2 hover:text-blue-500 cursor-pointer">
                        <FaFileAlt /> Tài liệu
                    </li>
                    <li className="mb-2 flex items-center gap-2 hover:text-blue-500 cursor-pointer">
                        <FaFolder /> Thư mục
                    </li>
                    <li className="mb-2 flex items-center gap-2 hover:text-blue-500 cursor-pointer">
                        <FaShareAlt /> Đã chia sẻ
                    </li>
                    <li className="mb-2 flex items-center gap-2 hover:text-blue-500 cursor-pointer">
                        <FaTrash /> Thùng rác
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
