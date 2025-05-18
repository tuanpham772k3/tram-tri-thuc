import { useState } from "react";
import { Download } from "lucide-react";

export default function DownloadButton({ documentId }) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        // Giả lập xử lý tải và cập nhật lượt tải
        setTimeout(() => {
            setLoading(false);
            alert("Đã tải xuống!");
        }, 1000);
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            <Download size={18} />
            {loading ? "Đang tải..." : "Tải tài liệu"}
        </button>
    );
}
