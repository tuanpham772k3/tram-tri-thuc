import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../custom/Axios/AxiosCustom";

// Async thunk để fetch danh sách tài liệu
export const fetchDocuments = createAsyncThunk(
    "documents/fetchDocuments",
    async ({ parentId = "root" }, { getState, rejectWithValue }) => {
        if (
            parentId &&
            parentId !== "root" &&
            !/^[0-9a-fA-F]{24}$/.test(parentId)
        ) {
            return rejectWithValue("parentId không hợp lệ");
        }
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");
        try {
            const res = await axiosInstance.get(
                `/documents?parentId=${parentId}`,
                { token } // Truyền token để interceptor sử dụng
            );
            return res.data.documents;
        } catch (error) {
            if (error.response?.status === 401) {
                // Dispatch action để logout hoặc thông báo
                return rejectWithValue(
                    "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
                );
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch documents"
            );
        }
    }
);

// Async thunk để upload tài liệu
export const uploadDocument = createAsyncThunk(
    "documents/uploadDocument",
    async (formData, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");
        try {
            console.log("Uploading with parentId:", formData.get("parentId"));
            const response = await axiosInstance.post(
                "/documents/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data.file; // Chỉ trả về file vừa upload
        } catch (error) {
            console.error("Upload thunk error:", error.response?.data || error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload document"
            );
        }
    }
);

// Async thunk để tạo thư mục
export const createFolder = createAsyncThunk(
    "documents/createFolder",
    async ({ name, parentId }, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");
        try {
            const response = await axiosInstance.post("/documents/folder", {
                name,
                parentId: parentId || null,
            });
            return response.data.folder;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create folder"
            );
        }
    }
);

// Async thunk để xóa tài liệu
export const deleteDocument = createAsyncThunk(
    "documents/deleteDocument",
    async (id, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("Vui lòng đăng nhập");
        try {
            await axiosInstance.delete(`/documents/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lỗi máy chủ khi xóa"
            );
        }
    }
);

// Async thunk để đổi tên tài liệu
export const renameDocument = createAsyncThunk(
    "documents/renameDocument",
    async ({ id, name }, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("Vui lòng đăng nhập");
        try {
            const response = await axiosInstance.put(`/documents/${id}`, {
                name: name.trim(),
            });
            return response.data.document;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lỗi đổi tên không xác định"
            );
        }
    }
);

// Async thunk để đánh dấu/bỏ đánh dấu sao tài liệu
export const starDocument = createAsyncThunk(
    "documents/starDocument",
    async (id, { getState, dispatch, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");
        try {
            const response = await axiosInstance.patch(`/documents/${id}/star`);
            await dispatch(fetchDocuments({ parentId: "root" }));
            return response.data.document;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to star document"
            );
        }
    }
);

// Async thunk để di chuyển tài liệu
export const moveDocument = createAsyncThunk(
    "documents/moveDocument",
    async ({ id, newParentId }, { getState, dispatch, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");
        try {
            const response = await axiosInstance.put(`/documents/${id}/move`, {
                newParentId: newParentId || null,
            });
            await dispatch(fetchDocuments({ parentId: "root" }));
            return response.data.document;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to move document"
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
                state.error = action.payload;
            })

            // Upload document
            .addCase(uploadDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents.push(action.payload); // Thêm tài liệu mới vào state ngay lập tức
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create folder
            .addCase(createFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.documents.push(action.payload); // Thêm folder mới vào state ngay lập tức
            })
            .addCase(createFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete document
            .addCase(deleteDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = state.documents.filter(
                    (doc) => doc._id !== action.payload
                );
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Rename document
            .addCase(renameDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(renameDocument.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.documents.findIndex(
                    (doc) => doc._id === action.payload._id
                );
                if (index !== -1) state.documents[index] = action.payload;
            })
            .addCase(renameDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Star document
            .addCase(starDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(starDocument.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.documents.findIndex(
                    (doc) => doc._id === action.payload._id
                );
                if (index !== -1) state.documents[index] = action.payload;
            })
            .addCase(starDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Move document
            .addCase(moveDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(moveDocument.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.documents.findIndex(
                    (doc) => doc._id === action.payload._id
                );
                if (index !== -1) state.documents[index] = action.payload;
            })
            .addCase(moveDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default documentSlice.reducer;
