import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  FileText,
  Download,
  ExternalLink,
  AlertCircle,
  Eye,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";

export default function DocumentViewer({
  fileUrl,
  fileType,
  fileName,
  title = "Xem nội dung tài liệu",
  className = "",
  showHeader = true,
  height = "80vh",
  isOpen = false,
  onClose = () => {},
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const getFileIcon = (type) => {
    if (!type) return File;
    if (type.includes("pdf")) return FileText;
    if (type.includes("image")) return FileImage;
    if (type.includes("video")) return FileVideo;
    if (type.includes("audio")) return FileAudio;
    return File;
  };

  const getFileTypeDisplay = (type) => {
    if (!type) return "Không xác định";
    const typeMap = {
      "application/pdf": "PDF",
      "image/jpeg": "JPEG",
      "image/png": "PNG",
      "image/gif": "GIF",
      "image/webp": "WebP",
      "video/mp4": "MP4",
      "video/webm": "WebM",
      "audio/mp3": "MP3",
      "audio/wav": "WAV",
      "text/plain": "Text",
    };
    return typeMap[type] || type.split("/")[1]?.toUpperCase() || "Không xác định";
  };

  const renderViewer = () => {
    if (!fileUrl) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
          <div className="relative z-10">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <FileText className="w-10 h-10 text-gray-500" />
            </motion.div>
            <h4 className="text-xl font-bold text-gray-700 mb-3">
              Không có file đính kèm
            </h4>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              Tài liệu này không có file đính kèm để xem trước. Vui lòng kiểm tra lại hoặc
              liên hệ người tải lên.
            </p>
          </div>
        </motion.div>
      );
    }

    if (hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-100/30 to-pink-100/30"></div>
          <div className="relative z-10">
            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <AlertCircle className="w-10 h-10 text-red-500" />
            </motion.div>
            <h4 className="text-xl font-bold text-red-800 mb-3">Lỗi tải tài liệu</h4>
            <p className="text-red-600 mb-6 max-w-sm mx-auto leading-relaxed">
              Không thể tải tài liệu. Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                <span>Thử lại</span>
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-medium shadow-lg shadow-gray-500/25 flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                <span>Mở trong tab mới</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      );
    }

    if (fileType === "application/pdf") {
      return (
        <div
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-inner border border-gray-200"
          style={{ height }}
        >
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-10"
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      Đang tải PDF...
                    </p>
                    <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <Viewer
              fileUrl={fileUrl}
              plugins={[defaultLayoutPluginInstance]}
              onDocumentLoad={handleLoad}
            />
          </Worker>
        </div>
      );
    }

    // Image Viewer
    if (fileType?.includes("image")) {
      return (
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden p-6 border border-gray-200">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-10"
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animate-reverse"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      Đang tải hình ảnh...
                    </p>
                    <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={fileUrl}
            alt={fileName || "Document image"}
            className="w-full h-auto max-h-96 object-contain mx-auto rounded-2xl shadow-xl border border-white/50"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      );
    }

    // Video Viewer
    if (fileType?.includes("video")) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700"
        >
          <video
            src={fileUrl}
            controls
            className="w-full h-auto max-h-96 rounded-2xl"
            onLoadedData={handleLoad}
            onError={handleError}
          >
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </motion.div>
      );
    }

    // Audio Viewer
    if (fileType?.includes("audio")) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center relative overflow-hidden border border-blue-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30"></div>
          <div className="relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <FileAudio className="w-10 h-10 text-blue-600" />
            </motion.div>
            <h4 className="text-xl font-bold text-gray-700 mb-6">File âm thanh</h4>
            <audio
              src={fileUrl}
              controls
              className="w-full max-w-md mx-auto rounded-xl shadow-lg"
              onLoadedData={handleLoad}
              onError={handleError}
            >
              Trình duyệt của bạn không hỗ trợ audio.
            </audio>
          </div>
        </motion.div>
      );
    }

    // Text files
    if (fileType?.includes("text")) {
      return (
        <div
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner"
          style={{ height }}
        >
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-10"
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-pink-400 rounded-full animate-spin animate-reverse"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      Đang tải văn bản...
                    </p>
                    <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <iframe
            src={fileUrl}
            className="w-full h-full border-0 rounded-3xl"
            title="Text Viewer"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      );
    }

    // Unsupported file types
    const FileIcon = getFileIcon(fileType);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-12 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/30 to-orange-100/30"></div>
        <div className="relative z-10">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <FileIcon className="w-10 h-10 text-yellow-600" />
          </motion.div>
          <h4 className="text-xl font-bold text-yellow-800 mb-3">Không thể xem trước</h4>
          <p className="text-yellow-700 mb-6 max-w-sm mx-auto leading-relaxed">
            Không thể xem trước tài liệu loại {getFileTypeDisplay(fileType)} trực tiếp.
            Bạn có thể tải xuống để xem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={fileUrl}
              download={fileName}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              <span>Tải xuống</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-medium shadow-lg shadow-gray-500/25 flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              <span>Mở trong tab mới</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm h-screen"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative mt-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-6xl w-full mx-4 ${
              isFullscreen ? "h-[95vh]" : ""
            } ${className}`}
          >
            {/* Control Bar */}
            <div className="absolute top-10 right-4 flex items-center gap-2 z-20">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 hover:text-gray-800 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 shadow-lg"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 shadow-lg"
              >
                <X size={20} />
              </motion.button>
            </div>

            {showHeader && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 pb-2 border-b border-gray-200/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {title}
                    </h3>
                    {fileName && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <span className="font-medium">{fileName}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                          {getFileTypeDisplay(fileType)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-2"
            >
              {renderViewer()}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
