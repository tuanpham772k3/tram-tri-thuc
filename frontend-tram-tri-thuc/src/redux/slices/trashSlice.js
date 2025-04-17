/**
 * Redux slice for trash-related operations
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeApiCall, isValidObjectId } from "../../utils/apiUtils";
import { fetchDocuments } from "./documentSlice";

/**
 * Fetch documents in trash
 * @returns {Promise<Array>} List of trashed documents
 */
export const fetchTrash = createAsyncThunk(
    "trash/fetchTrash",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const data = await makeApiCall(
                {
                    method: "get",
                    url: "/trash",
                },
                token
            );
            return data.documents;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Delete a document (move to trash)
 * @param {string} id - Document ID
 * @returns {Promise<string>} Deleted document ID
 */
export const deleteDocument = createAsyncThunk(
    "trash/deleteDocument",
    async (id, { getState, dispatch, rejectWithValue }) => {
        try {
            if (!isValidObjectId(id)) {
                return rejectWithValue("ID tài liệu không hợp lệ");
            }
            const { token } = getState().auth;
            await makeApiCall(
                {
                    method: "delete",
                    url: `/documents/${id}`,
                },
                token
            );
            await dispatch(fetchDocuments({ parentId: "root" }));
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Restore a document from trash
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Restored document
 */
export const restoreDocument = createAsyncThunk(
    "trash/restoreDocument",
    async (id, { getState, dispatch, rejectWithValue }) => {
        try {
            if (!isValidObjectId(id)) {
                return rejectWithValue("ID tài liệu không hợp lệ");
            }
            const { token } = getState().auth;
            const data = await makeApiCall(
                {
                    method: "patch",
                    url: `/documents/${id}/restore`,
                },
                token
            );
            await dispatch(fetchTrash());
            return data.document;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Permanently delete a document
 * @param {string} id - Document ID
 * @returns {Promise<string>} Deleted document ID
 */
export const permanentlyDeleteDocument = createAsyncThunk(
    "trash/permanentlyDeleteDocument",
    async (id, { getState, dispatch, rejectWithValue }) => {
        try {
            if (!isValidObjectId(id)) {
                return rejectWithValue("ID tài liệu không hợp lệ");
            }
            const { token } = getState().auth;
            await makeApiCall(
                {
                    method: "delete",
                    url: `/documents/${id}/permanent`,
                },
                token
            );
            await dispatch(fetchTrash());
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Empty the trash
 * @returns {Promise<boolean>} True if successful
 */
export const emptyTrash = createAsyncThunk(
    "trash/emptyTrash",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            await makeApiCall(
                {
                    method: "delete",
                    url: "/documents/trash/empty",
                },
                token
            );
            return true;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const trashSlice = createSlice({
    name: "trash",
    initialState: {
        trashDocuments: [],
        loading: false,
        error: null,
    },
    reducers: {
        /**
         * Clear error state
         */
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Helper to handle pending state
        const handlePending = (state) => {
            state.loading = true;
            state.error = null;
        };

        // Helper to handle rejected state
        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        // Fetch trash
        builder
            .addCase(fetchTrash.pending, handlePending)
            .addCase(fetchTrash.fulfilled, (state, action) => {
                state.loading = false;
                state.trashDocuments = action.payload;
            })
            .addCase(fetchTrash.rejected, handleRejected);

        // Delete document
        builder
            .addCase(deleteDocument.pending, handlePending)
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.trashDocuments = state.trashDocuments.filter(
                    (doc) => doc._id !== action.payload
                );
            })
            .addCase(deleteDocument.rejected, handleRejected);

        // Restore document
        builder
            .addCase(restoreDocument.pending, handlePending)
            .addCase(restoreDocument.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(restoreDocument.rejected, handleRejected);

        // Permanently delete document
        builder
            .addCase(permanentlyDeleteDocument.pending, handlePending)
            .addCase(permanentlyDeleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.trashDocuments = state.trashDocuments.filter(
                    (doc) => doc._id !== action.payload
                );
            })
            .addCase(permanentlyDeleteDocument.rejected, handleRejected);

        // Empty trash
        builder
            .addCase(emptyTrash.pending, handlePending)
            .addCase(emptyTrash.fulfilled, (state) => {
                state.loading = false;
                state.trashDocuments = [];
            })
            .addCase(emptyTrash.rejected, handleRejected);
    },
});

export const { clearError } = trashSlice.actions;
export default trashSlice.reducer;
