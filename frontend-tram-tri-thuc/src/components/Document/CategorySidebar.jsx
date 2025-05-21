import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";

export default function CategorySidebar() {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="p-4 border rounded">
            <h4 className="font-semibold mb-3">📁 Danh mục</h4>
            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-2">
                {categories.map((cat) => (
                    <li key={cat._id}>
                        <NavLink
                            to={`/category/${cat.slug}`}
                            className={({ isActive }) =>
                                `block px-2 py-1 rounded hover:bg-gray-100 ${
                                    isActive ? "font-semibold text-blue-600" : ""
                                }`
                            }
                        >
                            {cat.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}
