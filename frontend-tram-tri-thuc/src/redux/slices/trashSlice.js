import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../custom/Axios/AxiosCustom";
import showToast from "../../utils/toast";

// Async thunk để fetch danh sách tài liệu trong thùng rác
export const fetchTrash = createAsyncThunk(
    "trash/fetchTrash",
    async (_, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.get("/trash");
            const documents = response.data.data.documents;
            return documents;
        } catch (error) {
            console.error("Fetch trash error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to fetch trash";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để xóa tài liệu (di chuyển vào thùng rác)
export const deleteDocument = createAsyncThunk(
    "trash/deleteDocument",
    async (id, { getState, rejectWithValue }) => {
        // Validation
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return rejectWithValue("Invalid document ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("Please log in");

        try {
            const response = await axiosInstance.delete(`/documents/${id}`);
            showToast("success", response.data.message);
            return id;
        } catch (error) {
            console.error("Delete document error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to delete document";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để khôi phục tài liệu
export const restoreDocument = createAsyncThunk(
    "trash/restoreDocument",
    async (id, { getState, rejectWithValue }) => {
        // Validation
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return rejectWithValue("Invalid document ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.patch(`/trash/${id}`);
            showToast("success", response.data.message);
            return response.data.data.document;
        } catch (error) {
            console.error("Restore document error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to restore document";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để xóa vĩnh viễn tài liệu
export const permanentlyDeleteDocument = createAsyncThunk(
    "trash/permanentlyDeleteDocument",
    async (id, { getState, rejectWithValue }) => {
        // Validation
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return rejectWithValue("Invalid document ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.delete(`/trash/${id}`);
            showToast("success", response.data.message);
            return id;
        } catch (error) {
            console.error("Permanently delete document error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to permanently delete document";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để dọn sạch thùng rác
export const emptyTrash = createAsyncThunk(
    "trash/emptyTrash",
    async (_, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.delete("/trash");
            showToast("success", response.data.message);
            return true;
        } catch (error) {
            console.error("Empty trash error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to empty trash";
            return rejectWithValue(message);
        }
    }
);

const trashSlice = createSlice({
    name: "trash",
    initialState: {
        trashDocuments: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Xóa lỗi
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Helper để xử lý trạng thái pending
        const handlePending = (state) => {
            state.loading = true;
            state.error = null;
        };

        // Helper để xử lý trạng thái rejected
        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
            showToast("error", action.payload);
        };

        // Fetch trash
        builder
            .addCase(fetchTrash.pending, handlePending)
            .addCase(fetchTrash.fulfilled, (state, action) => {
                state.loading = false;
                state.trashDocuments = action.payload;
            })
            .addCase(fetchTrash.rejected, handleRejected);

        // Delete document
        builder
            .addCase(deleteDocument.pending, handlePending)
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.trashDocuments.push({ _id: action.payload, deleted: true });
            })
            .addCase(deleteDocument.rejected, handleRejected);

        // Restore document
        builder
            .addCase(restoreDocument.pending, handlePending)
            .addCase(restoreDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.trashDocuments = state.trashDocuments.filter(
                    (doc) => doc._id !== action.payload._id
                );
            })
            .addCase(restoreDocument.rejected, handleRejected);

        // Permanently delete document
        builder
            .addCase(permanentlyDeleteDocument.pending, handlePending)
            .addCase(permanentlyDeleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.trashDocuments = state.trashDocuments.filter(
                    (doc) => doc._id !== action.payload
                );
            })
            .addCase(permanentlyDeleteDocument.rejected, handleRejected);

        // Empty trash
        builder
            .addCase(emptyTrash.pending, handlePending)
            .addCase(emptyTrash.fulfilled, (state) => {
                state.loading = false;
                state.trashDocuments = [];
            })
            .addCase(emptyTrash.rejected, handleRejected);
    },
});

export const { clearError } = trashSlice.actions;
export default trashSlice.reducer;
