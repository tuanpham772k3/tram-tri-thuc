import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk để fetch danh sách tài liệu
export const fetchDocuments = createAsyncThunk(
    "documents/fetchDocuments",
    async (_, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        const res = await fetch("http://localhost:5000/api/documents", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch documents");
        const data = await res.json();
        return data.documents;
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

        const res = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) throw new Error("Failed to upload document");
        const data = await res.json();

        // Fetch lại danh sách sau khi upload để đồng bộ với MongoDB
        await dispatch(fetchDocuments());
        return data.file; // Vẫn trả về file để thông báo upload thành công
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
        // Fetch documents
        builder
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
            });

        // Upload document
        builder
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
            });
    },
});

export default documentSlice.reducer;
