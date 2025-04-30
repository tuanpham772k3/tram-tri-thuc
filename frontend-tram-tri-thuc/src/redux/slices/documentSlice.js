import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../custom/Axios/AxiosCustom";
import showToast from "../../utils/toast";

// Async thunk để fetch danh sách tài liệu
export const fetchDocuments = createAsyncThunk(
    "documents/fetchDocuments",
    async (
        { parentId = "root", type, mimeType, uploadDate, userId, starred, includeChildren = false },
        { getState, rejectWithValue }
    ) => {
        // Validation
        if (parentId && parentId !== "root" && !/^[0-9a-fA-F]{24}$/.test(parentId)) {
            return rejectWithValue("Invalid parentId");
        }
        if (type && !["file", "folder"].includes(type)) {
            return rejectWithValue("Invalid type");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const params = {};
            if (parentId !== "root") params.parentId = parentId;
            if (type) params.type = type;
            if (mimeType) params.mimeType = mimeType;
            if (uploadDate) params.uploadDate = uploadDate;
            if (userId) params.userId = userId;
            if (starred !== undefined) params.starred = starred;
            if (includeChildren) params.includeChildren = includeChildren;

            const res = await axiosInstance.get("/documents", { params });
            return res.data.data.documents;
        } catch (error) {
            console.error("Fetch documents error:", error.response?.data);
            const message =
                error.response?.status === 401
                    ? "Session expired, please log in again"
                    : error.response?.data?.message || "Failed to fetch documents";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để upload tài liệu
export const uploadDocument = createAsyncThunk(
    "documents/uploadDocument",
    async ({ formData, onUploadProgress }, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.post("/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress,
            });

            showToast("success", response.data.message);
            return response.data.data.file;
        } catch (error) {
            console.error("Upload document error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to upload document";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để tạo thư mục
export const createFolder = createAsyncThunk(
    "documents/createFolder",
    async ({ name, parentId }, { getState, rejectWithValue }) => {
        // Validation
        if (!name || name.trim().length < 1 || name.trim().length > 255) {
            return rejectWithValue("Folder name must be between 1 and 255 characters");
        }
        if (parentId && !/^[0-9a-fA-F]{24}$/.test(parentId)) {
            return rejectWithValue("Invalid parentId");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.post("/folders", {
                name: name.trim(),
                parentId: parentId || null,
            });
            showToast("success", response.data.message);
            return response.data.data.folder;
        } catch (error) {
            console.error("Create folder error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to create folder";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để đổi tên tài liệu
export const renameDocument = createAsyncThunk(
    "documents/renameDocument",
    async ({ id, name }, { getState, rejectWithValue }) => {
        // Validation
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return rejectWithValue("Invalid document ID");
        }
        if (!name || name.trim().length < 1 || name.trim().length > 255) {
            return rejectWithValue("Name must be between 1 and 255 characters");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("Please log in");

        try {
            const response = await axiosInstance.put(`/documents/${id}`, {
                name: name.trim(),
                id,
            });
            showToast("success", response.data.message);
            return response.data.data.document;
        } catch (error) {
            console.error("Rename document error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to rename document";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để đánh dấu/bỏ đánh dấu sao tài liệu
export const starDocument = createAsyncThunk(
    "documents/starDocument",
    async (id, { getState, rejectWithValue }) => {
        // Validation
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return rejectWithValue("Invalid document ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.patch(`/documents/${id}/star`, {
                id,
            });
            showToast("success", response.data.message);
            return response.data.data.document;
        } catch (error) {
            console.error("Star document error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to star document";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để di chuyển tài liệu
export const moveDocument = createAsyncThunk(
    "documents/moveDocument",
    async ({ id, newParentId }, { getState, rejectWithValue }) => {
        // Validation
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return rejectWithValue("Invalid document ID");
        }
        if (newParentId && !/^[0-9a-fA-F]{24}$/.test(newParentId)) {
            return rejectWithValue("Invalid parentId");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.put(`/documents/${id}/move`, {
                newParentId: newParentId || null,
            });
            showToast("success", response.data.message);
            return response.data.data.document;
        } catch (error) {
            console.error("Move document error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Failed to move document";
            return rejectWithValue(message);
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

        // Fetch documents
        builder
            .addCase(fetchDocuments.pending, handlePending)
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchDocuments.rejected, handleRejected);

        // Upload document
        builder
            .addCase(uploadDocument.pending, handlePending)
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents.push(action.payload);
            })
            .addCase(uploadDocument.rejected, handleRejected);

        // Create folder
        builder
            .addCase(createFolder.pending, handlePending)
            .addCase(createFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.documents.push(action.payload);
            })
            .addCase(createFolder.rejected, handleRejected);

        // Rename document
        builder
            .addCase(renameDocument.pending, handlePending)
            .addCase(renameDocument.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.documents.findIndex((doc) => doc._id === action.payload._id);
                if (index !== -1) state.documents[index] = action.payload;
            })
            .addCase(renameDocument.rejected, handleRejected);

        // Star document
        builder
            .addCase(starDocument.pending, handlePending)
            .addCase(starDocument.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.documents.findIndex((doc) => doc._id === action.payload._id);
                if (index !== -1) state.documents[index] = action.payload;
            })
            .addCase(starDocument.rejected, handleRejected);

        // Move document
        builder
            .addCase(moveDocument.pending, handlePending)
            .addCase(moveDocument.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.documents.findIndex((doc) => doc._id === action.payload._id);
                if (index !== -1) state.documents[index] = action.payload;
            })
            .addCase(moveDocument.rejected, handleRejected);
    },
});

export const { clearError } = documentSlice.actions;
export default documentSlice.reducer;
