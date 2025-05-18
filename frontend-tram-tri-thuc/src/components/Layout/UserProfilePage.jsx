import { Outlet, NavLink } from "react-router-dom";

export default function UserProfilePage() {
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Hồ sơ cá nhân</h2>
            <nav className="flex gap-4 border-b mb-4 pb-2">
                <NavLink
                    to="/user/profile"
                    end
                    className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "")}
                >
                    Thông tin
                </NavLink>
                <NavLink
                    to="downloads"
                    className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "")}
                >
                    Đã tải
                </NavLink>
                <NavLink
                    to="favorites"
                    className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "")}
                >
                    Yêu thích
                </NavLink>
                <NavLink
                    to="views"
                    className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "")}
                >
                    Đã xem
                </NavLink>
            </nav>
            <Outlet />
        </div>
    );
}
