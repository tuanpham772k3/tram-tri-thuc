import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";

// Lấy danh sách tất cả danh mục
export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await customAxios.get("/categories");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể lấy danh sách danh mục"
            );
        }
    }
);

// Lấy chi tiết danh mục theo slug
export const fetchCategoryBySlug = createAsyncThunk(
    "categories/fetchCategoryBySlug",
    async (slug, { rejectWithValue }) => {
        try {
            const response = await customAxios.get(`/categories/${slug}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể lấy chi tiết danh mục"
            );
        }
    }
);

// Tạo danh mục mới (admin)
export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await customAxios.post("/categories", data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể tạo danh mục");
        }
    }
);

// Cập nhật danh mục (admin)
export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await customAxios.patch(`/categories/${id}`, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể cập nhật danh mục");
        }
    }
);

// Xóa danh mục (admin)
export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            await customAxios.delete(`/categories/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể xóa danh mục");
        }
    }
);

// ========== Helpers ==========

const handlePending = (state) => {
    state.loading = true;
    state.error = null;
};

const handleRejected = (state, action) => {
    state.loading = false;
    state.error = action.payload || "Đã xảy ra lỗi không xác định";
};

// ========== Slice ==========

const categorySlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        currentCategory: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchCategories
        builder
            .addCase(fetchCategories.pending, handlePending)
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, handleRejected)
            // fetchCategoryBySlug
            .addCase(fetchCategoryBySlug.pending, handlePending)
            .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCategory = action.payload;
            })
            .addCase(fetchCategoryBySlug.rejected, handleRejected)
            // createCategory
            .addCase(createCategory.pending, handlePending)
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, handleRejected)
            // updateCategory
            .addCase(updateCategory.pending, handlePending)
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.map((cat) =>
                    cat._id === action.payload._id ? action.payload : cat
                );
                if (state.currentCategory?._id === action.payload._id) {
                    state.currentCategory = action.payload;
                }
            })
            .addCase(updateCategory.rejected, handleRejected)
            // deleteCategory
            .addCase(deleteCategory.pending, handlePending)
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter((cat) => cat._id !== action.payload);
                if (state.currentCategory?._id === action.payload) {
                    state.currentCategory = null;
                }
            })
            .addCase(deleteCategory.rejected, handleRejected);
    },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
