import { NavLink } from "react-router-dom";
import { Bell, FileText, LogOut, Upload, User } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="h-full p-4 space-y-3 text-gray-800">
            <h2 className="text-lg font-semibold mb-4">📂 Điều hướng</h2>
            <NavLink
                to="/user/profile"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            >
                <User size={18} /> Hồ sơ cá nhân
            </NavLink>

            <NavLink
                to="/uploader/my-documents"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            >
                <FileText size={18} /> Tài liệu của tôi
            </NavLink>

            <NavLink
                to="/uploader/upload"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            >
                <Upload size={18} /> Đăng tài liệu
            </NavLink>

            <NavLink
                to="/user/notifications"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            >
                <Bell size={18} /> Thông báo
            </NavLink>

            <NavLink
                to="/auth/logout"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-red-600"
            >
                <LogOut size={18} /> Đăng xuất
            </NavLink>

        </aside>
    );
}
