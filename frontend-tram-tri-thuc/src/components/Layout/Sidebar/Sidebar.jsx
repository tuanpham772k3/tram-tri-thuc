import { NavLink } from "react-router-dom";
import { Bell, FileText, LogOut, Star, Upload, User } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="h-screen -mt-16 pt-16 bg-gradient-to-b from-teal-600 to-cyan-600 shadow-lg relative overflow-hidden">
            {/* Decorative blur effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Content container */}
            <div className="relative z-10">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-cyan-200">📂</span>
                        Điều hướng
                    </h2>
                </div>

                {/* Navigation Links */}
                <nav className="p-4">
                    <div className="space-y-1.5">
                        <NavLink
                            to="/user/profile"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-lg
                                transition-all duration-200 ease-out
                                ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-teal-100 hover:bg-white/5"
                                }
                            `}
                        >
                            <User className="w-[18px] h-[18px]" />
                            <span className="font-normal">Hồ sơ cá nhân</span>
                        </NavLink>

                        <NavLink
                            to="/rating"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-lg
                                transition-all duration-200 ease-out
                                ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-teal-100 hover:bg-white/5"
                                }
                            `}
                        >
                            <Star className="w-[18px] h-[18px]" />
                            <span className="font-normal">Hệ thống đánh giá</span>
                        </NavLink>

                        <NavLink
                            to="/uploader/my-documents"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-lg
                                transition-all duration-200 ease-out
                                ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-teal-100 hover:bg-white/5"
                                }
                            `}
                        >
                            <FileText className="w-[18px] h-[18px]" />
                            <span className="font-normal">Tài liệu của tôi</span>
                        </NavLink>

                        <NavLink
                            to="/uploader/upload"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-lg
                                transition-all duration-200 ease-out
                                ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-teal-100 hover:bg-white/5"
                                }
                            `}
                        >
                            <Upload className="w-[18px] h-[18px]" />
                            <span className="font-normal">Đăng tài liệu</span>
                        </NavLink>

                        <NavLink
                            to="/user/notifications"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-lg
                                transition-all duration-200 ease-out
                                ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-teal-100 hover:bg-white/5"
                                }
                            `}
                        >
                            <Bell className="w-[18px] h-[18px]" />
                            <span className="font-normal">Thông báo</span>
                        </NavLink>

                        {/* Divider */}
                        <div className="my-3 border-t border-white/5"></div>

                        <NavLink
                            to="/auth/logout"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-lg
                                transition-all duration-200 ease-out
                                ${
                                    isActive
                                        ? "bg-red-400/10 text-red-100"
                                        : "text-red-100 hover:bg-red-400/5"
                                }
                            `}
                        >
                            <LogOut className="w-[18px] h-[18px]" />
                            <span className="font-normal">Đăng xuất</span>
                        </NavLink>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
