// src/components/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import {
    FaHome,
    FaFileAlt,
    FaClock,
    FaStar,
    FaTrash,
    FaCloudUploadAlt,
    FaFolderPlus,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createFolder, fetchDocuments } from "../../redux/slices/documentSlice";
import { toast } from "react-toastify";

const Sidebar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const dispatch = useDispatch();
    const { documents, loading } = useSelector((state) => state.documents);

    useEffect(() => {
        console.log("Sidebar fetching with parentId: null");
        dispatch(fetchDocuments({ parentId: null })); // Lấy danh sách tài liệu gốc
    }, [dispatch]);

    const rootFolders = documents.filter(
        (doc) => doc.parentId === null && doc.type === "folder"
    );

    // Hàm xử lý sự kiện khi nhấn nút "Tạo thư mục"
    const handleCreateFolder = async () => {
        if (!folderName.trim()) {
            toast.error("Tên thư mục không được để trống");
            return;
        }
        try {
            await dispatch(
                createFolder({ name: folderName, parentId: null })
            ).unwrap();
            toast.success("Tạo thư mục thành công");
            setFolderName("");
            setIsModalOpen(false);
        } catch (error) {
            toast.error(
                "Tạo thư mục thất bại: " +
                    (error.message || "Lỗi không xác định")
            );
            console.error("Create folder error:", error);
        }
    };

    useEffect(() => {
        console.log("Root folders:", rootFolders);
    }, [rootFolders]);

    return (
        <aside className="h-full bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-4 flex flex-col shadow-sm">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-blue-600 text-white w-full py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
            >
                <FaCloudUploadAlt className="mr-2" />
                Mới
            </button>
            {isMenuOpen && (
                <div className="mt-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden shadow-md">
                    <button
                        onClick={() => {
                            setIsMenuOpen(false);
                            setIsModalOpen(true);
                        }}
                        className="w-full px-4 py-2 flex items-center hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <FaFolderPlus className="mr-2" /> Tạo thư mục
                    </button>
                </div>
            )}

            <nav className="mt-6 flex-1 space-y-3 text-sm font-medium">
                <SidebarItem to="/home" icon={<FaHome />} label="Trang chủ" />
                <SidebarItem
                    to="/documents"
                    icon={<FaFileAlt />}
                    label="Trạm của tôi"
                />
                <SidebarItem to="/recent" icon={<FaClock />} label="Gần đây" />
                <SidebarItem to="/starred" icon={<FaStar />} label="Gắn sao" />
                <SidebarItem to="/trash" icon={<FaTrash />} label="Thùng rác" />
                <div className="mt-4">
                    <h3 className="text-gray-700 dark:text-white font-semibold">
                        Thư mục
                    </h3>
                    {loading ? (
                        <p className="text-gray-500">Đang tải thư mục...</p>
                    ) : rootFolders.length ? (
                        rootFolders.map((folder) => (
                            <SidebarItem
                                key={folder._id}
                                to={`/documents?parentId=${folder._id}`}
                                icon={<FaFolderPlus />}
                                label={folder.name}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">Chưa có thư mục</p>
                    )}
                </div>
            </nav>

            <div className="mt-6">
                <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(3.5 / 15) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    3.5 GB / 15 GB đã dùng
                </p>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Tạo thư mục mới
                        </h2>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="w-full px-4 py-2 mb-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên thư mục"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:text-red-500"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Tạo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

const SidebarItem = ({ to, icon, label }) => (
    <Link
        to={to}
        className="flex items-center space-x-2 text-gray-700 dark:text-white hover:text-blue-600 transition"
    >
        {icon}
        <span>{label}</span>
    </Link>
);

export default Sidebar;
