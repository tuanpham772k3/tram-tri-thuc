import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../custom/Axios/AxiosCustom";
import showToast from "../../utils/toast";

// Async thunk để tạo link chia sẻ
export const createShareLink = createAsyncThunk(
    "share/createShareLink",
    async ({ documentId, permission, expiresInDays = 7 }, { getState, rejectWithValue }) => {
        if (!/^[0-9a-fA-F]{24}$/.test(documentId)) {
            return rejectWithValue("Invalid document ID");
        }
        if (!["viewer", "editor"].includes(permission)) {
            return rejectWithValue("Invalid permission");
        }
        if (!Number.isInteger(expiresInDays) || expiresInDays < 1) {
            return rejectWithValue("Invalid expiresInDays");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.post(`/share/${documentId}/share-link`, {
                permission,
                expiresInDays,
            });
            showToast("success", "Tạo link chia sẻ thành công");
            return response.data.data;
        } catch (error) {
            console.error("Create share link error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Lỗi khi tạo link chia sẻ";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để lấy thông tin link chia sẻ
export const getShareLink = createAsyncThunk(
    "share/getShareLink",
    async (documentId, { getState, rejectWithValue }) => {
        if (!/^[0-9a-fA-F]{24}$/.test(documentId)) {
            return rejectWithValue("Invalid document ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.get(`/share/${documentId}/share-link`);
            return response.data.data || null; // Trả về null nếu không có link
        } catch (error) {
            console.error("Get share link error:", error.response?.data);
            if (error.response?.status === 404) {
                return null; // Không có link, trả về null thay vì lỗi
            }
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Lỗi khi lấy link chia sẻ";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để xóa link chia sẻ
export const deleteShareLink = createAsyncThunk(
    "share/deleteShareLink",
    async (documentId, { getState, rejectWithValue }) => {
        if (!/^[0-9a-fA-F]{24}$/.test(documentId)) {
            return rejectWithValue("Invalid document ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            await axiosInstance.delete(`/share/${documentId}/share-link`);
            showToast("success", "Xóa link chia sẻ thành công");
            return documentId;
        } catch (error) {
            console.error("Delete share link error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Lỗi khi xóa link chia sẻ";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để lấy danh sách tài liệu được chia sẻ với người dùng
export const fetchSharedWithMe = createAsyncThunk(
    "share/fetchSharedWithMe",
    async (_, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.get("/share/shared-with-me");
            return response.data.data;
        } catch (error) {
            console.error("Fetch shared with me error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Lỗi khi lấy danh sách tài liệu được chia sẻ";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để chia sẻ với người dùng cụ thể
export const addPermission = createAsyncThunk(
    "share/addPermission",
    async ({ documentId, email, userId, permission }, { getState, rejectWithValue }) => {
        if (!/^[0-9a-fA-F]{24}$/.test(documentId)) {
            return rejectWithValue("Invalid document ID");
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return rejectWithValue("Invalid email");
        }
        if (!["viewer", "editor"].includes(permission)) {
            return rejectWithValue("Invalid permission");
        }
        if (!email && !userId) {
            return rejectWithValue("Email or userId is required");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.post(`/share/${documentId}/permissions`, {
                email,
                userId,
                permission,
            });
            showToast("success", "Chia sẻ tài liệu thành công");
            return response.data.data.sharedWith;
        } catch (error) {
            console.error("Add permission error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Lỗi khi chia sẻ tài liệu";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để lấy danh sách người dùng được chia sẻ
export const getPermissions = createAsyncThunk(
    "share/getPermissions",
    async (documentId, { getState, rejectWithValue }) => {
        if (!/^[0-9a-fA-F]{24}$/.test(documentId)) {
            return rejectWithValue("Invalid document ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.get(`/share/${documentId}/permissions`);
            return response.data.data.sharedWith;
        } catch (error) {
            console.error("Get permissions error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Lỗi khi lấy danh sách chia sẻ";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để xóa quyền của người dùng
export const removePermission = createAsyncThunk(
    "share/removePermission",
    async ({ documentId, userId }, { getState, rejectWithValue }) => {
        if (!/^[0-9a-fA-F]{24}$/.test(documentId) || !/^[0-9a-fA-F]{24}$/.test(userId)) {
            return rejectWithValue("Invalid document ID or user ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.delete(
                `/share/${documentId}/permissions/${userId}`
            );
            showToast("success", "Xóa quyền chia sẻ thành công");
            return response.data.data.sharedWith;
        } catch (error) {
            console.error("Remove permission error:", error.response?.data);
            const message =
                error.response?.data?.errors?.join(", ") ||
                error.response?.data?.message ||
                "Lỗi khi xóa quyền chia sẻ";
            return rejectWithValue(message);
        }
    }
);

// Async thunk để truy cập tài liệu qua link chia sẻ
export const accessSharedDocument = createAsyncThunk(
    "share/accessSharedDocument",
    async ({ linkId, secretKey }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/share/${linkId}/${secretKey}`);
            return response.data.data;
        } catch (error) {
            console.error("Access shared document error:", error.response?.data);
            const message = error.response?.data?.message || "Lỗi khi truy cập tài liệu chia sẻ";
            return rejectWithValue({
                message,
                status: error.response?.status,
            });
        }
    }
);

// Async thunk để lấy tài liệu được chia sẻ qua email
export const fetchSharedDocument = createAsyncThunk(
    "share/fetchSharedDocument",
    async (documentId, { getState, rejectWithValue }) => {
        if (!/^[0-9a-fA-F]{24}$/.test(documentId)) {
            return rejectWithValue("Invalid document ID");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const response = await axiosInstance.get(`/share/${documentId}`);
            return response.data.data;
        } catch (error) {
            console.error("Fetch shared document error:", error.response?.data);
            const message = error.response?.data?.message || "Lỗi khi lấy tài liệu được chia sẻ";
            return rejectWithValue({
                message,
                status: error.response?.status,
            });
        }
    }
);

// Async thunk để chỉnh sửa tài liệu
export const editDocument = createAsyncThunk(
    "share/editDocument",
    async ({ documentId, file }, { getState, rejectWithValue }) => {
        if (!/^[0-9a-fA-F]{24}$/.test(documentId)) {
            return rejectWithValue("Invalid document ID");
        }
        if (!file) {
            return rejectWithValue("No file provided");
        }

        const { token } = getState().auth;
        if (!token) return rejectWithValue("No token available");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.patch(`/share/${documentId}/edit`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            showToast("success", "Tài liệu đã được chỉnh sửa thành công");
            return response.data.data;
        } catch (error) {
            console.error("Edit document error:", error.response?.data);
            const message = error.response?.data?.message || "Lỗi khi chỉnh sửa tài liệu";
            return rejectWithValue({
                message,
                status: error.response?.status,
            });
        }
    }
);

const shareSlice = createSlice({
    name: "share",
    initialState: {
        shareLink: null,
        sharedUsers: [],
        sharedDocuments: {},
        sharedWithMeDocuments: [],
        loadingLink: false,
        loadingPermission: false,
        loadingSharedWithMe: false,
        error: null,
        isShareModalOpen: false,
        currentDocumentId: null,
    },
    reducers: {
        openShareModal: (state, action) => {
            state.isShareModalOpen = true;
            state.currentDocumentId = action.payload.documentId;
            state.shareLink = null; // Reset shareLink
            state.sharedUsers = []; // Reset sharedUsers
            state.error = null; // Reset error
        },
        closeShareModal: (state) => {
            state.isShareModalOpen = false;
            state.currentDocumentId = null; // Reset
            state.shareLink = null;
            state.sharedUsers = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const handleLinkPending = (state) => {
            state.loadingLink = true;
            state.error = null;
        };

        const handlePermissionPending = (state) => {
            state.loadingPermission = true;
            state.error = null;
        };

        const handleRejected = (state, action) => {
            state.loadingLink = false;
            state.loadingPermission = false;
            state.loadingSharedWithMe = false;
            state.error = action.payload;
            showToast("error", action.payload.message || action.payload);
        };

        builder
            .addCase(createShareLink.pending, handleLinkPending)
            .addCase(createShareLink.fulfilled, (state, action) => {
                state.loadingLink = false;
                state.shareLink = action.payload;
            })
            .addCase(createShareLink.rejected, handleRejected)

            .addCase(getShareLink.pending, handleLinkPending)
            .addCase(getShareLink.fulfilled, (state, action) => {
                state.loadingLink = false;
                state.shareLink = action.payload;
            })
            .addCase(getShareLink.rejected, (state, action) => {
                state.loadingLink = false;
                if (action.payload !== "No share link exists for this document") {
                    state.error = action.payload;
                    showToast("error", action.payload);
                }
            })

            .addCase(deleteShareLink.pending, handleLinkPending)
            .addCase(deleteShareLink.fulfilled, (state) => {
                state.loadingLink = false;
                state.shareLink = null;
            })
            .addCase(deleteShareLink.rejected, handleRejected)

            .addCase(fetchSharedWithMe.pending, (state) => {
                state.loadingSharedWithMe = true;
                state.error = null;
            })
            .addCase(fetchSharedWithMe.fulfilled, (state, action) => {
                state.loadingSharedWithMe = false;
                state.sharedWithMeDocuments = action.payload;
            })
            .addCase(fetchSharedWithMe.rejected, handleRejected)

            .addCase(addPermission.pending, handlePermissionPending)
            .addCase(addPermission.fulfilled, (state, action) => {
                state.loadingPermission = false;
                state.sharedUsers = action.payload;
            })
            .addCase(addPermission.rejected, handleRejected)

            .addCase(getPermissions.pending, handlePermissionPending)
            .addCase(getPermissions.fulfilled, (state, action) => {
                state.loadingPermission = false;
                state.sharedUsers = action.payload;
            })
            .addCase(getPermissions.rejected, handleRejected)

            .addCase(removePermission.pending, handlePermissionPending)
            .addCase(removePermission.fulfilled, (state, action) => {
                state.loadingPermission = false;
                state.sharedUsers = action.payload;
            })
            .addCase(removePermission.rejected, handleRejected)

            .addCase(accessSharedDocument.pending, (state) => {
                state.loadingLink = true;
                state.error = null;
            })
            .addCase(accessSharedDocument.fulfilled, (state, action) => {
                state.loadingLink = false;
                state.sharedDocuments[action.meta.arg.linkId] = action.payload;
            })
            .addCase(accessSharedDocument.rejected, handleRejected)

            .addCase(fetchSharedDocument.pending, handleLinkPending)
            .addCase(fetchSharedDocument.fulfilled, (state, action) => {
                state.loadingLink = false;
                const { document, permission } = action.payload;
                state.sharedDocuments[document._id] = { document, permission };
                const existingDoc = state.sharedWithMeDocuments.find(
                    (doc) => doc._id === document._id
                );
                if (!existingDoc) {
                    state.sharedWithMeDocuments.push(document);
                }
            })
            .addCase(fetchSharedDocument.rejected, handleRejected)

            .addCase(editDocument.pending, handleLinkPending)
            .addCase(editDocument.fulfilled, (state, action) => {
                state.loadingLink = false;
                const { document, permission } = action.payload;
                state.sharedDocuments[document._id] = { document, permission };
                const index = state.sharedWithMeDocuments.findIndex(
                    (doc) => doc._id === document._id
                );
                if (index !== -1) {
                    state.sharedWithMeDocuments[index] = document;
                }
            })
            .addCase(editDocument.rejected, handleRejected);
    },
});

export const { openShareModal, closeShareModal, clearError } = shareSlice.actions;
export default shareSlice.reducer;
