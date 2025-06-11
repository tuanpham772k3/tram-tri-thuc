import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../components/Layout/AuthLayout";
import MainLayout from "../components/Layout/MainLayout";
import UserProfilePage from "../components/Layout/UserProfilePage";

// Pages – Public
import SearchPage from "../pages/SearchPage";
import HomePage from "../pages/Home/HomePage";
import CategoryPage from "../pages/CategoryPage";
import DocumentDetailPage from "../pages/Document/DocumentDetailPage";

// Pages – Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// Pages – User
import ProfileInfo from "../pages/User/ProfileInfo";
import NotificationPage from "../pages/NotificationPage";
import MyViewedHistory from "../pages/User/MyViewedHistory";
import MyDownloadedHistory from "../pages/User/MyDownloadedHistory";
import MyFavoritesDocuments from "../pages/User/MyFavoritesDocuments";

// Pages – Uploader
import UploadPage from "../pages/Uploader/UploadPage";
import MyDocumentsPage from "../pages/Uploader/MyDocumentsPage";
import EditDocumentPage from "../pages/Uploader/EditDocumentPage";

// Route protection wrappers
import UploaderRoute from "./UploaderRoute";
import RatingPage from "../pages/RatingPage";
import ProtectedRoute from "./ProtectedRoute";
import Checkout from "../pages/Checkout/Checkout";
import UpgradeAccount from "../pages/UpgradeAccount/UpgradeAccount";
import DocumentVipPage from "../pages/Document/DocumentVipPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [{ index: true, element: <HomePage /> }],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "verify/:userId", element: <VerifyEmail /> },
            { path: "reset-password", element: <ResetPassword /> },
            { path: "forgot-password", element: <ForgotPassword /> },
        ],
    },
    {
        path: "/user",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "profile",
                element: <UserProfilePage />,
                children: [
                    { index: true, element: <ProfileInfo /> },
                    { path: "views", element: <MyViewedHistory /> },
                    { path: "downloads", element: <MyDownloadedHistory /> },
                    { path: "favorites", element: <MyFavoritesDocuments /> },
                ],
            },
            { path: "notifications", element: <NotificationPage /> },
        ],
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "upgradeAccount", element: <UpgradeAccount /> },
            { path: "payment", element: <Checkout /> },
            { path: "rating", element: <RatingPage /> },
            { path: "search", element: <SearchPage /> },
            { path: "category/:slug", element: <CategoryPage /> },
            { path: "documents/slug/:slug", element: <DocumentDetailPage /> },
            { path: "/documents/vip", element: <DocumentVipPage /> },
        ],
    },
    {
        path: "/uploader",
        element: (
            <UploaderRoute>
                <MainLayout />
            </UploaderRoute>
        ),
        children: [
            { path: "upload", element: <UploadPage /> },
            { path: "my-documents", element: <MyDocumentsPage /> },
            { path: "edit-document/:documentId", element: <EditDocumentPage /> },
        ],
    },
    {
        path: "*",
        element: <h1>404 – Không tìm thấy trang</h1>,
    },
]);

export default router;
