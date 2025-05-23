import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../components/Layout/AuthLayout";
import MainLayout from "../components/Layout/MainLayout";
import AdminLayout from "../components/Layout/AdminLayout";
import UserProfilePage from "../components/Layout/UserProfilePage";

// Pages – Public
import HomePage from "../pages/Home/HomePage";
import DocumentDetailPage from "../pages/DocumentDetailPage";
import CategoryPage from "../pages/CategoryPage";
import SearchPage from "../pages/SearchPage";

// Pages – Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// Pages – User
import MyDownloadsPage from "../pages/user/MyDownloadsPage";
import MyFavoritesPage from "../pages/user/MyFavoritesPage";
import MyViewsPage from "../pages/user/MyViewsPage";
import ProfileInfo from "../pages/User/ProfileInfo";
import NotificationPage from "../pages/NotificationPage";

// Pages – Uploader
import UploadPage from "../pages/Uploader/UploadPage";
import MyDocumentsPage from "../pages/Uploader/MyDocumentsPage";

// Pages – Admin
// import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
// import UserManagementPage from "@/pages/admin/UserManagementPage";
// import DocumentApprovalPage from "@/pages/admin/DocumentApprovalPage";

// Route protection wrappers
import ProtectedRoute from "./ProtectedRoute";
import UploaderRoute from "./UploaderRoute";
import AdminRoute from "./AdminRoute";
import EditDocumentForm from "../components/Uploader/EditDocumentForm";
import ResetPassword from "../pages/Auth/ResetPassword";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "documents/:slug", element: <DocumentDetailPage /> },
            { path: "category/:slug", element: <CategoryPage /> },
            { path: "search", element: <SearchPage /> },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> },
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
                    { path: "downloads", element: <MyDownloadsPage /> },
                    { path: "favorites", element: <MyFavoritesPage /> },
                    { path: "views", element: <MyViewsPage /> },
                ],
            },
            { path: "notifications", element: <NotificationPage /> },
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
            { path: "edit-document/:documentId", element: <EditDocumentForm /> },
        ],
    },
    // {
    //     path: "/admin",
    //     element: (
    //         <AdminRoute>
    //             <AdminLayout />
    //         </AdminRoute>
    //     ),
    //     children: [
    //         { index: true, element: <AdminDashboardPage /> },
    //         { path: "users", element: <UserManagementPage /> },
    //         { path: "approvals", element: <DocumentApprovalPage /> },
    //     ],
    // },
    {
        path: "*",
        element: <h1>404 – Không tìm thấy trang</h1>,
    },
]);

export default router;
