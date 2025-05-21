import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";

// Lấy danh sách tài liệu với bộ lọc và phân trang
export const fetchDocuments = createAsyncThunk(
    "documents/fetchDocuments",
    async (params, { rejectWithValue }) => {
        try {
            const response = await customAxios.get("/documents", { params });
            return response.data.data; // { totalItems, totalPages, currentPage, items }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể lấy danh sách tài liệu"
            );
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

// Lấy chi tiết tài liệu theo slug
export const fetchDocumentBySlug = createAsyncThunk(
    "documents/fetchDocumentBySlug",
    async (slug, { rejectWithValue }) => {
        try {
            const response = await customAxios.get(`/documents/slug/${slug}`);
            return response.data.data; // document
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể lấy chi tiết tài liệu"
            );
        }
    }
);

// Tải file tài liệu
export const downloadDocument = createAsyncThunk(
    "documents/downloadDocument",
    async (id, { rejectWithValue, getState }) => {
        try {
            // Lấy thông tin tài liệu để có fileName
            const state = getState();
            const document =
                state.documents.currentDocument ||
                state.documents.documents.find((doc) => doc._id === id) ||
                state.documents.myDocuments.find((doc) => doc._id === id);

            const response = await customAxios.get(`/documents/download/${id}`, {
                responseType: "blob",
            });

            const fileName = document?.fileName || `document-${id}`;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải tài liệu");
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
            return rejectWithValue(error.response?.data?.message || "Không thể upload tài liệu");
        }
    }
);

// Lấy danh sách tài liệu của người dùng
export const fetchMyDocuments = createAsyncThunk(
    "documents/fetchMyDocuments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await customAxios.get("/documents/me");
            return response.data.data; // documents array
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể lấy danh sách tài liệu cá nhân"
            );
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
            return rejectWithValue(error.response?.data?.message || "Không thể cập nhật tài liệu");
        }
    }
);

// Xóa tài liệu
export const deleteDocument = createAsyncThunk(
    "documents/deleteDocument",
    async (id, { rejectWithValue }) => {
        try {
            await customAxios.delete(`/documents/${id}`);
            return id; // Trả về id để xóa trong state
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể xóa tài liệu");
        }
    }
);

// Duyệt tài liệu (admin)
export const approveDocument = createAsyncThunk(
    "documents/approveDocument",
    async (id, { rejectWithValue }) => {
        try {
            const response = await customAxios.patch(`/documents/approve/${id}`);
            return response.data.data; // document
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể duyệt tài liệu");
        }
    }
);

// Gắn/bỏ nổi bật tài liệu (admin)
export const featureDocument = createAsyncThunk(
    "documents/featureDocument",
    async (id, { rejectWithValue }) => {
        try {
            const response = await customAxios.patch(`/documents/feature/${id}`);
            return response.data.data; // document
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể cập nhật trạng thái nổi bật"
            );
        }
    }
);

// Lấy danh sách tài liệu nổi bật
export const fetchFeaturedDocuments = createAsyncThunk(
    "documents/fetchFeaturedDocuments",
    async (params, { rejectWithValue }) => {
        try {
            const response = await customAxios.get("/documents/featured", { params });
            return response.data.data; // { totalItems, totalPages, currentPage, items }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể lấy danh sách tài liệu nổi bật"
            );
        }
    }
);

// ========== Slice ==========

const documentSlice = createSlice({
    name: "documents",
    initialState: {
        documents: [], // Danh sách tài liệu công khai
        featuredDocuments: [], // Danh sách tài liệu nổi bật
        currentDocument: null, // Chi tiết tài liệu hiện tại
        myDocuments: [], // Danh sách tài liệu của user
        loading: false,
        error: null,
        pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
        },
        featuredPagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
        },
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.loading = true;
            state.error = null;
        };

        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload || "Đã xảy ra lỗi không xác định";
        };

        builder
            // fetchDocuments
            .addCase(fetchDocuments.pending, handlePending)
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload.items;
                state.pagination = {
                    totalItems: action.payload.totalItems,
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                };
            })
            .addCase(fetchDocuments.rejected, handleRejected)
            // fetchFeaturedDocuments
            .addCase(fetchFeaturedDocuments.pending, handlePending)
            .addCase(fetchFeaturedDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.featuredDocuments = action.payload.items;
                state.featuredPagination = {
                    totalItems: action.payload.totalItems,
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                };
            })
            .addCase(fetchFeaturedDocuments.rejected, handleRejected)
            // fetchDocumentById
            .addCase(fetchDocumentById.pending, handlePending)
            .addCase(fetchDocumentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDocument = action.payload;
            })
            .addCase(fetchDocumentById.rejected, handlePending)
            .addCase(fetchDocumentBySlug.pending, handlePending)
            .addCase(fetchDocumentBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDocument = action.payload;
            })
            .addCase(fetchDocumentBySlug.rejected, handleRejected)
            // downloadDocument
            .addCase(downloadDocument.pending, handlePending)
            .addCase(downloadDocument.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(downloadDocument.rejected, handleRejected)
            // uploadDocument
            .addCase(uploadDocument.pending, handlePending)
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.myDocuments.push(action.payload);
            })
            .addCase(uploadDocument.rejected, handleRejected)
            // fetchMyDocuments
            .addCase(fetchMyDocuments.pending, handlePending)
            .addCase(fetchMyDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.myDocuments = action.payload;
            })
            .addCase(fetchMyDocuments.rejected, handleRejected)
            // updateDocument
            .addCase(updateDocument.pending, handlePending)
            .addCase(updateDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.myDocuments = state.myDocuments.map((doc) =>
                    doc._id === action.payload._id ? action.payload : doc
                );
                state.documents = state.documents.map((doc) =>
                    doc._id === action.payload._id ? action.payload : doc
                );
                state.featuredDocuments = state.featuredDocuments.map((doc) =>
                    doc._id === action.payload._id ? action.payload : doc
                );
                if (state.currentDocument?._id === action.payload._id) {
                    state.currentDocument = action.payload;
                }
            })
            .addCase(updateDocument.rejected, handleRejected)
            // deleteDocument
            .addCase(deleteDocument.pending, handlePending)
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.myDocuments = state.myDocuments.filter((doc) => doc._id !== action.payload);
                state.documents = state.documents.filter((doc) => doc._id !== action.payload);
                state.featuredDocuments = state.featuredDocuments.filter(
                    (doc) => doc._id !== action.payload
                );
                if (state.currentDocument?._id === action.payload) {
                    state.currentDocument = null;
                }
            })
            .addCase(deleteDocument.rejected, handleRejected)
            // approveDocument
            .addCase(approveDocument.pending, handlePending)
            .addCase(approveDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = state.documents.map((doc) =>
                    doc._id === action.payload._id ? action.payload : doc
                );
                state.myDocuments = state.myDocuments.map((doc) =>
                    doc._id === action.payload._id ? action.payload : doc
                );
                state.featuredDocuments = state.featuredDocuments.map((doc) =>
                    doc._id === action.payload._id ? action.payload : doc
                );
                if (state.currentDocument?._id === action.payload._id) {
                    state.currentDocument = action.payload;
                }
            })
            .addCase(approveDocument.rejected, handleRejected)
            // featureDocument
            .addCase(featureDocument.pending, handlePending)
            .addCase(featureDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = state.documents.map((doc) =>
                    doc._id === action.payload._id ? action.payload : doc
                );
                state.myDocuments = state.myDocuments.map((doc) =>
                    doc._id === action.payload._id ? action.payload : doc
                );
                if (action.payload.isFeatured) {
                    state.featuredDocuments.push(action.payload);
                } else {
                    state.featuredDocuments = state.featuredDocuments.filter(
                        (doc) => doc._id !== action.payload._id
                    );
                }
                if (state.currentDocument?._id === action.payload._id) {
                    state.currentDocument = action.payload;
                }
            })
            .addCase(featureDocument.rejected, handleRejected);
    },
});

export const { clearError } = documentSlice.actions;
export default documentSlice.reducer;
