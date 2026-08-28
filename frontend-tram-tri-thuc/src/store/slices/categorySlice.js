import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";

// Lấy danh sách tất cả danh mục với phân trang
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params, { rejectWithValue }) => {
    try {
      const response = await customAxios.get("/categories", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy danh sách danh mục"
      );
    }
  }
);

// ========== Slice ==========
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
