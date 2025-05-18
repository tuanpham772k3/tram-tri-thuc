import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockDocuments } from "../../api/mockApi";

export const fetchRatingsByDocument = createAsyncThunk(
    "rating/fetchByDocument",
    async (documentId) => {
        return new Promise((resolve) =>
            setTimeout(() => {
                const doc = mockDocuments.find((d) => d._id === documentId);
                resolve(doc?.ratings || []);
            }, 300)
        );
    }
);

const ratingSlice = createSlice({
    name: "rating",
    initialState: {
        byDocument: {},
        loading: false,
    },
    reducers: {
        addRatingLocal: (state, action) => {
            const { documentId, rating } = action.payload;
            if (!state.byDocument[documentId]) {
                state.byDocument[documentId] = [];
            }
            state.byDocument[documentId].push(rating);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatingsByDocument.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRatingsByDocument.fulfilled, (state, action) => {
                const docId = action.meta.arg;
                state.byDocument[docId] = action.payload;
                state.loading = false;
            });
    },
});

export const { addRatingLocal } = ratingSlice.actions;
export default ratingSlice.reducer;
