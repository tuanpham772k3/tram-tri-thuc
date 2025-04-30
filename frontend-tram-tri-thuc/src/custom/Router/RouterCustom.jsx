import { Route, Routes } from "react-router-dom";
import Login from "../../components/Auth/Login/Login";
import Register from "../../components/Auth/Register/Register";
import ForgotPassword from "../../components/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../../components/Auth/ResetPassword/ResetPassword";
import Home from "../../pages/Home/Home";
import Landing from "../../pages/Landing";
import DocumentList from "../../pages/DocumentList";
import DocumentDetail from "../../pages/DocumentDetail";
import Profile from "../../pages/Profile";
import StorageStats from "../../pages/StorageStats";
import Recent from "../../pages/Recent/Recent";
import Starred from "../../pages/Starred/Starred";
import Trash from "../../pages/Trash/Trash";
import SharedWithMePage from "../../pages/SharedWithMePage";
import SharedDocumentViewer from "../../pages/ShareDocument/SharedDocumentViewer";

const RouterCustom = () => {
    return (
        <Routes>
            {/* Lúc chưa đăng nhập */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Lúc đã đăng nhập */}
            <Route path="/home" element={<DocumentList />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/starred" element={<Starred />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/storage" element={<StorageStats />} />

            {/* Chia sẻ tài liệu */}
            <Route path="/share/:linkId/:secretKey" element={<SharedDocumentViewer />} />
            <Route path="/shared-with-me" element={<SharedWithMePage />} />
        </Routes>
    );
};

export default RouterCustom;
