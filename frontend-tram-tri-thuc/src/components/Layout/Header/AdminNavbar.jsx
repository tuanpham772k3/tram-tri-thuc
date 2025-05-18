import { Link } from "react-router-dom";

export default function AdminNavbar() {
    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
            <Link to="/admin" className="text-xl font-bold">
                🛠️ Admin Panel
            </Link>
            <Link to="/" className="hover:underline text-sm">
                ← Quay lại trang chính
            </Link>
        </nav>
    );
}
