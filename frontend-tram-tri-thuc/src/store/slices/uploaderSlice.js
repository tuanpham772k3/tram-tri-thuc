import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";
import showToast from "../../utils/toast";

// Lấy danh sách tài liệu
export const fetchUploaderDocuments = createAsyncThunk(
  "documents/fetchUploaderDocuments",
  async (params, { rejectWithValue }) => {
    try {
      const response = await customAxios.get("/documents/uploader", { params });
      return response.data.data; // { totalItems, totalPages, currentPage, items }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Upload tài liệu mới
export const uploadDocument = createAsyncThunk(
  "documents/uploadDocument",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await customAxios.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data; // document
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Cập nhật tài liệu
export const updateDocument = createAsyncThunk(
  "documents/updateDocument",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await customAxios.patch(`/documents/${id}`, data);
      return response.data.data; // document
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Xóa tài liệu
export const deleteDocument = createAsyncThunk(
  "documents/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customAxios.delete(`/documents/${id}`);
      showToast("success", response.data.message);
      return id; // Trả về id để xóa trong state
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ========== Slice ==========
const documentSlice = createSlice({
  name: "documents",
  initialState: {
    myDocuments: [],
    pagination: {},
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // fetchUploaderDocuments
      .addCase(fetchUploaderDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUploaderDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.myDocuments = action.payload;
        state.pagination = action.payload;
      })
      .addCase(fetchUploaderDocuments.rejected, (state, action) => {
        state.loading = false;
      })

      // uploadDocument
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.myDocuments.push(action.payload);
      })

      // updateDocument
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.myDocuments = state.myDocuments.map((document) =>
          document._id === action.payload._id ? action.payload : document
        );
      })

      // deleteDocument
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.myDocuments = state.myDocuments.filter(
          (document) => document._id !== action.payload
        );
      });
  },
});

export default documentSlice.reducer;
