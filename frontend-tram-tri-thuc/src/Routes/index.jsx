import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../components/Layout/MainLayout";
import UserProfilePage from "../components/Layout/UserProfilePage";

// Pages – Public
import HomePage from "../pages/Home/HomePage";

// Pages – Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// Pages – User
import ProfileInfo from "../pages/User/ProfileInfo";
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
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify/:userId",
    element: <VerifyEmail />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
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
        children: [{ element: <ProfileInfo />, index: true }],
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
