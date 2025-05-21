// frontend/src/pages/CategoryPage.js
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryBySlug } from "../store/slices/categorySlice";
import DocumentList from "../components/Document/DocumentList";

export default function CategoryPage() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { currentCategory, loading, error } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategoryBySlug(slug));
    }, [dispatch, slug]);

    return (
        <div className="p-6">
            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h1 className="text-2xl font-semibold mb-4">
                📁 Danh mục: {currentCategory?.name || slug.replace(/-/g, " ")}
            </h1>
            <DocumentList categorySlug={slug} />
        </div>
    );
}
