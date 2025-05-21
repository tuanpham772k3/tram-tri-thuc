// frontend/src/components/Document/DocumentCard.js
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { useDispatch } from "react-redux";
import { downloadDocument } from "../../store/slices/documentSlice";

export default function DocumentCard({ document }) {
    const dispatch = useDispatch();

    const handleDownload = () => {
        dispatch(downloadDocument(document._id));
    };

    return (
        <div className="border rounded-lg shadow p-4 hover:bg-gray-50">
            <Link to={`/document/${document._id}`} className="block">
                <h3 className="font-semibold text-lg text-blue-600 hover:underline">
                    {document.title}
                </h3>
                <p className="text-sm text-gray-500">{document.uploaderId?.name || "Unknown"}</p>
                <p className="text-sm text-gray-700 mt-2">{document.description}</p>
            </Link>
            <div className="flex flex-wrap gap-2 mt-2">
                {(document.tag || []).map((tag, index) => (
                    <span
                        key={index}
                        className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>{document.viewCount} lượt xem</span>
                <button
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    onClick={handleDownload}
                >
                    <Download size={16} />
                    Tải xuống ({document.downloadCount})
                </button>
            </div>
        </div>
    );
}
