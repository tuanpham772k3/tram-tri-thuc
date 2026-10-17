import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  UserCircle,
  Search,
  Menu,
  Heart,
  LogOut,
  ChevronDown,
  ShoppingCart,
  UserRound,
  Library,
  Gem,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import showToast from "../../../utils/toast";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { logout } from "../../../store/slices/authSlice";
import { fetchUserInfo } from "../../../store/slices/userSlice";
import { Dropdown, Space } from "antd";
import SearchBar from "../../UI/SearchBar";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/explore", label: "Khám phá" },
  { to: "/libraries", label: "Sách của tôi" },
];

const items = [
  {
    key: "1",
    label: "My Account",
    disabled: true,
  },
  {
    type: "divider",
  },

  {
    key: "2",
    label: "My Profile",
    icon: <UserRound size={16} />,
  },
  {
    key: "3",
    label: "My Library",
    icon: <Library size={16} />,
  },
  {
    key: "4",
    label: "My Orders",
    icon: <ShoppingCart size={16} />,
  },
  {
    key: "5",
    label: "Become a seller",
    icon: <Gem size={16} />,
  },
  {
    key: "6",
    label: "Logout",
    icon: <LogOut size={16} />,
    danger: true,
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const {
    userInfo,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Lấy thông tin người dùng khi đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, isAuthenticated]);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setTimeout(() => navigate("/"), 100);
    } catch (error) {
      showToast(error);
    }
  };

  return (
    <motion.nav className="bg-violet-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-white"
          >
            <span className="hidden sm:block">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="nav-link flex items-center space-x-1 text-white hover:text-violet-200
                transition-colors px-3 py-2 rounded-md text-base font-medium"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <div>
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="text-white hover:text-violet-200 transition-colors p-2"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-white hover:text-violet-200 transition-colors p-2"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Notifications */}
            <Link
              to="/user/notifications"
              className="relative text-white hover:text-violet-200 transition-colors p-2"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>

            {/* User Menu */}
            {true ? (
              authLoading || userLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <button
                      className="flex items-center space-x-2 cursor-pointer rounded-full overflow-hidden
                      ring-2 ring-violet-500 hover:ring-white transition-colors"
                    >
                      <img
                        src={userInfo?.avatar || "/src/assets/avatar_default.jpg"}
                        alt="User Avatar"
                        className="w-8 h-8 object-cover"
                      />
                    </button>

                    <ChevronDown size={20} className="text-white" />
                  </div>
                </Dropdown>
              )
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 text-white bg-violet-500 hover:bg-violet-600 px-4 py-2 rounded-xl text-base font-medium transition-colors"
              >
                <UserCircle className="w-5 h-5" />
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
