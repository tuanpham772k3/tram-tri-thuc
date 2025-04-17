// src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import {
    FaHome,
    FaFileAlt,
    FaClock,
    FaStar,
    FaTrash,
    FaCloudUploadAlt,
    FaFolderPlus,
    FaChevronDown,
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
        <aside className="h-full bg-white dark:bg-gray-900 flex flex-col overflow-y-auto">
            {/* New button with dropdown */}
            <div className="p-4">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-4 rounded-lg flex items-center justify-center transition duration-150"
                >
                    <FaCloudUploadAlt className="mr-2" />
                    Mới
                    <FaChevronDown className="ml-2 text-xs" />
                </button>

                {isMenuOpen && (
                    <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border dark:border-gray-700 absolute z-10 w-52">
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                setIsModalOpen(true);
                            }}
                            className="w-full px-4 py-3 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FaFolderPlus className="mr-3 text-blue-500" /> Tạo
                            thư mục
                        </button>
                        <button className="w-full px-4 py-3 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FaFileAlt className="mr-3 text-green-500" /> Tải
                            tệp lên
                        </button>
                    </div>
                )}
            </div>

            {/* Navigation menu */}
            <nav className="mt-2 flex-1 px-3">
                <SidebarItem to="/home" icon={<FaHome />} label="Trang chủ" />
                <SidebarItem
                    to="/documents"
                    icon={<FaFileAlt />}
                    label="Trạm của tôi"
                    active
                />
                <SidebarItem to="/recent" icon={<FaClock />} label="Gần đây" />
                <SidebarItem
                    to="/starred"
                    icon={<FaStar />}
                    label="Có gắn dấu sao"
                />
                <SidebarItem to="/trash" icon={<FaTrash />} label="Thùng rác" />

                <div className="mt-6 mb-2">
                    <div className="px-3 flex items-center justify-between">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Thư mục của tôi
                        </h3>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <FaFolderPlus size={14} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                            Đang tải thư mục...
                        </div>
                    ) : rootFolders.length ? (
                        rootFolders.map((folder) => (
                            <SidebarItem
                                key={folder._id}
                                to={`/documents?parentId=${folder._id}`}
                                icon={<FaFolderPlus />}
                                label={folder.name}
                                indented
                            />
                        ))
                    ) : (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                            Chưa có thư mục
                        </div>
                    )}
                </div>
            </nav>

            {/* Storage info */}
            <div className="p-4 mt-auto border-t dark:border-gray-800">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(3.5 / 15) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    3.5 GB / 15 GB đã dùng
                </p>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                    Mua thêm bộ nhớ
                </button>
            </div>

            {/* Create folder modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-w-full">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Tạo thư mục mới
                        </h2>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="w-full px-4 py-2 mb-4 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên thư mục"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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

const SidebarItem = ({ to, icon, label, active = false, indented = false }) => (
    <Link
        to={to}
        className={`flex items-center space-x-3 px-3 py-2 my-1 rounded-lg transition-colors ${
            active
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        } ${indented ? "pl-6" : ""}`}
    >
        <span
            className={`${active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
        >
            {icon}
        </span>
        <span>{label}</span>
    </Link>
);
export default Sidebar;
