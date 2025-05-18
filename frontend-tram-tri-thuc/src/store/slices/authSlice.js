import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import showToast from "../../utils/toast";
import { dispatchClearAuth } from "../../utils/authUtils";
import axiosInstance from "../../custom/Axios/AxiosCustom";

// Thunk để gửi yêu cầu đăng ký
export const register = createAsyncThunk(
    "auth/register",
    async ({ name, email, password }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post("/auth/register", {
                name,
                email,
                password,
            });

            const { accessToken, refreshToken } = response.data.data;

            // Lưu token
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // Gọi getProfile để lấy thông tin người dùng
            await dispatch(getProfile()).unwrap();

            return response.data;
        } catch (error) {
            console.error("Register error:", error.response?.data || error.message);
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk để gửi yêu cầu đăng nhập
export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post("/auth/login", credentials);

            // Lưu token trước khi gọi getProfile
            localStorage.setItem("token", response.data.data.accessToken);
            localStorage.setItem("refreshToken", response.data.data.refreshToken);

            try {
                await dispatch(getProfile()).unwrap();
            } catch (profileError) {
                console.error("Failed to fetch profile:", profileError);
                showToast("error", "Đăng nhập thành công nhưng không thể tải thông tin người dùng");
            }

            return response.data;
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            return rejectWithValue(
                error.response?.data || { message: "Login failed due to server error" }
            );
        }
    }
);

// Thunk để lấy thông tin người dùng
export const getProfile = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching profile from /users/me");
        const response = await axiosInstance.get("/users/me");
        console.log("Profile response:", response.data);
        return response.data.data.user; // Lấy user từ response
    } catch (error) {
        console.error("Get profile error:", error.response?.data || error.message);
        const status = error.response?.status;
        const message = error.response?.data?.message || "Failed to fetch profile";

        if (status === 401 && message === "Token không hợp lệ") {
            return rejectWithValue({ code: "ERR_TOKEN_INVALID", message });
        } else if (status === 404) {
            return rejectWithValue({ code: "ERR_USER_NOT_FOUND", message: "User not found" });
        } else if (status === 403) {
            return rejectWithValue({ code: "ERR_USER_INACTIVE", message });
        } else {
            return rejectWithValue({ code: "ERR_SERVER", message });
        }
    }
});

// Cập nhật thông tin user
export const updateUserInfo = createAsyncThunk(
    "auth/updateUserInfo",
    async (updates, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.put("/users/me", updates);
            await dispatch(getProfile()).unwrap();
            showToast("success", "Cập nhật thông tin thành công");
            return response.data.data.user;
        } catch (error) {
            showToast("error", "Cập nhật thông tin thất bại");
            return rejectWithValue(
                error.response?.data?.error || { message: "Failed to update user info" }
            );
        }
    }
);

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
            if (newPassword.length < 6) {
                throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
            }
            const response = await axiosInstance.post("/auth/reset-password", {
                token,
                newPassword,
            });
            return response.data;
        } catch (error) {
            console.error("Reset password error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Thunk cho refresh token
export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (refreshToken, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/refresh-token", { refreshToken });
            return response.data;
        } catch (error) {
            console.error("Refresh token error:", error.response?.data);
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk để xác thực email
export const verifyEmail = createAsyncThunk(
    "auth/verifyEmail",
    async (token, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/verify-email", { token });
            return response.data;
        } catch (error) {
            console.error("Verify email error:", error.response?.data);
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk để gửi lại email xác thực
export const resendVerificationEmail = createAsyncThunk(
    "auth/resendVerificationEmail",
    async (email, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/resend-verification", { email });
            return response.data;
        } catch (error) {
            console.error("Resend verification error:", error.response?.data);
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk để đăng xuất
export const logout = createAsyncThunk("auth/logout", async (_, { getState, rejectWithValue }) => {
    try {
        const { token, refreshToken } = getState().auth;
        if (!refreshToken || !token) {
            throw new Error("No refresh token or access token available");
        }
        // Gọi API logout với accessToken trong header
        const response = await axiosInstance.post(
            "/auth/logout",
            { refreshToken },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Logout error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || { message: "Failed to logout" });
    }
});

export const initializeAuth = createAsyncThunk(
    "auth/initializeAuth",
    async (_, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        const refreshTokenValue = localStorage.getItem("refreshToken");
        if (!token) {
            return rejectWithValue({ message: "No token found" });
        }
        try {
            const response = await dispatch(getProfile(token)).unwrap();
            return response;
        } catch (error) {
            if (error.message.includes("Token không hợp lệ") && refreshTokenValue) {
                try {
                    const newTokens = await dispatch(refreshToken(refreshTokenValue)).unwrap();
                    localStorage.setItem("token", newTokens.data.accessToken);
                    localStorage.setItem("refreshToken", newTokens.data.refreshToken);
                    const response = await dispatch(getProfile(token)).unwrap();
                    return response;
                } catch (refreshError) {
                    await dispatchClearAuth();
                    return rejectWithValue(refreshError);
                }
            }
            await dispatchClearAuth();
            return rejectWithValue(error);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        message: null,
        needsVerification: false,
        isEmailVerified: false,
        updateSuccess: false,
    },
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = !!action.payload.accessToken;
            state.message = "Login successful";
            state.needsVerification = false;
            state.isEmailVerified = true;
            if (action.payload.accessToken) {
                localStorage.setItem("token", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            }
            showToast("success", "Login successful");
        },
        clearAuth: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;
            state.needsVerification = false;
            state.isEmailVerified = false;
            state.updateSuccess = false;
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
        },
        clearUpdateSuccess: (state) => {
            state.updateSuccess = false;
        },
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.needsVerification = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.needsVerification = true;
                state.token = action.payload.data.accessToken;
                state.refreshToken = action.payload.data.refreshToken;
                state.isAuthenticated = true;
                localStorage.setItem("token", action.payload.data.accessToken);
                localStorage.setItem("refreshToken", action.payload.data.refreshToken);
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
                console.log("Login response:", action.payload);
                state.loading = false;
                if (action.payload.data?.accessToken) {
                    state.token = action.payload.data.accessToken;
                    state.refreshToken = action.payload.data.refreshToken;
                    state.isAuthenticated = true;
                    state.message = action.payload.message;
                    state.needsVerification = false;
                    showToast("success", action.payload.message);
                } else {
                    state.error = "Invalid response: Token not found";
                    showToast("error", state.error);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload.errors?.join(", ") || action.payload.message || "Login failed";
                if (action.payload.message.includes("Email not verified")) {
                    state.needsVerification = true;
                }
                showToast("error", state.error);
            });

        // Get Profile
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isEmailVerified = action.payload.isEmailVerified;
                if (!action.payload.isEmailVerified) {
                    state.needsVerification = true;
                }
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.isAuthenticated = false;
                if (action.payload.code === "ERR_TOKEN_INVALID") {
                    showToast("error", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                } else if (action.payload.code === "ERR_USER_NOT_FOUND") {
                    showToast("error", "Tài khoản không tồn tại.");
                } else if (action.payload.code === "ERR_USER_INACTIVE") {
                    showToast("error", "Tài khoản đã bị vô hiệu hóa.");
                } else {
                    showToast("error", "Không thể tải thông tin người dùng.");
                }
            });

        // updateUserInfo
        builder
            .addCase(updateUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(updateUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.updateSuccess = true;
            })
            .addCase(updateUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.updateSuccess = false;
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

        // Refresh Token
        builder
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.data.accessToken;
                state.refreshToken = action.payload.data.refreshToken;
                state.isAuthenticated = true;
                localStorage.setItem("token", action.payload.data.accessToken);
                localStorage.setItem("refreshToken", action.payload.data.refreshToken);
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Refresh token failed";
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                showToast("error", state.error);
            });
        // Verify Email
        builder
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.message = action.payload.message;
                    state.isEmailVerified = action.payload.data.isEmailVerified;
                    state.needsVerification = false;
                    state.token = null;
                    state.refreshToken = null;
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    showToast("success", action.payload.message);
                } else {
                    state.error = action.payload.message || "Email verification failed";
                    showToast("error", state.error);
                }
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Email verification failed";
                showToast("error", state.error);
            });
        // Resend Verification Email
        builder
            .addCase(resendVerificationEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(resendVerificationEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                showToast("success", action.payload.message);
            })
            .addCase(resendVerificationEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Resend verification failed";
                showToast("error", state.error);
            });
        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.token = null;
                state.refreshToken = null;
                state.message = action.payload.message;
                state.needsVerification = false;
                state.isEmailVerified = false;
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                showToast("success", action.payload.message);
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Logout failed";
                showToast("error", state.error);
            });
    },
});

export const { setCredentials, clearAuth, clearUpdateSuccess } = authSlice.actions;
export default authSlice.reducer;
