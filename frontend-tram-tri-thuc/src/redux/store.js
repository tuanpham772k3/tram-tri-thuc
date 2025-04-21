import { configureStore } from "@reduxjs/toolkit";
import documentReducer from "./slices/documentSlice";
import authReducer from "./slices/authSlice";
import trashReducer from "./slices/trashSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        documents: documentReducer,
        trash: trashReducer,
    },
});
