import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";

// Đăng ký
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await customAxios.post("/auth/register", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await customAxios.post("/auth/login", payload);
      localStorage.setItem("accessToken", res.data.data.accessToken);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Làm mới token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await customAxios.post("/auth/refresh-token");
      return res.data.data; // { accessToken }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Đăng xuất
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await customAxios.post("/auth/logout");
    return true;
  } catch (err) {
    return rejectWithValue(err);
  }
});

// Quên mật khẩu
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await customAxios.post("/auth/forgot-password", { email });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Đặt lại mật khẩu
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await customAxios.post(`/auth/reset-password`, {
        token,
        newPassword,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Xác thực email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ userId, verificationCode }, { rejectWithValue }) => {
    try {
      const res = await customAxios.post("/auth/verify-email", {
        userId,
        verificationCode,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Gửi lại email xác thực
export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerificationEmail",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await customAxios.post(`/auth/resend-verification`, { userId });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ========== Initial State ==========
const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  resendSuccess: false,
};

// ========== Slice ==========
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.isAuthenticated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== LOGIN ==========
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
      })

      // ========== REGISTER ==========
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
      })

      // ========== REFRESH ==========
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })

      // ========== LOGOUT ==========
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        localStorage.removeItem("accessToken");
      })

      // ===== FORGOT PASSWORD =====
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      // ===== RESET PASSWORD =====
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      // ===== VERIFY EMAIL =====
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      // ===== RESEND VERIFICATION EMAIL =====
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.resendSuccess = true;
      });
  },
});

export const { clearAuthState } = authSlice.actions;

export default authSlice.reducer;
