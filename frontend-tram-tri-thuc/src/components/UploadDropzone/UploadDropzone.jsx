import { useDropzone } from "react-dropzone";
import { useState } from "react";

const UploadDropzone = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onDrop = async (acceptedFiles) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        const res = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        setMessage(data.message);
        setLoading(false);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
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
            {message && <p className="text-green-500 mt-2">{message}</p>}
        </div>
    );
};

export default UploadDropzone;
