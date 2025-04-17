/**
 * Utility functions for API calls and error handling
 */
import axiosInstance from "../custom/Axios/AxiosCustom"; // Cập nhật đường dẫn đúng với axiosInstance

/**
 * Make an API call with authentication
 * @param {Object} config - Axios config (method, url, data, params, headers)
 * @param {string} token - Authentication token
 * @returns {Promise} API response data
 * @throws {Error} API error with message
 */
export const makeApiCall = async (config, token) => {
    if (!token) {
        throw new Error("No token available");
    }

    try {
        const response = await axiosInstance({
            ...config,
            headers: {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        }
        throw new Error(
            error.response?.data?.message ||
                `Failed to ${config.method} ${config.url}`
        );
    }
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid
 */
export const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
