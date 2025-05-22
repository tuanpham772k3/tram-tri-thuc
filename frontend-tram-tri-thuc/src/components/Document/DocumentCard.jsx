// frontend/src/components/Document/DocumentCard.js
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Download } from "lucide-react";
import { downloadDocument } from "../../store/slices/documentSlice";

export default function DocumentCard({ document }) {
    const dispatch = useDispatch();

    const handleDownload = () => {
        dispatch(downloadDocument(document._id));
    };

    // Xử lý tags từ chuỗi sang mảng
    const tags = document.tag ? document.tag.split(",").map((tag) => tag.trim()) : [];

    return (
        <div className="border rounded-lg shadow p-4 hover:bg-gray-50">
            <Link to={`/documents/${document.slug}`} className="block">
                <h3 className="font-semibold text-lg text-blue-600 hover:underline">
                    {document.title}
                </h3>
                <p className="text-sm text-gray-500">{document.uploaderId?.name || "Unknown"}</p>
                <p className="text-sm text-gray-700 mt-2">
                    {document.description || "Không có mô tả"}
                </p>
            </Link>
            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>{document.viewCount || 0} lượt xem</span>
                <button
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    onClick={handleDownload}
                >
                    <Download size={16} />
                    Tải xuống ({document.downloadCount || 0})
                </button>
            </div>
        </div>
    );
}
