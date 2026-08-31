import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../components/Layout/MainLayout";
import UserProfilePage from "../components/Layout/UserProfilePage";

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
import Checkout from "../pages/Checkout/Checkout";
import UpgradeAccount from "../pages/UpgradeAccount/UpgradeAccount";

// Pages – Uploader
import UploadPage from "../pages/Uploader/UploadPage";
import UploaderDocumentsPage from "../pages/Uploader/UploaderDocumentsPage";
import EditDocumentPage from "../pages/Uploader/EditDocumentPage";

// Route protection wrappers
import UploaderRoute from "./UploaderRoute";
import ProtectedRoute from "./ProtectedRoute";

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
  // USER
  // =========================
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: "profile",
        element: <UserProfilePage />,
        children: [{ element: <ProfilePage />, index: true }],
      },
      { path: "notifications", element: <NotificationPage /> },
      { path: "upgradeAccount", element: <UpgradeAccount /> },
      { path: "payment", element: <Checkout /> },
      { path: "rating", element: <RatingPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "documents/:documentId", element: <DocumentDetailPage /> },
    ],
  },

  // =========================
  // UPLOADER
  // =========================
  {
    path: "/uploader",
    element: (
      <UploaderRoute>
        <MainLayout />
      </UploaderRoute>
    ),
    children: [
      { path: "upload", element: <UploadPage /> },
      { path: "my-documents", element: <UploaderDocumentsPage /> },
      { path: "edit-document/:documentId", element: <EditDocumentPage /> },
    ],
  },
  {
    path: "*",
    element: <h1>404 – Không tìm thấy trang</h1>,
  },
]);

export default router;
