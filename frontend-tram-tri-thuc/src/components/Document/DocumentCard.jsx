import { Link } from "react-router-dom";
import { Download } from "lucide-react";

export default function DocumentCard({ document }) {
    return (
        <div className="border rounded-lg shadow p-4 hover:bg-gray-50">
            <Link to={`/document/${document._id}`} className="block">
                <h3 className="font-semibold text-lg text-blue-600 hover:underline">
                    {document.title}
                </h3>
                <p className="text-sm text-gray-500">{document.author}</p>
                <p className="text-sm text-gray-700 mt-2">{document.description}</p>
            </Link>
            <div className="flex flex-wrap gap-2 mt-2">
                {(document.tags || []).map((tag, index) => (
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
                    onClick={() => alert("Tải xuống tài liệu")}
                >
                    <Download size={16} />
                    Tải xuống ({document.downloadCount})
                </button>
            </div>
        </div>
    );
}
