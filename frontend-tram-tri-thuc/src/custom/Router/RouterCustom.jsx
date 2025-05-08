import { Route, Routes } from "react-router-dom";
import Landing from "../../pages/Landing";
import DocumentList from "../../pages/DocumentList";
import Profile from "../../pages/Profile";
import StorageStats from "../../pages/StorageStats";
import Recent from "../../pages/Recent/Recent";
import Starred from "../../pages/Starred/Starred";
import Trash from "../../pages/Trash/Trash";
import AuthCallback from "../../pages/AuthCallback";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";
import ForgotPassword from "../../components/Auth/ForgotPassword";
import ResetPassword from "../../components/Auth/ResetPassword";
import SharedWithMePage from "../../pages/ShareDocument/SharedWithMePage";
import DocumentDetailPage from "../../pages/DocumentDetailPage";

const RouterCustom = () => {
    return (
        <Routes>
            {/* Lúc chưa đăng nhập */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Lúc đã đăng nhập */}
            <Route path="/home" element={<DocumentList />} />
            <Route path="/documents" element={<DocumentList />} />
            {/* <Route path="/documents/:id" element={<DocumentDetail />} /> */}
            <Route path="/recent" element={<Recent />} />
            <Route path="/starred" element={<Starred />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/storage" element={<StorageStats />} />

            {/* Chia sẻ tài liệu */}
            {/* <Route path="/share/:linkId/:secretKey" element={<SharedDocumentViewer />} /> */}
            <Route path="/shared-with-me" element={<SharedWithMePage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/share/:linkId/:secretKey" element={<DocumentDetailPage />} />
            <Route path="/shared/:id" element={<DocumentDetailPage />} />
        </Routes>
    );
};

export default RouterCustom;
