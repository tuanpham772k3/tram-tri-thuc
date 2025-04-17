// src/api/axios.js
import axios from "axios";
import { toast } from "react-toastify";

// Base URL của backend
const API_URL = "http://localhost:5000/api";

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: API_URL, // URL gốc cho tất cả request
    timeout: 10000,
    headers: {
        "Content-Type": "application/json", // Header mặc định
    },
});

// Thêm interceptor để xử lý token cho các request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = config.token || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý lỗi cho các response
axiosInstance.interceptors.response.use(
    (response) => response, // Trả về response nếu thành công
    (error) => {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";

        if (status === 401) {
            localStorage.removeItem("token");
            toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        } else if (!error.response) {
            toast.error("Lỗi mạng. Vui lòng kiểm tra kết nối.");
            console.error("🔥 Lỗi mạng chi tiết:", error.message);
            console.log("👉 Request URL:", error.config?.url);
            console.log("👉 Full request config:", error.config);
        } else {
            toast.error(errorMessage);
            console.error("API Error:", errorMessage);
            console.log("👉 Response data:", error.response?.data);
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
