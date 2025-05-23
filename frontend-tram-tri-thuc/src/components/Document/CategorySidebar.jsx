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
        <div className="p-4 border rounded bg-white/80 backdrop-blur-sm shadow-sm">
            <h4 className="font-semibold mb-3 text-gray-800">📁 Danh mục</h4>
            {loading && <p className="text-gray-600">Đang tải danh mục...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && categories.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-500">Không có danh mục nào.</p>
                    <p className="text-sm text-gray-400 mt-1">Vui lòng quay lại sau.</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {categories.map((cat) => (
                        <li key={cat._id}>
                            <NavLink
                                to={`/category/${cat.slug}`}
                                className={({ isActive }) =>
                                    `block px-2 py-1.5 rounded transition-all duration-200 ${
                                        isActive 
                                            ? "font-semibold text-blue-600 bg-blue-50" 
                                            : "text-gray-600 hover:bg-gray-50"
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
                            className={`px-3 py-1 rounded transition-colors duration-200 ${
                                num === pagination.currentPage
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
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
