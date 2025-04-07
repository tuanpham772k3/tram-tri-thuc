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

const RouterCustom = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Lúc chưa đăng nhập */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Landing />} />

            {/* Lúc đã đăng nhập */}
            <Route path="/home" element={<DocumentList />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/storage" element={<StorageStats />} />
        </Routes>
    );
};

export default RouterCustom;
