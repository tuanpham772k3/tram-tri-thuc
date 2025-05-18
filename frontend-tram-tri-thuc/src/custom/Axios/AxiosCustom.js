import axios from "axios";
import showToast from "../../utils/toast";
import { dispatchClearAuth, dispatchRefreshToken } from "../../utils/authUtils"; // Import util để dispatch refreshToken

// Base URL của backend
const API_URL = "http://localhost:5000/api/v1";

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để xử lý token cho các request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = config.token || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Axios request with token:", token);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Thêm interceptor để xử lý lỗi và refresh token cho các response
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message;

        // Retry logic cho lỗi mạng
        if (!error.response) {
            if (!originalRequest._retryCount) originalRequest._retryCount = 0;
            if (originalRequest._retryCount < 3) {
                originalRequest._retryCount++;
                const delay = Math.pow(2, originalRequest._retryCount) * 1000;
                await new Promise((resolve) => setTimeout(resolve, delay));
                showToast("info", `Retrying request... (${originalRequest._retryCount}/3)`);
                return axiosInstance(originalRequest);
            }
            showToast("error", "Lỗi mạng. Vui lòng kiểm tra kết nối.");
            console.error("🔥 Lỗi mạng chi tiết:", error.message);
            return Promise.reject(error);
        }

        // Xử lý token hết hạn (401 với message "Token không hợp lệ")
        if (status === 401 && errorMessage === "Token không hợp lệ" && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshTokenValue = localStorage.getItem("refreshToken");

            if (refreshTokenValue) {
                try {
                    // Gọi util để dispatch refreshToken
                    const { accessToken, refreshToken: newRefreshToken } =
                        await dispatchRefreshToken(refreshTokenValue);

                    // Lưu token mới vào localStorage
                    localStorage.setItem("token", accessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);

                    // Cập nhật header và thử lại request gốc
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Handle refresh token failure
                    handleSessionExpired();
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available
                handleSessionExpired();
                return Promise.reject(error);
            }
        } else if (status === 401) {
            // Handle other 401 errors
            handleSessionExpired();
        }

        return Promise.reject(error);
    }
);

function handleSessionExpired() {
    dispatchClearAuth();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    showToast("error", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    if (window.location.pathname !== "/") {
        window.location.href = "/";
    }
}

export default axiosInstance;
