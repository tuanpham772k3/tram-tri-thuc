import { configureStore } from "@reduxjs/toolkit";
import documentReducer from "./slices/documentSlice";
import authReducer from "./slices/authSlice";
import trashReducer from "./slices/trashSlice";
import shareReducer from "./slices/shareSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        documents: documentReducer,
        trash: trashReducer,
        share: shareReducer,
    },
});
