import { clearAuth, refreshToken } from "../store/slices/authSlice";

// Hàm util để dispatch refreshToken thunk
export const dispatchRefreshToken = async (refreshTokenValue) => {
    try {
        // Lazy import store để tránh circular dependency
        const { store } = await import("../store/index");
        const { data } = await store.dispatch(refreshToken(refreshTokenValue)).unwrap();
        return data.data; // { accessToken, refreshToken }
    } catch (error) {
        throw new Error(error.message || "Failed to refresh token");
    }
};

export const dispatchClearAuth = async () => {
    try {
        const { store } = await import("../store/index"); // Lazy import
        store.dispatch(clearAuth());
    } catch (error) {
        throw new Error("Failed to clear auth state");
    }
};
