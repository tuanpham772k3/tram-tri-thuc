import { useDropzone } from "react-dropzone";
import { useState } from "react";

const UploadDropzone = ({ onUploadSuccess, token }) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Kiểm tra kích thước file (10MB = 10 * 1024 * 1024 bytes)
        if (file.size > 10 * 1024 * 1024) {
            setMessage("File vượt quá 10MB!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setMessage("Upload thành công!");
                onUploadSuccess(data.file); // Cập nhật danh sách
            } else {
                setMessage(data.message || "Upload thất bại!");
            }
        } catch (error) {
            setMessage("Lỗi khi upload!");
            console.error(error);
        } finally {
            setLoading(false);
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
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 rounded-lg text-center transition-all duration-300 ${
                isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-300 dark:border-gray-600"
            }`}
        >
            <input {...getInputProps()} />
            {loading ? (
                <p className="text-gray-600 dark:text-gray-300 animate-pulse">
                    Đang tải lên...
                </p>
            ) : (
                <p className="text-gray-600 dark:text-gray-300">
                    Kéo thả tài liệu hoặc nhấp để chọn
                </p>
            )}
            {message && (
                <p
                    className={`mt-2 ${
                        message.includes("thành công")
                            ? "text-green-500"
                            : "text-red-500"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default UploadDropzone;
