import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customAxios from "../../utils/customAxios";

// Lấy thông tin người dùng
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await customAxios.get("/users/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Cập nhật thông tin người dùng
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await customAxios.put("/users/me", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Xóa tài khoản người dùng
export const deleteMyAccount = createAsyncThunk(
  "user/deleteMyAccount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await customAxios.delete("/users/me");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
  },
  reducers: {
    resetUserState: (state) => {
      state.userInfo = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserInfo
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state) => {
        state.loading = false;
      })

      // updateUserInfo
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })

      // deleteMyAccount
      .addCase(deleteMyAccount.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
