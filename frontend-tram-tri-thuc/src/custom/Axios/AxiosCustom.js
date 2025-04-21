import axios from "axios";
import showToast from "../../utils/toast";

// Base URL của backend
const API_URL = "http://localhost:5000/api/v1";

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để xử lý token cho các request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = config.token || localStorage.getItem("token");
        if (token) {
            // Kiểm tra token có vẻ hợp lệ (cơ bản)
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const now = Math.floor(Date.now() / 1000);
                if (payload.exp < now) {
                    localStorage.removeItem("token");
                    showToast("error", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }
                    return Promise.reject(new Error("Token expired"));
                }
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error("Invalid token:", error.message);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý lỗi cho các response
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            localStorage.removeItem("token");
            showToast("error", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        } else if (!error.response) {
            showToast("error", "Lỗi mạng. Vui lòng kiểm tra kết nối.");
            console.error("🔥 Lỗi mạng chi tiết:", error.message);
            console.log("👉 Request URL:", error.config?.url);
            console.log("👉 Full request config:", error.config);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
