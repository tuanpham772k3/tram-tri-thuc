import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, updateDocument } from "../../store/slices/documentSlice";
import showToast from "../../utils/toast";

const EditDocumentForm = ({ document }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.documents);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: "",
    });

    useEffect(() => {
        if (document) {
            setFormData({
                title: document.title || "",
                description: document.description || "",
                tag: document.tag || "",
            });
        }
        return () => dispatch(clearError());
    }, [document, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(
                updateDocument({
                    id: document._id,
                    data: {
                        title: formData.title,
                        description: formData.description,
                        tag: formData.tag,
                    },
                })
            ).unwrap();
            showToast("success", "Cập nhật tài liệu thành công!");
        } catch (err) {
            showToast("error", "Không thể cập nhật tài liệu");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            {error && <p className="text-red-500">{error}</p>}
            <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Tiêu đề"
                className="w-full p-2 border rounded"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả"
                className="w-full p-2 border rounded"
            />
            <input
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Tags (cách nhau bằng dấu phẩy)"
                className="w-full p-2 border rounded"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
        </form>
    );
};

export default EditDocumentForm;
