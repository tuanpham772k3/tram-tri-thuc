import { useState } from "react";
import { FaChartPie, FaFolder, FaPlus } from "react-icons/fa";

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [folders, setFolders] = useState(["Sách", "Tài liệu của tôi"]);

    const handleCreateFolder = () => {
        if (folderName.trim()) {
            setFolders([...folders, folderName]);
            setFolderName("");
            setIsModalOpen(false);
        }
    };

    return (
        <div className="w-64 bg-gray-100 dark:bg-gray-800 h-screen p-6 shadow-lg">
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mb-6"
            >
                <FaPlus className="mr-2" />
                Tạo thư mục mới
            </button>
            <ul className="space-y-4">
                {folders.map((folder, index) => (
                    <li key={index}>
                        <a
                            href="#"
                            className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors flex items-center"
                        >
                            <FaFolder className="mr-2" /> {folder}
                        </a>
                    </li>
                ))}
                <li>
                    <a
                        href="/storage"
                        className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors flex items-center"
                    >
                        <FaChartPie className="mr-2" /> Thống kê dung lượng
                    </a>
                </li>
            </ul>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Tạo thư mục mới
                        </h3>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Tên thư mục"
                            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Tạo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
