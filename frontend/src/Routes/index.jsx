import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../components/Layout/MainLayout";
import UserProfilePage from "../components/User/UserProfilePage";

// Pages – Public
import HomePage from "../pages/Home/HomePage";

// Pages – Auth
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import VerifyEmailPage from "../pages/Auth/VerifyEmailPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";

// Pages – User
import ProfilePage from "../pages/User/ProfilePage";
import NotificationPage from "../pages/Notification/NotificationPage";
import DocumentDetailPage from "../pages/Document/DocumentDetailPage";
import SearchPage from "../pages/Search/SearchPage";
import RatingPage from "../pages/Rating/RatingPage";
import UpgradeAccount from "../pages/UpgradeAccount/UpgradeAccount";
import CheckoutPage from "../pages/Checkout/CheckoutPage";

// Route protection wrappers
import ProtectedRoute from "./ProtectedRoute";
import MyLibraryPage from "../pages/MyLibrary/MyLibraryPage";
import ExplorePage from "../pages/Explore/ExplorePage";
import WishlistPage from "../pages/Wishlist/WishlistPage";
import CartPage from "../pages/Cart/CartPage";
import SellerLayout from "../components/Layout/SellerLayout";
import SellerUploadPage from "../pages/Seller/SellerUploadPage";
import SellerDashboardPage from "../pages/Seller/SellerDashboardPage";
import SellerOrderPage from "../pages/Seller/SellerOrderPage";

const router = createBrowserRouter([
  // =========================
  // AUTH
  // =========================
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify/:userId",
    element: <VerifyEmailPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },

  // =========================
  // Customer
  // =========================
  {
    path: "/",
    element: (
      // <ProtectedRoute>
      <MainLayout />
      // </ProtectedRoute>
    ),
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      { path: "libraries", element: <MyLibraryPage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },

      { path: "documents/:documentId", element: <DocumentDetailPage /> },
      { path: "notifications", element: <NotificationPage /> },
      { path: "upgradeAccount", element: <UpgradeAccount /> },
      { path: "rating", element: <RatingPage /> },
      { path: "search", element: <SearchPage /> },
    ],
  },

  // =========================
  // Seller
  // =========================
  {
    path: "seller",
    element: <SellerLayout />,
    children: [
      { index: true, path: "dashboard", element: <SellerDashboardPage /> },
      { path: "upload", element: <SellerUploadPage /> },
      { path: "sales", element: <SellerOrderPage /> },
    ],
  },

  // =========================
  // 404 – Not Found
  // =========================
  {
    path: "*",
    element: <h1>404 – Không tìm thấy trang</h1>,
  },
]);

export default router;
