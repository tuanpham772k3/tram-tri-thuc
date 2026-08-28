import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { FolderOpen } from "lucide-react";

export default function CategorySidebar() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  console.log("🚀 ~ CategorySidebar ~ categories:", categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="w-5 h-5 text-blue-500" />
        <h4 className="font-semibold text-base text-gray-800 tracking-wide uppercase">
          Danh mục
        </h4>
      </div>
      {loading && <p className="text-gray-600 text-sm">Đang tải danh mục...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && categories.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">Không có danh mục nào.</p>
          <p className="text-sm text-gray-400 mt-1">Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat._id}>
              <NavLink
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2
                                    ${
                                      isActive
                                        ? "font-semibold text-blue-600 bg-blue-100 shadow-sm"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                    `
                }
              >
                {cat.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
