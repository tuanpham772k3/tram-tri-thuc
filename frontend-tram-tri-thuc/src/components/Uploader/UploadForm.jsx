// frontend/src/components/Uploader/UploadForm.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { uploadDocument } from "../../store/slices/documentSlice";

export default function UploadForm() {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categories);
    const { loading, error } = useSelector((state) => state.documents);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        categoryId: "",
        tag: "",
        file: null,
        thumbnail: null,
    });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("categoryId", formData.categoryId);
        data.append("tag", formData.tag);
        if (formData.file) data.append("file", formData.file);
        if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

        dispatch(uploadDocument(data));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                placeholder="Tiêu đề"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
            />
            <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full p-2 border rounded"
                required
            >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Tags (cách nhau bằng dấu phẩy)"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full p-2 border rounded"
            />
            <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="file"
                accept=".jpg,.png"
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                className="w-full p-2 border rounded"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? "Đang tải..." : "Tải lên"}
            </button>
        </form>
    );
}
