import { useState } from "react";
import Home from "./Home/Home";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Home>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Hồ sơ cá nhân
                </h2>
                <div className="flex items-center space-x-4">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Avatar"
                        className="w-24 h-24 rounded-full"
                    />
                    <button className="text-blue-500 hover:underline">
                        Thay đổi ảnh
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300">
                            Tên
                        </label>
                        <input
                            type="text"
                            defaultValue="Nguyễn Văn A"
                            disabled={!isEditing}
                            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            defaultValue="nva@example.com"
                            disabled={!isEditing}
                            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    {isEditing && (
                        <div>
                            <label className="block text-gray-600 dark:text-gray-300">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    )}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isEditing ? "Lưu" : "Chỉnh sửa"}
                    </button>
                </div>
            </div>
        </Home>
    );
};

export default Profile;
