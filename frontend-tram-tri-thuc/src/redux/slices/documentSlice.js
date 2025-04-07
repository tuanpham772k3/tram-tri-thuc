import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../custom/Axios/AxiosCustom";

// Async thunk để fetch danh sách tài liệu
export const fetchDocuments = createAsyncThunk(
    "documents/fetchDocuments",
    async (_, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const res = await axiosInstance.get("/documents");
            return res.data.documents;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch documents"
            );
        }
    }
);

// Async thunk để upload tài liệu
export const uploadDocument = createAsyncThunk(
    "documents/uploadDocument",
    async (file, { getState, dispatch, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // Fetch lại danh sách sau khi upload để đồng bộ với MongoDB
            await dispatch(fetchDocuments());
            return response.data.file; // Giả sử backend trả về { file: {...} }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload document"
            );
        }
    }
);

// Async thunk để xóa tài liệu
export const deleteDocument = createAsyncThunk(
    "documents/deleteDocument",
    async (id, { getState, dispatch, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            await axiosInstance.delete(`/documents/${id}`);
            await dispatch(fetchDocuments());
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete document"
            );
        }
    }
);

// Async thunk để đổi tên tài liệu
export const renameDocument = createAsyncThunk(
    "documents/renameDocument",
    async ({ id, name }, { getState, dispatch, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.put(`/documents/${id}`, {
                name,
            });
            await dispatch(fetchDocuments());
            return response.data.document; // Giả sử backend trả về { document: {...} }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to rename document"
            );
        }
    }
);

const documentSlice = createSlice({
    name: "documents",
    initialState: {
        documents: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch documents
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Upload document
            .addCase(uploadDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadDocument.fulfilled, (state) => {
                state.loading = false;
                // Không thêm thủ công, fetchDocuments đã cập nhật state
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete document
            .addCase(deleteDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocument.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Rename document
            .addCase(renameDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(renameDocument.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(renameDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default documentSlice.reducer;
