import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Download, Heart } from "lucide-react";
import { downloadDocument, toggleFavorite } from "../../store/slices/documentSlice";
import { fetchFavoriteDocuments } from "../../store/slices/userSlice";

export default function DocumentCard({ document, type }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        userInfo,
        favoriteDocuments = [],
        loading: userLoading,
    } = useSelector((state) => state.user);

    const isFavorite = favoriteDocuments.some((fav) => fav._id === document._id);
    const favoriteCount = document.favoriteCount ?? 0;

    const handleDownload = () => {
        dispatch(downloadDocument(document._id));
    };

    const handleToggleFavorite = () => {
        if (!userInfo) {
            navigate("/auth/login");
            return;
        }
        dispatch(toggleFavorite(document._id))
            .unwrap()
            .then(() => {
                // Gọi lại fetchFavoriteDocuments để đồng bộ
                dispatch(fetchFavoriteDocuments({ page: 1, limit: 12 }));
            })
            .catch((error) => {
                console.error("Toggle favorite failed:", error);
            });
    };

    const tags = document.tag ? document.tag.split(",").map((tag) => tag.trim()) : [];

    return (
        <div className="border rounded-lg shadow p-4 hover:bg-gray-50">
            <Link to={`/documents/${document.slug}`} className="block">
                <h3 className="font-semibold text-lg text-blue-600 hover:underline">
                    {document.title}
                </h3>
                <p className="text-sm text-gray-500">{document.uploader?.name || "Unknown"}</p>
                <p className="text-sm text-gray-700 mt-2">
                    {document.description || "Không có mô tả"}
                </p>
                {type === "download" && document.downloadedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                        Tải xuống:{" "}
                        {new Date(document.downloadedAt).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                        })}
                    </p>
                )}
                {type === "favorite" && document.favoritedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                        Yêu thích:{" "}
                        {new Date(document.favoritedAt).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                        })}
                    </p>
                )}
                {type === "view" && document.viewedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                        Xem:{" "}
                        {new Date(document.viewedAt).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                        })}
                    </p>
                )}
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
                <div className="flex items-center gap-4">
                    <span>{document.viewCount || 0} lượt xem</span>
                    <button
                        className={`flex items-center gap-1 ${
                            isFavorite ? "text-red-600" : "text-gray-600"
                        } hover:text-red-800 transition-colors`}
                        onClick={handleToggleFavorite}
                        disabled={userLoading}
                    >
                        <Heart size={16} className={isFavorite ? "fill-current" : "fill-none"} />
                        <span>{favoriteCount}</span>
                    </button>
                </div>
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
