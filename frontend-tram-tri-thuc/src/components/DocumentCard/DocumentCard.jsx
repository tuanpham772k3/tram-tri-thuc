import { FaFileExcel, FaFilePdf, FaFileWord, FaImage } from "react-icons/fa";

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

    return (
        <div
            className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                view === "list" ? "flex items-center space-x-4" : ""
            }`}
        >
            {getIcon(document.type)}
            <div className={view === "list" ? "flex-1" : ""}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {document.name}
                </h3>
                {view === "list" && (
                    <>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Loại: {document.type.split("/")[1] || document.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Kích thước: {(document.size / 1024).toFixed(2)} KB
                        </p>
                    </>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(document.uploadDate).toLocaleDateString()}
                </p>
            </div>
            <button
                onClick={() => onPreview()}
                className="text-blue-500 hover:underline transition-colors"
            >
                Preview
            </button>
        </div>
    );
};

export default DocumentCard;
