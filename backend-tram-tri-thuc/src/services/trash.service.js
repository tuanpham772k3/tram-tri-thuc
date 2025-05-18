const mongoose = require("mongoose");
const Document = require("../models/Document.model");
const drive = require("../config/googleDrive.config");
const cron = require("node-cron");
const { retryDriveRequest } = require("../utils/driveHelper");

class TrashService {
    static async validateDocument(id, userId, deleted = false) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid document ID");
        }
        const document = await Document.findOne({ _id: id, userId, deleted });
        if (!document) {
            throw new Error(deleted ? "Document not found in trash" : "Document not found");
        }
        return document;
    }

    static async deleteFromDrive(driveId) {
        if (!driveId) {
            throw new Error("Invalid driveId");
        }
        await retryDriveRequest(
            drive.files.delete({ fileId: driveId }),
            "Failed to delete file from Google Drive"
        );
        return { success: true };
    }

    static async filterDeletedDocuments(documents, userId) {
        const result = [];
        const deletedFolderIds = new Set(
            documents.filter((doc) => doc.type === "folder").map((doc) => doc._id.toString())
        );

        const hasDeletedAncestor = async (doc) => {
            let currentId = doc.parentId;
            while (currentId) {
                if (deletedFolderIds.has(currentId.toString())) {
                    return true;
                }
                const parent = await Document.findOne({ _id: currentId, userId }).lean();
                if (!parent) return false;
                currentId = parent.parentId;
            }
            return false;
        };

        for (const doc of documents) {
            if (!(await hasDeletedAncestor(doc))) {
                result.push(doc);
            }
        }
        return result;
    }

    static async getTrashItems(userId) {
        const deletedDocuments = await Document.find({ userId, deleted: true })
            .populate("userId", "email avatar") // Populate email và avatar từ User model
            .lean();
        return await this.filterDeletedDocuments(deletedDocuments, userId);
    }

    static async deleteDocument(id, userId) {
        const document = await this.validateDocument(id, userId);
        if (document.type === "folder") {
            await Document.updateMany(
                { parentId: id, userId, deleted: false },
                { $set: { deleted: true, deletedAt: new Date() } }
            );
        }

        document.deleted = true;
        document.deletedAt = new Date();
        await document.save();

        return document;
    }

    static async restoreDocument(id, userId) {
        const document = await this.validateDocument(id, userId, true);
        if (document.type === "folder") {
            await Document.updateMany(
                { parentId: document._id, userId, deleted: true },
                { $set: { deleted: false, deletedAt: null } }
            );
        }

        document.deleted = false;
        document.deletedAt = null;
        await document.save();

        return document;
    }

    static async deleteRecursive(documentId, userId) {
        const document = await Document.findOne({ _id: documentId, userId });
        if (!document) return;

        if (document.type === "folder") {
            const children = await Document.find({ parentId: documentId, userId });
            for (const child of children) {
                await this.deleteRecursive(child._id, userId);
            }
        }

        try {
            await this.deleteFromDrive(document.driveId);
        } catch (error) {
            if (!error.message.includes("File or folder not found")) {
                throw error;
            }
            // Bỏ qua nếu file không tồn tại trên Google Drive
        }
        await Document.deleteOne({ _id: documentId, userId });
    }

    static async permanentlyDeleteDocument(id, userId) {
        const document = await this.validateDocument(id, userId, true);
        if (document.type === "folder") {
            await this.deleteRecursive(document._id, userId);
        } else {
            try {
                await this.deleteFromDrive(document.driveId);
            } catch (error) {
                if (!error.message.includes("File or folder not found")) {
                    throw error;
                }
                // Bỏ qua nếu file không tồn tại trên Google Drive
            }
            await Document.deleteOne({ _id: document._id, userId });
        }
    }

    static async emptyTrash(userId) {
        const trashDocuments = await Document.find({ userId, deleted: true });
        for (const doc of trashDocuments) {
            if (doc.type === "folder") {
                await this.deleteRecursive(doc._id, userId);
            } else {
                try {
                    await this.deleteFromDrive(doc.driveId);
                } catch (error) {
                    if (!error.message.includes("File or folder not found")) {
                        throw error;
                    }
                    // Bỏ qua nếu file không tồn tại trên Google Drive
                }
                await Document.deleteOne({ _id: doc._id, userId });
            }
        }
    }

    static startAutoDeleteCron() {
        cron.schedule("0 0 * * *", async () => {
            try {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const expiredDocuments = await Document.find({
                    deleted: true,
                    deletedAt: { $lte: thirtyDaysAgo },
                });

                for (const doc of expiredDocuments) {
                    if (doc.type === "folder") {
                        await this.deleteRecursive(doc._id, doc.userId);
                    } else {
                        try {
                            await this.deleteFromDrive(doc.driveId);
                        } catch (error) {
                            if (!error.message.includes("File or folder not found")) {
                                throw error;
                            }
                            // Bỏ qua nếu file không tồn tại trên Google Drive
                        }
                        await Document.deleteOne({ _id: doc._id, userId: doc.userId });
                    }
                }

                console.log(`Auto-deleted ${expiredDocuments.length} expired trash items`);
            } catch (error) {
                console.error("Auto-delete Trash Error:", error.message);
            }
        });
    }
}

module.exports = TrashService;

// Start cron job
TrashService.startAutoDeleteCron();
