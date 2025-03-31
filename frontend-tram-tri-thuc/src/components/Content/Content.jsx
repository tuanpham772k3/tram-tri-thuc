import React, { useState } from "react";
import {
    FaEdit,
    FaEye,
    FaFolderPlus,
    FaList,
    FaShareAlt,
    FaTh,
    FaTrash,
} from "react-icons/fa";

const files = [
    { name: "Báo cáo.pdf", date: "2025-03-30", size: "1.2MB", sharedBy: "Bạn" },
    {
        name: "Thiết kế.fig",
        date: "2025-03-28",
        size: "850KB",
        sharedBy: "Nhóm",
    },
];
const Content = ({ setModalType }) => {
    const [viewMode, setViewMode] = useState("list");

    return (
        <main className="flex-1 p-4 overflow-auto bg-white shadow-md">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">📂 Tài liệu của bạn</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${viewMode === "list" ? "text-blue-500" : "text-gray-500"}`}
                    >
                        <FaList />
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${viewMode === "grid" ? "text-blue-500" : "text-gray-500"}`}
                    >
                        <FaTh />
                    </button>
                    <button
                        onClick={() => setModalType("createFolder")}
                        className="p-2 text-green-500"
                    >
                        <FaFolderPlus />
                    </button>
                </div>
            </div>
            {viewMode === "list" ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Tên file</th>
                            <th className="p-2 border">Ngày tải</th>
                            <th className="p-2 border">Dung lượng</th>
                            <th className="p-2 border">Người chia sẻ</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, index) => (
                            <tr key={index} className="text-center border">
                                <td className="p-2 border">{file.name}</td>
                                <td className="p-2 border">{file.date}</td>
                                <td className="p-2 border">{file.size}</td>
                                <td className="p-2 border">{file.sharedBy}</td>
                                <td className="p-2 border flex justify-center gap-2">
                                    <FaEye className="cursor-pointer text-blue-500" />
                                    <FaShareAlt
                                        className="cursor-pointer text-green-500"
                                        onClick={() => setModalType("share")}
                                    />
                                    <FaEdit className="cursor-pointer text-yellow-500" />
                                    <FaTrash className="cursor-pointer text-red-500" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg shadow flex flex-col items-center"
                        >
                            <div className="w-16 h-16 bg-gray-300 flex items-center justify-center text-lg font-bold">
                                📄
                            </div>
                            <p className="mt-2 font-semibold">{file.name}</p>
                            <div className="flex gap-2 mt-2">
                                <FaEye className="cursor-pointer text-blue-500" />
                                <FaShareAlt
                                    className="cursor-pointer text-green-500"
                                    onClick={() => setModalType("share")}
                                />
                                <FaEdit className="cursor-pointer text-yellow-500" />
                                <FaTrash className="cursor-pointer text-red-500" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Content;
