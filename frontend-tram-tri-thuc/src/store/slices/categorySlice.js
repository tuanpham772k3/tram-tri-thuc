import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockCategories } from "../../api/mockApi";

export const fetchCategories = createAsyncThunk("category/fetchCategories", async () => {
    return new Promise((resolve) => setTimeout(() => resolve(mockCategories), 300));
});

const categorySlice = createSlice({
    name: "category",
    initialState: {
        list: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            });
    },
});

export default categorySlice.reducer;
