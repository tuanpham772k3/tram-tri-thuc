import { useState } from "react";
import { Layers, BarChart, Settings, Book, Upload, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SellerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const navItems = [
    { to: "/seller/dashboard", icon: BarChart, label: "Thống kê" },
    { to: "/seller/books", icon: Book, label: "Quản lý sách" },
    { to: "/seller/upload", icon: Upload, label: "Đăng bán sách" },
    { to: "/seller/sales", icon: Layers, label: "Đơn hàng và doanh thu" },
    { to: "/seller/setting", icon: Settings, label: "Cài đặt" },
  ];

  const handleNavigation = (to) => {
    setActiveItem(to);
    navigate(to);
  };

  return (
    <aside className="h-screen z-40 w-14 md:w-64 flex flex-col fixed top-0 left-0 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700">
      {/* Header */}
      <div className="p-2 md:p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart size={20} className="text-white" />
          </div>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quản trị
            </h1>
            <p className="text-slate-400 text-sm">Seller Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 md:p-6 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;

          return (
            <button
              key={to}
              onClick={() => handleNavigation(to)}
              title={label}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative overflow-hidden w-full text-left ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50 hover:scale-[1.01]"
              }`}
            >
              {/* Active indicator */}
              <div
                className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-purple-500 transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                }`}
              />

              {/* Icon */}
              <div
                className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-white/20 shadow-md" : "group-hover:bg-slate-700/50"
                }`}
              >
                <Icon
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Label */}
              <span className="hidden md:block font-medium text-sm tracking-wide">
                {label}
              </span>

              {/* Hover overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300 rounded-xl" />
            </button>
          );
        })}
      </nav>

      {/* Back to Home */}
      <div className="mt-auto p-2 md:p-6 border-t border-slate-700/50">
        <button
          onClick={() => navigate("/")}
          title="Về trang chủ"
          className="group flex items-center gap-3 p-3 rounded-xl w-full text-left text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all duration-300"
        >
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-slate-700/50 transition-colors">
            <Home size={18} />
          </div>

          <span className="hidden md:block font-medium text-sm tracking-wide">
            Về trang chủ
          </span>
        </button>
      </div>
    </aside>
  );
}
