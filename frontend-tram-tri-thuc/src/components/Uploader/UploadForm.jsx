import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { clearError, uploadDocument } from "../../store/slices/documentSlice";
import showToast from "../../utils/toast";
import { FaCloudUploadAlt, FaImage, FaTags, FaFolder, FaHeading } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { motion } from "framer-motion";

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

    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 100 }));
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") {
                setFormData(prev => ({ ...prev, file }));
            } else {
                showToast("error", "Chỉ chấp nhận file PDF");
            }
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'document') {
            if (file && file.type === "application/pdf") {
                setFormData(prev => ({ ...prev, file }));
            } else {
                showToast("error", "Chỉ chấp nhận file PDF");
            }
        } else if (type === 'thumbnail') {
            if (file && file.type.startsWith("image/")) {
                setFormData(prev => ({ ...prev, thumbnail: file }));
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                showToast("error", "Chỉ chấp nhận file ảnh");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("categoryId", formData.categoryId);
        data.append("tag", formData.tag);
        if (formData.file) data.append("file", formData.file);
        if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

        try {
            await dispatch(uploadDocument(data)).unwrap();
            showToast("success", "Tải tài liệu thành công!");
            setFormData({
                title: "",
                description: "",
                categoryId: "",
                tag: "",
                file: null,
                thumbnail: null,
            });
            setPreviewUrl(null);
        } catch {
            showToast("error", "Không thể tải tài liệu");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-8"
        >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            <FaCloudUploadAlt className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800">Tải tài liệu mới</h2>
                        <p className="text-gray-600 mt-2">Chia sẻ kiến thức với cộng đồng</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="space-y-6"
                            >
                                <div className="relative">
                                    <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                                        <FaHeading className="w-5 h-5 mr-2" />
                                        Tiêu đề
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                                        placeholder="Nhập tiêu đề tài liệu"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                                        <FaFolder className="w-5 h-5 mr-2" />
                                        Danh mục
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                                        required
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                                        <FaTags className="w-5 h-5 mr-2" />
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ví dụ: sách, toán, tài liệu học"
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="space-y-6"
                            >
                                <div className="relative">
                                    <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                                        <MdDescription className="w-5 h-5 mr-2" />
                                        Mô tả
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all resize-none"
                                        placeholder="Mô tả ngắn gọn về tài liệu (không bắt buộc)"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                                        <FaImage className="w-5 h-5 mr-2" />
                                        Ảnh đại diện (không bắt buộc)
                                    </label>
                                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors">
                                        <div className="space-y-1 text-center">
                                            {previewUrl ? (
                                                <div className="relative group">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="mx-auto h-32 w-auto rounded-lg object-cover"
                                                    />
                                                    <div
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, thumbnail: null }));
                                                            setPreviewUrl(null);
                                                        }}
                                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
                                                    >
                                                        <span className="text-white">Xóa ảnh</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                                            <span>Tải ảnh lên</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e, 'thumbnail')}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                        <p className="pl-1">hoặc kéo thả vào đây</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG tối đa 10MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div
                            className={`mt-6 p-6 border-2 ${
                                dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
                            } border-dashed rounded-xl transition-colors relative`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="text-center">
                                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                        <span>Tải file PDF lên</span>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, 'document')}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="text-sm text-gray-500 mt-1">hoặc kéo thả file vào đây</p>
                                </div>
                                {formData.file && (
                                    <div className="mt-4 flex items-center justify-center">
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {formData.file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
                                loading
                                    ? "bg-green-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Đang tải...
                                </div>
                            ) : (
                                "Tải tài liệu"
                            )}
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
