import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import showToast from "../utils/toast";

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        // Lấy token và error từ query parameter
        const query = new URLSearchParams(location.search);
        const token = query.get("token");
        const error = query.get("error");

        if (token) {
            // Lưu token vào localStorage và Redux
            localStorage.setItem("token", token);
            dispatch({ type: "auth/login/fulfilled", payload: { data: { token } } });
            showToast("success", "Đăng nhập bằng Google thành công!");
            navigate("/home");
        } else if (error) {
            // Xử lý lỗi từ backend
            showToast("error", decodeURIComponent(error));
            navigate("/login");
        } else {
            // Nếu không có token hoặc error, redirect về login
            showToast("error", "Đăng nhập bằng Google thất bại!");
            navigate("/login");
        }
    }, [navigate, dispatch, location]);

    return <div>Đang xử lý đăng nhập...</div>;
};

export default AuthCallback;
