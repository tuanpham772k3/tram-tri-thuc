import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Download, Eye, User, Tag } from "lucide-react";
import defaultThumbnail from "../../assets/image2.jpg";

// Thêm constant cho API URL
const API_URL = "http://localhost:5000"; // hoặc URL của server của bạn

export default function DocumentCard({ document, type }) {
  const dispatch = useDispatch();

  const tags = Array.isArray(document.tags) ? document.tags : [];

  // Hàm format ngày giờ
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Tạo URL đầy đủ cho thumbnail
  const getThumbnailUrl = (path) => {
    if (!path) return defaultThumbnail;
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  return (
    <motion.div
      whileHover={{
        translateY: -5,
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      transition={{ duration: 0.2 }}
      className="relative h-full bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      {/* Thêm huy hiệu VIP */}
      {document.accessLevel === "vip" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }} // Delay nhẹ để tránh trùng animation với huy hiệu Nổi bật
          className="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-br-lg shadow-md"
          aria-label="Tài liệu VIP"
        >
          VIP
        </motion.div>
      )}
      <div>
        {/* Thêm ảnh đại diện */}
        <Link to={`/documents/slug/${document.slug}`} className="block mb-4">
          <div className="w-full h-40 rounded-lg overflow-hidden">
            <img
              src={getThumbnailUrl(document.thumbnailUrl)}
              alt={document.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== defaultThumbnail) {
                  e.target.src = defaultThumbnail;
                }
              }}
            />
          </div>
        </Link>

        <Link to={`/documents/slug/${document.slug}`} className="block mb-2">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {document.title}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <User size={14} className="text-gray-400" />
            {document.uploader?.name || "Người đăng ẩn danh"}
          </p>
        </Link>

        {/* Dynamic date info based on type */}
        {type === "download" && document.downloadedAt && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
            <Download size={12} className="text-blue-400" />
            Tải xuống: {formatDateTime(document.downloadedAt)}
          </p>
        )}
        {type === "view" && document.viewedAt && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
            <Eye size={12} className="text-green-400" />
            Xem: {formatDateTime(document.viewedAt)}
          </p>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <Tag size={14} className="text-gray-400 flex-shrink-0" />
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions and Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Eye size={21} className="text-gray-500" />
            <span>{document.viewCount || 0}</span>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={21} />
          Tải xuống ({document.downloadCount || 0})
        </motion.button>
      </div>
    </motion.div>
  );
}
