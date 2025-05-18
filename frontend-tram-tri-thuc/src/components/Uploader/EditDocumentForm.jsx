import { useState, useEffect } from "react";

const EditDocumentForm = ({ document }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: "",
    });

    useEffect(() => {
        if (document) {
            setFormData({
                title: document.title,
                description: document.description,
                tags: document.tags?.join(", "),
            });
        }
    }, [document]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi API cập nhật tài liệu
        console.log("Cập nhật:", formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input w-full"
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea w-full"
            />
            <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input w-full"
            />
            <button type="submit" className="btn btn-primary">
                Lưu thay đổi
            </button>
        </form>
    );
};

export default EditDocumentForm;
