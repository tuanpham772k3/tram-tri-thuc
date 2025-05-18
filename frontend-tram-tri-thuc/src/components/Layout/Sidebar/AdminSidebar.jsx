import { NavLink } from "react-router-dom";
import { Users, FileCheck, Layers, BarChart } from "lucide-react";

export default function AdminSidebar() {
    return (
        <aside className="w-64 p-4 bg-gray-100 text-gray-800 min-h-screen">
            <h2 className="text-lg font-semibold mb-4">📊 Quản trị</h2>
            <NavLink
                to="/admin/users"
                className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
            >
                <Users size={18} /> Người dùng
            </NavLink>

            <NavLink
                to="/admin/approvals"
                className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
            >
                <FileCheck size={18} /> Duyệt tài liệu
            </NavLink>

            <NavLink
                to="/admin/categories"
                className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
            >
                <Layers size={18} /> Danh mục
            </NavLink>

            <NavLink
                to="/admin/reports"
                className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
            >
                <BarChart size={18} /> Thống kê
            </NavLink>
        </aside>
    );
}
