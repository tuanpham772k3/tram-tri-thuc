import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Heart,
  FileText,
  User,
  Calendar,
  Eye,
  Download,
  Share2,
  Bookmark,
  Clock,
  ThumbsUp,
} from "lucide-react";
import DownloadButton from "../../components/Common/DownloadButton";
import CommentSection from "../../components/Comment/CommentSection";
import RatingStars from "../../components/Rating/RatingStar";
import DocumentViewer from "../../components/Document/DocumentViewer";
import DocumentList from "../../components/Document/DocumentList";
import {
  fetchDocumentBySlug,
  fetchRelatedDocuments,
} from "../../store/slices/documentSlice";

export default function DocumentDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentDocument, relatedDocuments, relatedPagination, loading, error } =
    useSelector((state) => state.documents);
  const { userInfo, loading: userLoading } = useSelector((state) => state.user);

  const [relatedPage, setRelatedPage] = useState(1);
  const [sort, setSort] = useState("relevance:desc");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDocumentBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (currentDocument?._id) {
      dispatch(
        fetchRelatedDocuments({
          id: currentDocument._id,
          params: { sort, page: relatedPage },
        })
      );
    }
  }, [dispatch, currentDocument, sort, relatedPage]);

  const handleRelatedPageChange = (page) => {
    setRelatedPage(page);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col justify-center items-center h-96 space-y-6"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-400 rounded-full animate-spin"
              style={{ animationDirection: "reverse" }}
            ></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Đang tải tài liệu...
            </p>
            <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
          </div>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-3xl p-10 text-center shadow-2xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-red-800 mb-3">Có lỗi xảy ra</h3>
            <p className="text-red-600 leading-relaxed">
              {typeof error === "string"
                ? error
                : error.message || "Đã xảy ra lỗi không xác định"}
            </p>
          </div>
        </motion.div>
      );
    }

    if (!currentDocument) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-3xl p-10 text-center shadow-2xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-orange-800 mb-3">
              Không tìm thấy tài liệu
            </h3>
            <p className="text-orange-600 leading-relaxed">
              Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </motion.div>
      );
    }

    const backendUrl = "http://localhost:5000";
    const fullFileUrl = `${backendUrl}${currentDocument.fileUrl}`;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Enhanced Header Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative z-10 p-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent leading-tight">
                      {currentDocument.title}
                    </h1>
                  </div>
                </div>

                {/* Enhanced Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Tác giả
                      </p>
                      <p className="font-semibold text-gray-800">
                        {currentDocument.uploaderId?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Ngày tải lên
                      </p>
                      <p className="font-semibold text-gray-800">
                        {new Date(currentDocument.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                {currentDocument.tags && currentDocument.tags.length > 0 && (
                  <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                      Thẻ
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentDocument.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description Section */}
                {currentDocument.description && (
                  <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                      Mô tả
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {currentDocument.description}
                    </p>
                  </div>
                )}

                {/* Rating Section */}
                <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm mb-6">
                  <RatingStars documentId={currentDocument._id} />
                </div>
              </div>

              {/* Document Thumbnail */}
              {currentDocument.thumbnailUrl && (
                <div className="flex-shrink-0 ml-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={`${backendUrl}${currentDocument.thumbnailUrl}`}
                      alt={currentDocument.title}
                      className="relative w-64 h-80 object-cover rounded-3xl shadow-2xl border-4 border-white/50 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                onClick={() => setIsViewerOpen(true)}
              >
                <Eye size={20} />
                <span>Xem tài liệu</span>
              </motion.button>

              <DownloadButton documentId={currentDocument._id} />

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold bg-white/80 text-gray-700 hover:bg-white border border-gray-200 transition-all duration-300 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/30"
              >
                <Share2 size={20} />
                <span>Chia sẻ</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Document Viewer Modal */}
        <DocumentViewer
          fileUrl={fullFileUrl}
          fileType={currentDocument.mimeType}
          fileName={currentDocument.fileName || currentDocument.title}
          title="Xem nội dung tài liệu"
          height="80vh"
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />

        {/* Enhanced Related Documents Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-blue-50/20 to-purple-50/30"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-teal-100/20 to-transparent rounded-full -translate-y-20 -translate-x-20"></div>

          <div className="relative z-10 p-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Tài liệu liên quan
              </h2>
            </div>
            <DocumentList
              documents={relatedDocuments}
              pagination={relatedPagination}
              onPageChange={handleRelatedPageChange}
              isLoading={loading}
            />
          </div>
        </motion.div>

        {/* Enhanced Comments Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-orange-50/30"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-100/20 to-transparent rounded-full translate-y-20 translate-x-20"></div>

          <div className="relative z-10">
            <CommentSection documentId={currentDocument._id} />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative -mt-16">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.12),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,182,193,0.08),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(173,216,230,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,197,253,0.08),transparent_60%)]"></div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/20 rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-teal-400/25 rounded-full animate-pulse animation-delay-700"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-pink-400/15 rounded-full animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 pt-28 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
