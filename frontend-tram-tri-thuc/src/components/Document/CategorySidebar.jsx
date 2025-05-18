import { NavLink } from "react-router-dom";

// Hàm tạo slug đơn giản
const toSlug = (name) =>
    name
        .normalize("NFD") // bỏ dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-");

export default function CategorySidebar() {
    const categories = ["Toán", "Văn", "Hóa học", "Vật lý", "Lịch sử"];

    return (
        <div className="p-4 border rounded">
            <h4 className="font-semibold mb-3">📁 Danh mục</h4>
            <ul className="space-y-2">
                {categories.map((cat) => (
                    <li key={cat}>
                        <NavLink
                            to={`/category/${toSlug(cat)}`}
                            className={({ isActive }) =>
                                `block px-2 py-1 rounded hover:bg-gray-100 ${
                                    isActive ? "font-semibold text-blue-600" : ""
                                }`
                            }
                        >
                            {cat}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}
