import { Route, Routes } from "react-router-dom";
import Login from "../../components/Auth/Login/Login";
import Register from "../../components/Auth/Register/Register";
import ForgotPassword from "../../components/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../../components/Auth/ResetPassword/ResetPassword";

const RouterCustom = () => {
    return (
        <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Login />} />
        </Routes>
    );
};

export default RouterCustom;
