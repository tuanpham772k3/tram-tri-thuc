import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";

// Lấy danh sách thông báo của người dùng
export const fetchNotificationsByUser = createAsyncThunk(
  "notifications/fetchByUser",
  async ({ page, limit, unreadOnly, sort }, { rejectWithValue }) => {
    try {
      const res = await customAxios.get("/notifications", {
        params: { page, limit, unreadOnly, sort },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Đánh dấu một thông báo là đã đọc
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await customAxios.patch(`/notifications/${notificationId}/read`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Đánh dấu một thông báo là chưa đọc (mới)
export const markNotificationAsUnread = createAsyncThunk(
  "notifications/markAsUnread",
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await customAxios.patch(`/notifications/${notificationId}/unread`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Đánh dấu tất cả thông báo là đã đọc
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await customAxios.patch("/notifications/read-all");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Xóa một thông báo
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await customAxios.delete(`/notifications/${notificationId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Xóa tất cả thông báo
export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await customAxios.delete("/notifications");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    pagination: {},
    loading: false,
  },
  reducers: {
    resetNotificationState: (state) => {
      state.notifications = [];
      state.pagination = {};
      state.loading = false;
    },

    addNewNotificationRealtime: (state, action) => {
      state.notifications.unshift({
        ...action.payload,
        message: action.payload.message || "Thông báo không có nội dung",
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotificationsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotificationsByUser.rejected, (state, action) => {
        state.loading = false;
      })

      // Mark Notification as Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload._id
        );
        if (notification) {
          notification.isRead = true;
        }
      })

      // Mark Notification as Unread
      .addCase(markNotificationAsUnread.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload._id
        );
        if (notification) {
          notification.isRead = false;
        }
      })

      // Mark All Notifications as Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.isRead = true));
      })

      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n._id !== action.payload);
      })

      // Delete All Notifications
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.pagination = {};
      });
  },
});

export const { resetNotificationState, addNewNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
