const mongoose = require("mongoose");
const { Schema } = mongoose;

const viewHistorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        documentId: {
            type: Schema.Types.ObjectId,
            ref: "Document",
            required: true,
        },
        viewedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        indexes: [{ key: { userId: 1, documentId: 1 } }, { key: { viewedAt: -1 } }],
    }
);

module.exports = mongoose.model("ViewHistory", viewHistorySchema);
