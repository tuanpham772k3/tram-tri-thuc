import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";

// Lấy danh sách bình luận của tài liệu
export const fetchCommentsByDocument = createAsyncThunk(
  "comments/fetchByDocument",
  async ({ documentId, params }, { rejectWithValue }) => {
    try {
      const res = await customAxios.get(`/comments/${documentId}`, { params });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Tạo bình luận
export const createComment = createAsyncThunk(
  "comments/create",
  async ({ documentId, content }, { rejectWithValue }) => {
    try {
      const res = await customAxios.post(`/comments/${documentId}`, { content });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Cập nhật bình luận
export const updateComment = createAsyncThunk(
  "comments/update",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const res = await customAxios.put(`/comments/${commentId}`, { content });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Xóa bình luận
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await customAxios.delete(`/comments/${commentId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Báo cáo bình luận
export const reportComment = createAsyncThunk(
  "comments/report",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await customAxios.post(`/comments/${commentId}/report`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ========== Slice ==========
const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    pagination: {},
    loading: false,
  },
  reducers: {
    resetCommentState: (state) => {
      state.comments = [];
      state.pagination = {};
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchCommentsByDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsByDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByDocument.rejected, (state, action) => {
        state.loading = false;
      })

      // Create Comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      // Update Comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex((item) => item._id === action.payload._id);

        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments.filter((item) => item._id !== action.payload._id);
      });
  },
});

export const { resetCommentState } = commentSlice.actions;
export default commentSlice.reducer;
