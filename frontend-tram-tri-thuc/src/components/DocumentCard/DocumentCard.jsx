import {
    FaDownload,
    FaEye,
    FaFileExcel,
    FaFilePdf,
    FaFileWord,
    FaImage,
} from "react-icons/fa";

const DocumentCard = ({ document, view, onPreview }) => {
    const getIcon = (type) => {
        switch (type) {
            case "application/pdf":
                return <FaFilePdf size={30} className="text-red-500" />;
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return <FaFileWord size={30} className="text-blue-500" />;
            case "application/vnd.ms-excel":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return <FaFileExcel size={30} className="text-green-500" />;
            case "image/jpeg":
            case "image/png":
                return <FaImage size={30} className="text-purple-500" />;
            default:
                return <FaFilePdf size={30} className="text-gray-500" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (view === "grid") {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Icon header */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 flex items-center">
                    {getIcon(document.type)}
                    <div className="ml-3 flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                            {document.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(document.size)} •{" "}
                            {formatDate(document.uploadDate)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end space-x-2">
                    <a
                        href={document.directUrl}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        title="Tải xuống"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaDownload size={16} />
                    </a>
                    <button
                        onClick={() => onPreview()}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
                        title="Xem trước"
                    >
                        <FaEye size={16} /> Xem
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center p-4 group">
            <div className="mr-4">{getIcon(document.type)}</div>
            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {document.name}
                </h3>
                <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>Loại: {document.type.split("/")[1] || document.type}</p>
                    <p>Kích thước: {formatFileSize(document.size)}</p>
                    <p>Ngày tải lên: {formatDate(document.uploadDate)}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <a
                    href={document.directUrl}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    title="Tải xuống"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaDownload size={16} />
                </a>
                <button
                    onClick={() => onPreview()}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
                >
                    <FaEye size={16} /> Xem
                </button>
            </div>
        </div>
    );
};

export default DocumentCard;
