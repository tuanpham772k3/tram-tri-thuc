import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import showToast from "../../utils/toast";
import { jwtDecode } from "jwt-decode";
import { getProfile, setCredentials } from "../../store/slices/authSlice";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { dispatchClearAuth, dispatchRefreshToken } from "../../utils/authUtils";

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Lấy accessToken, refreshToken và error từ query parameter
        const query = new URLSearchParams(location.search);
        const accessToken = query.get("accessToken");
        const refreshToken = query.get("refreshToken");
        const error = query.get("error");

        if (accessToken && refreshToken) {
            try {
                // Verify accessToken
                const decoded = jwtDecode(accessToken);
                if (!decoded.userId) throw new Error("Invalid access token");
                // Lưu token vào Redux store
                dispatch(setCredentials({ accessToken, refreshToken }));
                // Gọi getProfile để lấy thông tin user (bao gồm avatar)
                dispatch(getProfile(accessToken))
                    .then((result) => {
                        if (result.meta.requestStatus === "fulfilled") {
                            const user = result.payload;
                            console.log("🔍 User profile:", user);
                            navigate("/");
                        } else {
                            throw new Error("Failed to fetch profile");
                        }
                    })
                    .catch(async () => {
                        try {
                            const newTokens = await dispatchRefreshToken(refreshToken);
                            dispatch(setCredentials(newTokens));
                            await dispatch(getProfile(newTokens.accessToken)).unwrap();
                            navigate("/");
                        } catch (refreshError) {
                            console.error("Refresh token error:", refreshError);
                            dispatchClearAuth();
                            localStorage.removeItem("token");
                            localStorage.removeItem("refreshToken");
                            showToast("error", "Phiên đăng nhập Google hết hạn. Vui lòng thử lại.");
                            navigate("/auth/login");
                        }
                    });
            } catch (err) {
                console.error("Error processing tokens:", err);
                dispatchClearAuth();
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                showToast("error", "Lỗi khi xử lý token Google!");
                navigate("/auth/login");
            }
        } else if (error) {
            // Xử lý lỗi từ backend
            console.error("Google OAuth error:", decodeURIComponent(error));
            showToast("error", decodeURIComponent(error));
            navigate("/auth/login");
        } else {
            // Nếu thiếu token hoặc error
            console.error("Invalid Google OAuth callback: Missing tokens");
            showToast("error", "Đăng nhập bằng Google thất bại! Vui lòng thử lại.");
            navigate("/auth/login");
        }
        setIsLoading(false);
    }, [navigate, dispatch, location]);

    return isLoading ? <LoadingSpinner size="large" /> : <div>Đã xử lý đăng nhập</div>;
};

export default AuthCallback;
