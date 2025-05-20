import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import showToast from "../../utils/toast";
import customAxios from "../../utils/customAxios";
import { loginThunk, logoutThunk } from "./authSlice";

// Lấy danh thông tin người dùng
export const fetchUserInfo = createAsyncThunk(
    "user/fetchUserInfo",
    async (_, { rejectWithValue }) => {
        try {
            const response = await customAxios.get("/users/me");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Lỗi khi lấy thông tin người dùng.", error }
            );
        }
    }
);

//  cập nhật thông tin user
export const updateUserInfo = createAsyncThunk(
    "user/updateUserInfo",
    async (data, { rejectWithValue }) => {
        try {
            const allowedFields = ["name", "avatar", "email"];
            const filteredData = {};
            allowedFields.forEach((field) => {
                if (data[field] !== undefined) filteredData[field] = data[field];
            });

            if (Object.keys(filteredData).length === 0) {
                throw new Error("Không có dữ liệu hợp lệ để cập nhật");
            }

            const response = await customAxios.put("/users/me", filteredData);
            showToast("success", response.data.message);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Lỗi khi cập nhật thông tin." }
            );
        }
    }
);

export const deleteMyAccount = createAsyncThunk(
    "user/deleteMyAccount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await customAxios.delete("/users/me");
            showToast("success", response.data.message);
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Lỗi khi xóa tài khoản." });
        }
    }
);

export const fetchUserHistory = createAsyncThunk(
    "user/fetchUserHistory",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await customAxios.get("/users/me/history", { params });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Lỗi khi lấy lịch sử xem." });
        }
    }
);

export const fetchUserFavorites = createAsyncThunk(
    "user/fetchUserFavorites",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await customAxios.get("/users/me/favorites", { params });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Lỗi khi lấy danh sách yêu thích." }
            );
        }
    }
);

export const toggleFavorite = createAsyncThunk(
    "user/toggleFavorite",
    async (docId, { rejectWithValue }) => {
        try {
            const response = await customAxios.patch(`/users/me/favorites/${docId}`);
            showToast("success", response.data.message);
            return response.data.data; // Backend trả về danh sách favorites
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Lỗi khi cập nhật yêu thích." }
            );
        }
    }
);

export const fetchUserDownloads = createAsyncThunk(
    "user/fetchUserDownloads",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await customAxios.get("/users/me/downloads", { params });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Lỗi khi lấy lịch sử tải." });
        }
    }
);

// Initial State
const initialState = {
    userInfo: null,
    history: [],
    favorites: [],
    downloads: [],
    loading: false,
    error: null,
    pagination: {
        history: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 },
        favorites: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 },
        downloads: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 },
    },
};

// ========== Helpers ==========

const handlePending = (state) => {
    state.loading = true;
    state.error = null;
};

const handleRejected = (state, action) => {
    state.loading = false;
    let errorMessage = "Đã xảy ra lỗi không xác định.";
    if (action.payload?.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
    } else if (action.payload?.status === 404) {
        errorMessage = "Không tìm thấy tài nguyên.";
    } else {
        errorMessage = action.payload?.message || action.error?.message || errorMessage;
    }
    state.error = errorMessage;
    console.error("API Error:", action.payload || action.error);
    showToast("error", errorMessage);
};

// ========== Slice ==========

// User Slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetUserState: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        // Đồng bộ với login/logout
        builder
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.userInfo = action.payload.user; // Đồng bộ userInfo ngay sau login
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                return initialState; // Reset userSlice khi logout
            });

        // fetchUserInfo
        builder
            .addCase(fetchUserInfo.pending, handlePending)
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(fetchUserInfo.rejected, handleRejected);

        // updateUserInfo
        builder
            .addCase(updateUserInfo.pending, handlePending)
            .addCase(updateUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(updateUserInfo.rejected, handleRejected);

        // deleteMyAccount
        builder
            .addCase(deleteMyAccount.pending, handlePending)
            .addCase(deleteMyAccount.fulfilled, (state) => {
                state.loading = false;
                state.userInfo = null;
            })
            .addCase(deleteMyAccount.rejected, handleRejected);

        // fetchUserHistory
        builder
            .addCase(fetchUserHistory.pending, handlePending)
            .addCase(fetchUserHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload.items;
                state.pagination.history = {
                    totalItems: action.payload.totalItems,
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                    limit: action.payload.limit,
                };
            })
            .addCase(fetchUserHistory.rejected, handleRejected);

        // fetchUserFavorites
        builder
            .addCase(fetchUserFavorites.pending, handlePending)
            .addCase(fetchUserFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload.items;
                state.pagination.favorites = {
                    totalItems: action.payload.totalItems,
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                    limit: action.payload.limit,
                };
            })
            .addCase(fetchUserFavorites.rejected, handleRejected);

        // toggleFavorite
        builder
            .addCase(toggleFavorite.pending, handlePending)
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload; // Backend trả về danh sách favorites đầy đủ
            })
            .addCase(toggleFavorite.rejected, handleRejected);

        // fetchUserDownloads
        builder
            .addCase(fetchUserDownloads.pending, handlePending)
            .addCase(fetchUserDownloads.fulfilled, (state, action) => {
                state.loading = false;
                state.downloads = action.payload.items;
                state.pagination.downloads = {
                    totalItems: action.payload.totalItems,
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                    limit: action.payload.limit,
                };
            })
            .addCase(fetchUserDownloads.rejected, handleRejected);
    },
});

export const { clearError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
