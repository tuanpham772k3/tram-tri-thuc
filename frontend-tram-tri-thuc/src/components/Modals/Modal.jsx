import React from "react";

const Modal = ({ type, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-1/3 shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                    {type === "createFolder"
                        ? "🆕 Tạo thư mục"
                        : "📤 Chia sẻ tài liệu"}
                </h2>
                <p>
                    {type === "createFolder"
                        ? "Nhập tên thư mục mới:"
                        : "Chọn người & quyền truy cập:"}
                </p>
                <input
                    type="text"
                    className="w-full border p-2 my-2"
                    placeholder={
                        type === "createFolder"
                            ? "Tên thư mục"
                            : "Email người nhận"
                    }
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="p-2 bg-gray-300 rounded"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button className="p-2 bg-blue-500 text-white rounded">
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
