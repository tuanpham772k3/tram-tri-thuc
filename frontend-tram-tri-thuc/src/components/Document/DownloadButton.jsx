// frontend/src/components/Document/DownloadButton.js
import { useState } from "react";
import { Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { downloadDocument } from "../../store/slices/documentSlice";

export default function DownloadButton({ documentId }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.documents);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        await dispatch(downloadDocument(documentId));
        setIsDownloading(false);
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading || isDownloading}
            className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
            <Download size={18} />
            {loading || isDownloading ? "Đang tải..." : "Tải tài liệu"}
        </button>
    );
}
