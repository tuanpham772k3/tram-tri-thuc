const mongoose = require("mongoose");
const Document = require("../models/Document.model");
const drive = require("../config/googleDrive");
const fs = require("fs");
const { retryDriveRequest } = require("../utils/driveHelper");

class DocumentService {
    static getDefaultDriveFolderId() {
        return process.env.DEFAULT_DRIVE_FOLDER_ID || "1-fgLMBdBpSISgbSTAuLzt-5VM_-K6BB7";
    }

    static async validateParentFolder(parentId, userId) {
        if (!parentId) return { driveParentId: this.getDefaultDriveFolderId() };
        const parent = await Document.findOne({ _id: parentId, type: "folder", userId });
        if (!parent) {
            throw new Error("Parent folder not found");
        }
        if (!parent.driveId) {
            throw new Error("Parent folder has no driveId");
        }
        return { driveParentId: parent.driveId };
    }

    static async checkDuplicateName(name, parentId, userId, type, excludeId = null) {
        const query = { name, parentId: parentId || null, userId, type };
        if (excludeId) query._id = { $ne: excludeId };
        const existing = await Document.findOne(query);
        if (existing) {
            throw new Error(
                `${type.charAt(0).toUpperCase() + type.slice(1)} already exists in this directory`
            );
        }
    }

    static async createDriveFolder(name, driveParentId) {
        return await retryDriveRequest(
            drive.files.create({
                requestBody: {
                    name,
                    mimeType: "application/vnd.google-apps.folder",
                    parents: [driveParentId],
                },
                fields: "id",
            }),
            "Failed to create folder on Google Drive"
        );
    }

    static async createFolder({ name, parentId, userId }) {
        const { driveParentId } = await this.validateParentFolder(parentId, userId);
        await this.checkDuplicateName(name, parentId, userId, "folder");

        const driveResponse = await this.createDriveFolder(name, driveParentId);

        const folder = new Document({
            name,
            type: "folder",
            parentId: parentId || null,
            userId,
            driveId: driveResponse.id,
        });
        await folder.save();

        return {
            _id: folder._id,
            name: folder.name,
            type: folder.type,
            parentId: folder.parentId,
            driveId: folder.driveId,
            uploadDate: folder.uploadDate,
        };
    }

    static async uploadToDrive(file, driveParentId) {
        return await retryDriveRequest(
            drive.files.create({
                requestBody: {
                    name: file.originalname,
                    mimeType: file.mimetype,
                    parents: [driveParentId],
                },
                media: {
                    mimeType: file.mimetype,
                    body: fs.createReadStream(file.path),
                },
                fields: "id, webContentLink, mimeType",
            }),
            "Failed to upload file to Google Drive"
        );
    }

    static async saveDocument(file, driveResponse, parentId, userId) {
        const fileUrl = `https://drive.google.com/file/d/${driveResponse.id}/view`;
        const directUrl = driveResponse.webContentLink || null;
        console.log("Saving document:", { mimeType: file.mimetype, directUrl }); // Debug
        if (!directUrl) {
            console.warn("Warning: webContentLink is null, directUrl may not work");
        }

        const document = new Document({
            name: file.originalname,
            type: "file",
            mimeType: file.mimetype,
            parentId: parentId || null,
            url: fileUrl,
            directUrl,
            driveId: driveResponse.id,
            userId,
            size: file.size,
        });
        await document.save();
        return document;
    }

    static async uploadDocument({ file, parentId, userId }) {
        if (!file) {
            throw new Error("No file uploaded");
        }

        const { driveParentId } = await this.validateParentFolder(parentId, userId);
        const driveResponse = await this.uploadToDrive(file, driveParentId);

        if (!driveResponse || typeof driveResponse !== "object" || !driveResponse.id) {
            throw new Error("Invalid response from Google Drive");
        }

        const document = await this.saveDocument(file, driveResponse, parentId, userId);
        return {
            name: file.originalname,
            url: document.url,
            directUrl: document.directUrl,
            id: document._id,
        };
    }

    static async getDocumentChildren(userId, parentId = null, filter = {}) {
        const results = [];
        const query = { userId, ...filter };

        if (parentId === null) {
            query.parentId = null;
        } else if (mongoose.Types.ObjectId.isValid(parentId)) {
            query.parentId = parentId;
        } else {
            return results;
        }

        const documents = await Document.find(query).lean();
        results.push(...documents);
        for (const doc of documents) {
            if (doc.type === "folder") {
                const children = await this.getDocumentChildren(userId, doc._id, filter);
                results.push(...children);
            }
        }
        return results;
    }

    static async getDocuments({ parentId, starred, includeChildren, userId }) {
        if (includeChildren === "true") {
            const filter = { deleted: false };
            if (starred !== undefined) filter.starred = starred === "true";
            return await this.getDocumentChildren(userId, null, filter);
        }

        const query = { userId, deleted: false };
        if (["root", null, undefined, "null"].includes(parentId)) {
            query.parentId = null;
        } else {
            if (!mongoose.Types.ObjectId.isValid(parentId)) {
                throw new Error("Invalid parentId");
            }
            const parentDoc = await Document.findOne({
                _id: parentId,
                userId,
                type: "folder",
                deleted: false,
            });
            if (!parentDoc) {
                throw new Error("No access to this folder");
            }
            query.parentId = parentId;
        }

        if (starred !== undefined) {
            query.starred = starred === "true";
        }

        return await Document.find(query).lean();
    }

    static async renameDocument({ id, name, userId }) {
        const document = await Document.findOne({ _id: id, userId });
        if (!document) {
            throw new Error("Document not found");
        }

        await this.checkDuplicateName(name, document.parentId, userId, document.type, id);

        if (document.driveId) {
            await retryDriveRequest(
                drive.files.update({
                    fileId: document.driveId,
                    requestBody: { name: name.trim() },
                }),
                "Failed to rename file on Google Drive"
            );
        }

        document.name = name.trim();
        await document.save();

        return {
            _id: document._id,
            name: document.name,
            type: document.type,
            parentId: document.parentId,
            driveId: document.driveId,
            uploadDate: document.uploadDate,
        };
    }

    static async starDocument({ id, userId }) {
        const document = await Document.findOne({ _id: id, userId });
        if (!document) {
            throw new Error("Document not found");
        }

        document.starred = !document.starred;
        await document.save();

        return document;
    }

    static async validateMove(id, newParentId, userId) {
        if (id === newParentId) {
            throw new Error("Cannot move folder into itself");
        }
        const document = await Document.findOne({ _id: id, userId });
        if (!document) {
            throw new Error("Document not found");
        }
        if (newParentId) {
            const targetFolder = await Document.findOne({
                _id: newParentId,
                type: "folder",
                userId,
            });
            if (!targetFolder) {
                throw new Error("Target folder not found");
            }
            if (document.type === "folder") {
                const isChildFolder = await this.isChildOf(newParentId, id, userId);
                if (isChildFolder) {
                    throw new Error("Cannot move folder into its own subfolder");
                }
            }
        }
        return document;
    }

    static async isChildOf(potentialParentId, childId, userId) {
        let currentId = potentialParentId;
        while (currentId) {
            if (currentId.toString() === childId.toString()) {
                return true;
            }
            const parent = await Document.findOne({ _id: currentId, userId });
            if (!parent || parent.parentId === null) {
                return false;
            }
            currentId = parent.parentId;
        }
        return false;
    }

    static async moveDocument({ id, newParentId, userId }) {
        const document = await this.validateMove(id, newParentId, userId);

        if (document.type === "file" && document.driveId) {
            await retryDriveRequest(
                drive.files.update({
                    fileId: document.driveId,
                    addParents: newParentId || this.getDefaultDriveFolderId(),
                    removeParents: document.parentId || this.getDefaultDriveFolderId(),
                }),
                "Failed to move file on Google Drive"
            );
        }

        document.parentId = newParentId || null;
        await document.save();

        return document;
    }
}

module.exports = DocumentService;
