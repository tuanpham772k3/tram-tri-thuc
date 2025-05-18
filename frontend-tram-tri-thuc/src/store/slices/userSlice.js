import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import showToast from "../../utils/toast";
import axiosInstance from "../../custom/Axios/AxiosCustom";

// Lấy danh sách người dùng
export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/users", { params: { page, limit } });
            return response.data.data;
        } catch (error) {
            showToast("error", "Failed to fetch users");
            return rejectWithValue(
                error.response?.data?.error || { message: "Failed to fetch users" }
            );
        }
    }
);

// Lấy thông tin cá nhân
export const fetchUserInfo = createAsyncThunk(
    "user/fetchUserInfo",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/users/me");
            return response.data.data.user;
        } catch (error) {
            showToast("error", "Failed to fetch user info");
            return rejectWithValue(
                error.response?.data?.error || { message: "Failed to fetch user info" }
            );
        }
    }
);

// Cập nhật thông tin cá nhân
export const updateUserInfo = createAsyncThunk(
    "user/updateUserInfo",
    async (updates, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/users/me", updates);
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

// Lấy lịch sử xem
export const fetchUserHistory = createAsyncThunk(
    "user/fetchUserHistory",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/users/history", { params: { page, limit } });
            return response.data.data;
        } catch (error) {
            showToast("error", "Failed to fetch user history");
            return rejectWithValue(
                error.response?.data?.error || { message: "Failed to fetch user history" }
            );
        }
    }
);

// Lấy lịch sử tải
export const fetchUserDownloads = createAsyncThunk(
    "user/fetchUserDownloads",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/users/downloads", {
                params: { page, limit },
            });
            return response.data.data;
        } catch (error) {
            showToast("error", "Failed to fetch user downloads");
            return rejectWithValue(
                error.response?.data?.error || { message: "Failed to fetch user downloads" }
            );
        }
    }
);

// Lấy danh sách yêu thích
export const fetchUserFavorites = createAsyncThunk(
    "user/fetchUserFavorites",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/users/favorites", {
                params: { page, limit },
            });
            return response.data.data;
        } catch (error) {
            showToast("error", "Failed to fetch user favorites");
            return rejectWithValue(
                error.response?.data?.error || { message: "Failed to fetch user favorites" }
            );
        }
    }
);

// Thêm/xóa yêu thích
export const toggleFavorite = createAsyncThunk(
    "user/toggleFavorite",
    async (docId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/users/favorites/${docId}`);
            return response.data.data.favoriteDocuments;
        } catch (error) {
            showToast("error", "Failed to toggle favorite");
            return rejectWithValue(
                error.response?.data?.error || { message: "Failed to toggle favorite" }
            );
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        list: [],
        history: [],
        downloads: [],
        favorites: [],
        pagination: {
            history: { page: 1, limit: 10, total: 0, totalPages: 0 },
            downloads: { page: 1, limit: 10, total: 0, totalPages: 0 },
            favorites: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
        loading: false,
        error: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        logoutUser: (state) => {
            state.currentUser = null;
            state.history = [];
            state.downloads = [];
            state.favorites = [];
            state.pagination = {
                history: { page: 1, limit: 10, total: 0, totalPages: 0 },
                downloads: { page: 1, limit: 10, total: 0, totalPages: 0 },
                favorites: { page: 1, limit: 10, total: 0, totalPages: 0 },
            };
        },
    },

    extraReducers: (builder) => {
        // fetchUsers
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.users;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // fetchUserInfo
            .addCase(fetchUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // fetchUserHistory
            .addCase(fetchUserHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload.history;
                state.pagination.history = action.payload.pagination;
            })
            .addCase(fetchUserHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // fetchUserDownloads
            .addCase(fetchUserDownloads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDownloads.fulfilled, (state, action) => {
                state.loading = false;
                state.downloads = action.payload.downloads;
                state.pagination.downloads = action.payload.pagination;
            })
            .addCase(fetchUserDownloads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // fetchUserFavorites
            .addCase(fetchUserFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload.favorites;
                state.pagination.favorites = action.payload.pagination;
            })
            .addCase(fetchUserFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // toggleFavorite
            .addCase(toggleFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload;
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { setCurrentUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
