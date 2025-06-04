import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { clearError, uploadDocument } from "../../store/slices/documentSlice";
import showToast from "../../utils/toast";
import { FaCloudUploadAlt, FaImage, FaTags, FaFolder, FaHeading } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

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

    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 100 }));
        return () => dispatch(clearError());
    }, [dispatch]);

    // Xử lý file tài liệu (PDF)
    const onDropDocument = useCallback((acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            showToast("error", "Chỉ chấp nhận file PDF, tối đa 50MB");
            return;
        }
        const file = acceptedFiles[0];
        setFormData((prev) => ({ ...prev, file }));
    }, []);

    // Xử lý thumbnail (hình ảnh)
    const onDropThumbnail = useCallback((acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            showToast("error", "Chỉ chấp nhận file ảnh (PNG, JPG), tối đa 10MB");
            return;
        }
        const file = acceptedFiles[0];
        setFormData((prev) => ({ ...prev, thumbnail: file }));
        setPreviewUrl(URL.createObjectURL(file));
    }, []);

    // Cấu hình dropzone cho tài liệu
    const {
        getRootProps: getDocumentRootProps,
        getInputProps: getDocumentInputProps,
        isDragActive: isDocumentDragActive,
    } = useDropzone({
        onDrop: onDropDocument,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 50 * 1024 * 1024, // 50MB
        multiple: false,
    });

    // Cấu hình dropzone cho thumbnail
    const {
        getRootProps: getThumbnailRootProps,
        getInputProps: getThumbnailInputProps,
        isDragActive: isThumbnailDragActive,
    } = useDropzone({
        onDrop: onDropThumbnail,
        accept: { "image/*": [".png", ".jpg", ".jpeg"] },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) {
            showToast("error", "Vui lòng chọn file PDF");
            return;
        }

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
            // Toast đã được xử lý trong uploadDocument asyncThunk
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
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
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
                                        onChange={(e) =>
                                            setFormData({ ...formData, categoryId: e.target.value })
                                        }
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
                                        onChange={(e) =>
                                            setFormData({ ...formData, tag: e.target.value })
                                        }
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
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all resize-none"
                                        placeholder="Mô tả ngắn gọn về tài liệu (không bắt buộc)"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                                        <FaImage className="w-5 h-5 mr-2" />
                                        Ảnh đại diện (không bắt buộc)
                                    </label>
                                    <div
                                        {...getThumbnailRootProps()}
                                        className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors ${
                                            isThumbnailDragActive
                                                ? "border-green-500 bg-green-50"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <input {...getThumbnailInputProps()} />
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
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                thumbnail: null,
                                                            }));
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
                                                        <span className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                                                            Tải ảnh lên
                                                        </span>
                                                        <p className="pl-1">hoặc kéo thả vào đây</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG tối đa 10MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div
                            {...getDocumentRootProps()}
                            className={`mt-6 p-6 border-2 border-dashed rounded-xl transition-colors ${
                                isDocumentDragActive
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-300"
                            }`}
                        >
                            <input {...getDocumentInputProps()} />
                            <div className="text-center">
                                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <span className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                                        Tải file PDF lên
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">
                                        hoặc kéo thả file vào đây
                                    </p>
                                </div>
                                {formData.file && (
                                    <div className="mt-4 flex items-center justify-center">
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {formData.file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({ ...prev, file: null }))
                                            }
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
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
                                        viewBox="0 0 24 24"
                                    >
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
