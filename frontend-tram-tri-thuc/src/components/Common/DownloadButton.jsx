// frontend/src/components/Document/DownloadButton.js
import { useState } from "react";
import { Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function DownloadButton({ documentId }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.documents);
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <button
      disabled={loading || isDownloading}
      className={`mt-3 flex items-center gap-2 px-4 py-2 rounded transition-colors ${
        loading || isDownloading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
      aria-label="Tải xuống tài liệu"
    >
      <Download size={18} />
      {isDownloading ? "Đang tải..." : "Tải tài liệu"}
    </button>
  );
}
