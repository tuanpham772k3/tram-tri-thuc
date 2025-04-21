import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../custom/Axios/AxiosCustom";
import showToast from "../../utils/toast";

// Thunk để gửi yêu cầu đăng ký
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Register error:", error.response?.data);
        return rejectWithValue(error.response.data);
    }
});

// Thunk để gửi yêu cầu đăng nhập
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data);
        return rejectWithValue(error.response.data);
    }
});

// Thunk để gửi yêu cầu quên mật khẩu
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/forgot-password", {
                email,
            });
            return response.data;
        } catch (error) {
            console.error("Forgot password error:", error.response?.data);
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk để đặt lại mật khẩu
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/reset-password", {
                token,
                newPassword,
            });
            return response.data;
        } catch (error) {
            console.error("Reset password error:", error.response?.data);
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.message = null;
            state.error = null;
            localStorage.removeItem("token");
            showToast("info", "Logged out successfully");
        },
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                showToast("success", action.payload.message);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload.errors?.join(", ") ||
                    action.payload.message ||
                    "Registration failed";
                showToast("error", state.error);
            });

        // Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data?.token) {
                    state.token = action.payload.data.token;
                    state.message = action.payload.message;
                    localStorage.setItem("token", action.payload.data.token);
                    showToast("success", action.payload.message);
                } else {
                    state.error = "Invalid response: Token not found";
                    showToast("error", state.error);
                    console.error("Login fulfilled but no token in response:", action.payload);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload.errors?.join(", ") || action.payload.message || "Login failed";
                showToast("error", state.error);
            });

        // Forgot Password
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                showToast("success", action.payload.message);
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload.errors?.join(", ") ||
                    action.payload.message ||
                    "Forgot password request failed";
                showToast("error", state.error);
            });

        // Reset Password
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                showToast("success", action.payload.message);
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload.errors?.join(", ") ||
                    action.payload.message ||
                    "Reset password failed";
                showToast("error", state.error);
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
