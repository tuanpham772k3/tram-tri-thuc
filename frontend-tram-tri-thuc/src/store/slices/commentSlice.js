import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockComments } from "../../api/mockApi";

export const fetchCommentsByDocument = createAsyncThunk(
    "comment/fetchCommentsByDocument",
    async (documentId) => {
        return new Promise((resolve) =>
            setTimeout(() => {
                const result = mockComments.filter((c) => c.documentId === documentId);
                resolve(result);
            }, 300)
        );
    }
);

const commentSlice = createSlice({
    name: "comment",
    initialState: {
        byDocument: {},
        loading: false,
    },
    reducers: {
        addCommentLocal: (state, action) => {
            const { documentId, comment } = action.payload;
            if (!state.byDocument[documentId]) {
                state.byDocument[documentId] = [];
            }
            state.byDocument[documentId].push(comment);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsByDocument.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCommentsByDocument.fulfilled, (state, action) => {
                const docId = action.meta.arg;
                state.byDocument[docId] = action.payload;
                state.loading = false;
            });
    },
});

export const { addCommentLocal } = commentSlice.actions;
export default commentSlice.reducer;
