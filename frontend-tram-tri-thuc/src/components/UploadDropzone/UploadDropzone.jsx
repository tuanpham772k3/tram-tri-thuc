import { useDropzone } from "react-dropzone";
import { useState } from "react";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaFileUpload,
    FaUpload,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { uploadDocument } from "../../redux/slices/documentSlice";

const UploadDropzone = () => {
    const [message, setMessage] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Kiểm tra kích thước file (10MB = 10 * 1024 * 1024 bytes)
        if (file.size > 10 * 1024 * 1024) {
            setMessage("File vượt quá 10MB!");
            return;
        }

        setUploadProgress(0);
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                return prev + 5;
            });
        }, 200);
        try {
            await dispatch(uploadDocument(file)).unwrap();
            clearInterval(progressInterval);
            setUploadProgress(100);
            setMessage("Upload thành công!");
            setTimeout(() => {
                setMessage("");
                setUploadProgress(0);
            }, 5000);
        } catch (error) {
            clearInterval(progressInterval);
            setMessage("Upload thất bại!");
            setUploadProgress(0);
            console.error(error);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
        }, // Chỉ chấp nhận các loại file này
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
    });

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <FaFileUpload
                        className="mx-auto text-blue-500 animate-bounce"
                        size={32}
                    />
                    <p className="text-gray-600 dark:text-gray-300">
                        Đang tải lên...
                    </p>
                    <div className="w-64 bg-gray-200 rounded-full h-2.5 mt-3 mx-auto overflow-hidden">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {uploadProgress}%
                    </p>
                </div>
            );
        }

        if (message && message.includes("thành công")) {
            return (
                <div className="text-center">
                    <FaCheckCircle
                        className="mx-auto text-green-500 mb-2"
                        size={32}
                    />
                    <p className="text-green-500 font-medium">{message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Nhấp hoặc kéo thả để tải lên tệp khác
                    </p>
                </div>
            );
        }

        if (message) {
            return (
                <div className="text-center">
                    <FaExclamationCircle
                        className="mx-auto text-red-500 mb-2"
                        size={32}
                    />
                    <p className="text-red-500 font-medium">{message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Vui lòng thử lại
                    </p>
                </div>
            );
        }

        if (isDragActive) {
            return (
                <div className="text-center">
                    <FaUpload
                        className="mx-auto text-blue-500 mb-3"
                        size={32}
                    />
                    <p className="text-blue-500 font-medium">
                        Thả tệp để tải lên
                    </p>
                </div>
            );
        }

        return (
            <div className="text-center">
                <FaUpload
                    className="mx-auto text-gray-400 dark:text-gray-600 mb-3"
                    size={32}
                />
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Kéo thả tài liệu hoặc nhấp để chọn
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Hỗ trợ PDF, Word, Excel, và hình ảnh (JPG, PNG)
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tối đa 10MB
                </p>
            </div>
        );
    };

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 rounded-lg text-center transition-all duration-300 cursor-pointer flex items-center justify-center min-h-[160px] ${
                isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : message && message.includes("thành công")
                      ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                      : message
                        ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
        >
            <input {...getInputProps()} />
            {renderContent()}
        </div>
    );
};

export default UploadDropzone;
