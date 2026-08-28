import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";
import showToast from "../../utils/toast";

// Lấy danh sách tài liệu
export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (params, { rejectWithValue }) => {
    try {
      const response = await customAxios.get("/documents", { params });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Không thể lấy danh sách tài liệu";
      return rejectWithValue(message);
    }
  }
);

// Lấy chi tiết tài liệu theo ID
export const fetchDocumentById = createAsyncThunk(
  "documents/fetchDocumentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customAxios.get(`/documents/${id}`);
      return response.data.data; // document
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy chi tiết tài liệu"
      );
    }
  }
);

// Thêm async thunk để lấy danh sách tài liệu liên quan
export const fetchRelatedDocuments = createAsyncThunk(
  "documents/fetchRelatedDocuments",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await customAxios.get(`/documents/${id}/related`, { params });
      return response.data.data; // { totalItems, totalPages, currentPage, items }
    } catch (error) {
      const message =
        error.response?.data?.message || "Không thể lấy danh sách tài liệu liên quan";
      showToast("error", message);
      return rejectWithValue(message);
    }
  }
);

// ========== Slice ==========
const documentSlice = createSlice({
  name: "documents",
  initialState: {
    documents: [],
    pagination: {},
    loading: false,

    currentDocument: null,
    relatedDocuments: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // fetchDocuments
      .addCase(fetchDocuments.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
      })

      // fetchDocumentById
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.currentDocument = action.payload;
      })

      // fetchRelatedDocuments
      .addCase(fetchRelatedDocuments.fulfilled, (state, action) => {
        state.relatedDocuments = action.payload;
      });
  },
});

export default documentSlice.reducer;
