import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Giả lập gọi API lấy danh sách người dùng
export const fetchAllUsers = createAsyncThunk("admin/fetchAllUsers", async () => {
    // Giả lập dữ liệu
    return [
        { _id: "1", name: "Admin One", email: "admin1@example.com", role: "admin", isActive: true },
        {
            _id: "2",
            name: "Uploader A",
            email: "up1@example.com",
            role: "uploader",
            isActive: true,
        },
        { _id: "3", name: "Member B", email: "mem2@example.com", role: "member", isActive: false },
    ];
});

// Giả lập gọi API lấy danh sách tài liệu chờ duyệt
export const fetchPendingDocuments = createAsyncThunk("admin/fetchPendingDocuments", async () => {
    return [
        { _id: "doc1", title: "Tài liệu A", uploaderName: "Uploader A", isApproved: false },
        { _id: "doc2", title: "Tài liệu B", uploaderName: "Uploader B", isApproved: false },
    ];
});

// Giả lập gọi API lấy thống kê tổng quan
export const fetchAdminStats = createAsyncThunk("admin/fetchAdminStats", async () => {
    return {
        totalUsers: 120,
        totalDocuments: 350,
        pendingDocuments: 12,
        reportedComments: 5,
    };
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        pendingDocuments: [],
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {
        toggleUserStatus(state, action) {
            const userId = action.payload;
            const user = state.users.find((u) => u._id === userId);
            if (user) user.isActive = !user.isActive;
        },
        approveDocument(state, action) {
            const docId = action.payload;
            const docIndex = state.pendingDocuments.findIndex((d) => d._id === docId);
            if (docIndex !== -1) {
                state.pendingDocuments.splice(docIndex, 1); // Remove khỏi danh sách chờ duyệt
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(fetchPendingDocuments.fulfilled, (state, action) => {
                state.pendingDocuments = action.payload;
            })

            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    },
});

export const { toggleUserStatus, approveDocument } = adminSlice.actions;

export default adminSlice.reducer;
