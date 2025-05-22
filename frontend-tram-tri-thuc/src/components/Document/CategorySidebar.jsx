import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";

export default function CategorySidebar() {
    const dispatch = useDispatch();
    const { categories, loading, error, pagination } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 10 }));
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchCategories({ page, limit: 10 }));
    };

    return (
        <div className="p-4 border rounded">
            <h4 className="font-semibold mb-3">📁 Danh mục</h4>
            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && categories.length === 0 ? (
                <p className="text-gray-500">Không có danh mục nào.</p>
            ) : (
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
            )}
            {pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => handlePageChange(num)}
                            className={`px-3 py-1 rounded ${
                                num === pagination.currentPage
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
