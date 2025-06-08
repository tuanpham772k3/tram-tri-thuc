import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import showToast from "../../utils/toast";
import customAxios from "../../utils/customAxios";
import { fetchUserInfo } from "./userSlice";

// ========== Thunks ==========

// Đăng ký
export const registerThunk = createAsyncThunk(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await customAxios.post("/auth/register", formData);
            showToast(
                "success",
                res.data.message ||
                    "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
            );
            return res.data.data;
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi đăng ký.";
            showToast("error", message);
            return rejectWithValue({ message });
        }
    }
);

// Đăng nhập
export const loginThunk = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const res = await customAxios.post("/auth/login", credentials);
            if (res.status === 304) {
                throw new Error("Unexpected 304 Not Modified response");
            }
            localStorage.setItem("accessToken", res.data.data.accessToken);
            await dispatch(fetchUserInfo()).unwrap();
            showToast("success", res.data.message || "Đăng nhập thành công!");
            return res.data.data;
        } catch (err) {
            const status = err.response?.status;
            let message = "Lỗi đăng nhập.";
            if (status === 401) {
                message = err.response?.data?.message || "Email hoặc mật khẩu không đúng.";
            } else if (err.code === "ERR_NETWORK") {
                message = "Lỗi kết nối server: Vui lòng kiểm tra kết nối mạng.";
            } else if (status === 403) {
                message = "Tài khoản của bạn đã bị vô hiệu hóa.";
            }
            console.error("Login error:", {
                status,
                data: err.response?.data,
                message: err.message,
                code: err.code,
            });
            return rejectWithValue({ message });
        }
    }
);

// Làm mới token
export const refreshTokenThunk = createAsyncThunk(
    "auth/refresh",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const res = await customAxios.post("/auth/refresh-token", {});
            showToast("success", res.data.message || "Làm mới token thành công!");
            return res.data.data; // { accessToken }
        } catch (err) {
            dispatch(logoutThunk());
            const message = err.response?.data?.message || "Làm mới token thất bại.";
            showToast("error", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            return rejectWithValue({ message });
        }
    }
);

// Đăng xuất
export const logoutThunk = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await customAxios.post("/auth/logout", {});
        showToast("success", "Đăng xuất thành công!");
        return true;
    } catch (err) {
        const message = err.response?.data?.message || "Lỗi đăng xuất.";
        showToast("error", message);
        return rejectWithValue({ message });
    }
});

// Quên mật khẩu
export const forgotPasswordThunk = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const res = await customAxios.post("/auth/forgot-password", { email });
            showToast(
                "success",
                res.data.message || "Link đặt lại mật khẩu đã được gửi tới email của bạn."
            );
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Không thể gửi yêu cầu.";
            showToast("error", message);
            return rejectWithValue({ message });
        }
    }
);

// Đặt lại mật khẩu
export const resetPasswordThunk = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            console.log("Sending reset password request", { token, newPassword });
            const res = await customAxios.post(`/auth/reset-password`, {
                token,
                newPassword,
            });
            console.log("Reset password response", res.data);
            showToast("success", res.data.message || "Mật khẩu được đặt lại thành công!");
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Không thể đặt lại mật khẩu.";
            showToast("error", message);
            return rejectWithValue({ message });
        }
    }
);

// Xác thực email
export const verifyEmailThunk = createAsyncThunk(
    "auth/verifyEmail",
    async ({ userId, verificationCode }, { rejectWithValue }) => {
        try {
            const res = await customAxios.post("/auth/verify-email", { userId, verificationCode });
            showToast("success", res.data.message || "Xác thực email thành công!");
            return res.data;
        } catch (err) {
            const message =
                err.response?.data?.message || err.message || "Xác thực email thất bại.";
            showToast("error", message);
            return rejectWithValue({ message });
        }
    }
);

// Gửi lại email xác thực
export const resendVerificationEmailThunk = createAsyncThunk(
    "auth/resendVerificationEmail",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await customAxios.post(`/auth/resend-verification`, { userId });
            showToast("success", res.data.message || "Gửi lại email xác thực thành công!");
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Không thể gửi lại email xác thực.";
            showToast("error", message);
            return rejectWithValue({ message });
        }
    }
);

// ========== Initial State ==========

const initialState = {
    accessToken: localStorage.getItem("accessToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
    success: false,
    resendSuccess: false,
};

// ========== Helpers ==========

const handlePending = (state) => {
    state.loading = true;
    state.error = null;
    state.success = false;
    state.resendSuccess = false;
};

const handleRejected = (state, action, messageFallback) => {
    state.loading = false;
    state.success = false;
    state.resendSuccess = false;
    const message = action.payload?.message || messageFallback;
    state.error = message;
    if (message.includes("304")) {
        state.error = "Lỗi server: Vui lòng thử lại.";
    }
};

// ========== Slice ==========

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.resendSuccess = false;
        },

        clearAuthState: (state) => {
            state.error = null;
            state.success = false;
            state.resendSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // ========== LOGIN ==========
            .addCase(loginThunk.pending, handlePending)
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.success = true;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                handleRejected(state, action, "Đăng nhập thất bại.");
                state.isAuthenticated = false;
            })
            // ========== REGISTER ==========
            .addCase(registerThunk.pending, handlePending)
            .addCase(registerThunk.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(registerThunk.rejected, (state, action) => {
                handleRejected(state, action, "Đăng ký thất bại.");
            })

            // ========== REFRESH ==========
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                localStorage.setItem("accessToken", action.payload.accessToken);
            })
            .addCase(refreshTokenThunk.rejected, (state) => {
                state.loading = false;
                state.accessToken = null;
                state.isAuthenticated = false;
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
            })

            // ========== LOGOUT ==========
            .addCase(logoutThunk.fulfilled, (state) => {
                state.accessToken = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
                localStorage.removeItem("accessToken");
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                handleRejected(state, action, "Đăng xuất thất bại.");
                state.accessToken = null;
                state.isAuthenticated = false;
                localStorage.removeItem("accessToken");
            })

            // ===== FORGOT PASSWORD =====
            .addCase(forgotPasswordThunk.pending, handlePending)
            .addCase(forgotPasswordThunk.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(forgotPasswordThunk.rejected, (state, action) => {
                handleRejected(state, action, "Không thể gửi yêu cầu.");
            })

            // ===== RESET PASSWORD =====
            .addCase(resetPasswordThunk.pending, handlePending)
            .addCase(resetPasswordThunk.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(resetPasswordThunk.rejected, (state, action) => {
                handleRejected(state, action, "Không thể đặt lại mật khẩu.");
            })

            // ===== VERIFY EMAIL =====
            .addCase(verifyEmailThunk.pending, handlePending)
            .addCase(verifyEmailThunk.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(verifyEmailThunk.rejected, (state, action) => {
                handleRejected(state, action, "Xác thực email thất bại.");
            })

            // ===== RESEND VERIFICATION EMAIL =====
            .addCase(resendVerificationEmailThunk.pending, handlePending)
            .addCase(resendVerificationEmailThunk.fulfilled, (state) => {
                state.loading = false;
                state.resendSuccess = true;
            })
            .addCase(resendVerificationEmailThunk.rejected, (state, action) => {
                handleRejected(state, action, "Không thể gửi lại email xác thực.");
            });
    },
});

export const { resetAuthState, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
