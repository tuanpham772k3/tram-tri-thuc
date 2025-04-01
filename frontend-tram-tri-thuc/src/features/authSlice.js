import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL của backend (thay đổi theo cấu hình của bạn)
const API_URL = "http://localhost:5000/api/auth";

// Async thunks cho các API
export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            localStorage.setItem("token", response.data.token); // Lưu token vào localStorage
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {
                email,
            });
            return response.data;
        } catch (error) {
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
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Đăng ký thất bại";
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
            state.message = action.payload.message;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Đăng nhập thất bại";
        });

        // Forgot Password
        builder.addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
        });
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Gửi yêu cầu thất bại";
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
