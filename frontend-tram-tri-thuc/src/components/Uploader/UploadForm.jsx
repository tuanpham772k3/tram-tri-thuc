import { useState } from "react";

const UploadForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        categoryId: "",
        tags: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Gọi API đăng tài liệu
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <input
                name="title"
                placeholder="Tiêu đề"
                value={formData.title}
                onChange={handleChange}
                className="input w-full"
            />
            <textarea
                name="description"
                placeholder="Mô tả"
                value={formData.description}
                onChange={handleChange}
                className="textarea w-full"
            />
            <input
                name="tags"
                placeholder="Thẻ (cách nhau bởi dấu phẩy)"
                value={formData.tags}
                onChange={handleChange}
                className="input w-full"
            />
            <input
                type="file"
                name="file"
                accept=".pdf,.doc,.ppt"
                onChange={handleChange}
                className="file-input"
            />
            <button type="submit" className="btn btn-primary">
                Tải lên
            </button>
        </form>
    );
};

export default UploadForm;
