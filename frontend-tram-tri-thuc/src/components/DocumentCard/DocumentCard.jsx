import { FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";

const DocumentCard = ({ document, view }) => {
    const getIcon = (type) => {
        switch (type) {
            case "pdf":
                return <FaFilePdf size={30} className="text-red-500" />;
            case "pptx":
                return (
                    <FaFilePowerpoint size={30} className="text-orange-500" />
                );
            case "docx":
            case "doc":
                return <FaFileWord size={30} className="text-blue-500" />;
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
            <div className="text-3xl">
                {document.type === "pdf" ? "📄" : "📝"}
            </div>
            <div className={view === "list" ? "flex-1" : ""}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {document.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(document.date).toLocaleDateString()}
                </p>
            </div>
            {view === "list" && (
                <button className="text-blue-500 hover:underline transition-colors">
                    Xem chi tiết
                </button>
            )}
        </div>
    );
};

export default DocumentCard;
