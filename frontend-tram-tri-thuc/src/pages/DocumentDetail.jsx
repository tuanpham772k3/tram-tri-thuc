import Home from "./Home/Home";

const DocumentDetail = () => {
    const document = {
        name: "Tài liệu 1.pdf",
        size: "2.5MB",
        type: "pdf",
        date: "2025-04-01",
    };

    return (
        <Home>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <iframe
                        src="https://via.placeholder.com/500"
                        className="w-full h-96 rounded-lg border"
                        title="Preview"
                    />
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {document.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Kích thước: {document.size}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Định dạng: {document.type}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Ngày tải lên: {document.date}
                    </p>
                    <div className="space-x-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Tải xuống
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </Home>
    );
};

export default DocumentDetail;
