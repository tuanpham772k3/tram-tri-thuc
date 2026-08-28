import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import documentReducer from "./slices/documentSlice";
import categoryReducer from "./slices/categorySlice";
import commentReducer from "./slices/commentSlice";
import notificationReducer from "./slices/notificationSlice";
import ratingReducer from "./slices/ratingSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    documents: documentReducer,
    categories: categoryReducer,
    comments: commentReducer,
    notifications: notificationReducer,
    ratings: ratingReducer,
  },
});
