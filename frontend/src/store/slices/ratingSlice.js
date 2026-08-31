import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";

// Lấy danh sách đánh giá của tài liệu
export const fetchRatingsByDocument = createAsyncThunk(
  "ratings/fetchByDocument",
  async ({ documentId, params }, { rejectWithValue }) => {
    try {
      const res = await customAxios.get(`/ratings/${documentId}`, { params });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Lấy điểm trung bình đánh giá
export const fetchAverageRating = createAsyncThunk(
  "ratings/fetchAverage",
  async (documentId, { rejectWithValue }) => {
    try {
      const res = await customAxios.get(`/ratings/${documentId}/average`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Lấy phân phối đánh giá
export const fetchRatingDistribution = createAsyncThunk(
  "ratings/fetchDistribution",
  async (documentId, { rejectWithValue }) => {
    try {
      const res = await customAxios.get(`/ratings/${documentId}/distribution`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Tạo hoặc cập nhật đánh giá
export const createRating = createAsyncThunk(
  "ratings/createOrUpdate",
  async ({ documentId, score, review }, { rejectWithValue }) => {
    try {
      const res = await customAxios.post(`/ratings/${documentId}`, { score, review });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Xóa đánh giá
export const deleteRating = createAsyncThunk(
  "ratings/delete",
  async (documentId, { rejectWithValue }) => {
    try {
      const res = await customAxios.delete(`/ratings/${documentId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ========== Helpers ==========

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action, messageFallback) => {
  state.loading = false;
  state.error = action.payload || { message: messageFallback };
};

// ========== Slice ==========

const ratingSlice = createSlice({
  name: "ratings",
  initialState: {
    ratings: [], // Danh sách đánh giá
    averageRating: { avgScore: 0, totalRatings: 0 }, // Điểm trung bình
    ratingDistribution: [], // Phân phối đánh giá
    pagination: {},
    loading: false,
  },
  reducers: {
    resetRatingState: (state) => {
      state.ratings = [];
      state.averageRating = { avgScore: 0, totalRatings: 0 };
      state.ratingDistribution = [];
      state.pagination = 0;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Ratings
      .addCase(fetchRatingsByDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRatingsByDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload.ratings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRatingsByDocument.rejected, (state, action) => {
        state.loading = false;
      })

      // Fetch Average Rating
      .addCase(fetchAverageRating.fulfilled, (state, action) => {
        state.averageRating = action.payload;
      })

      // Fetch Rating Distribution
      .addCase(fetchRatingDistribution.fulfilled, (state, action) => {
        state.ratingDistribution = action.payload;
      })

      // Create Rating
      .addCase(createRating.fulfilled, (state, action) => {
        state.ratings.push(action.payload);
      })

      // Delete Rating
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.ratings.filter((item) => item._id !== action.payload._id);
      });
  },
});

export const { resetRatingState } = ratingSlice.actions;
export default ratingSlice.reducer;
