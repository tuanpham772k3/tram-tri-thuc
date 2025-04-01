// src/api/axios.js
import axios from "axios";

// Base URL của backend
const API_URL = "http://localhost:5000/api";

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: API_URL, // URL gốc cho tất cả request
    timeout: 5000, // Thời gian chờ tối đa (5 giây)
    headers: {
        "Content-Type": "application/json", // Header mặc định
    },
});

// Thêm interceptor để xử lý token cho các request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
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
    (response) => {
        return response; // Trả về response nếu thành công
    },
    (error) => {
        // Xử lý lỗi chung (ví dụ: token hết hạn)
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
