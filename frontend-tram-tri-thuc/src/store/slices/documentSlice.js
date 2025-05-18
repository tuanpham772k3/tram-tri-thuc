import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDocuments } from "../../api/mockApi";

export const loadDocuments = createAsyncThunk("document/loadDocuments", async () => {
    const res = await fetchDocuments();
    return res;
});

const documentSlice = createSlice({
    name: "document",
    initialState: {
        list: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadDocuments.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            });
    },
});

export default documentSlice.reducer;
