const mongoose = require("mongoose");
const Document = require("../models/Document.model");
const User = require("../models/User.model");
const drive = require("../config/googleDrive");
const { retryDriveRequest } = require("../utils/driveHelper");
const logger = require("../utils/logger");

class ShareService {
    static async validateDocument(documentId, userId) {
        if (!mongoose.Types.ObjectId.isValid(documentId)) {
            throw new Error("Invalid document ID");
        }
        const document = await Document.findOne({ _id: documentId, userId, deleted: false });
        if (!document) {
            throw new Error("Document not found or not accessible");
        }
        return document;
    }

    static async createShareLink(documentId, userId, permission, expiresInDays) {
        const document = await this.validateDocument(documentId, userId);
        const linkId = require("uuid").v4();
        const secretKeys = require("crypto").randomBytes(3).toString("hex");
        const expiryDate = expiresInDays
            ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
            : null;

        try {
            const response = await retryDriveRequest(
                drive.permissions.create({
                    fileId: document.driveId,
                    requestBody: {
                        role: permission === "editor" ? "writer" : "reader",
                        type: "anyone",
                    },
                }),
                "Failed to update Google Drive permissions"
            );

            // Tạo Google Docs Viewer URL
            const previewUrl = `https://docs.google.com/viewer?url=https://drive.google.com/uc?id=${document.driveId}&embedded=true`;

            document.share.linkPermission = permission;
            document.share.linkId = linkId;
            document.share.secretKey = secretKeys;
            document.share.expiryDate = expiryDate;
            document.share.previewUrl = previewUrl; // Lưu previewUrl
            await document.save();

            logger.info(`Share link created for document ${documentId} by user ${userId}`, {
                documentId,
                userId,
                permission,
                expiryDate,
                linkId,
            });

            return {
                link: `${process.env.CLIENT_URL}/share/${linkId}/${secretKeys}`,
                permission,
                expiryDate,
                previewUrl,
            };
        } catch (error) {
            logger.error(`Failed to create share link for document ${documentId}`, {
                documentId,
                userId,
                error: error.message,
            });
            throw new Error(`Failed to create share link: ${error.message}`);
        }
    }

    static async getShareLink(documentId, userId) {
        const document = await this.validateDocument(documentId, userId);
        if (!document.share.linkId || !document.share.linkPermission) {
            logger.error("No share link exists for this document", { documentId, userId });
            throw new Error("No share link exists for this document");
        }
        return {
            link: `${process.env.CLIENT_URL}/share/${document.share.linkId}`,
            permission: document.share.linkPermission,
            expiryDate: document.share.expiryDate,
        };
    }

    static async deleteShareLink(documentId, userId) {
        const document = await this.validateDocument(documentId, userId);
        if (!document.share.linkId || !document.share.linkPermission) {
            logger.error("No share link exists for this document", { documentId, userId });
            throw new Error("No share link exists for this document");
        }

        try {
            await retryDriveRequest(
                drive.permissions.delete({
                    fileId: document.driveId,
                    permissionId: "anyoneWithLink",
                }),
                "Failed to revoke share link"
            );

            document.share.linkId = null;
            document.share.linkPermission = null;
            document.share.expiryDate = null;
            await document.save();

            logger.info("Share link deleted successfully", { documentId, userId });

            return { success: true };
        } catch (error) {
            logger.error("Failed to delete share link", {
                documentId,
                userId,
                error: error.message,
            });
            throw new Error(`Failed to delete share link: ${error.message}`);
        }
    }

    static async getSharedWithMe(userId) {
        try {
            // Tìm user để lấy email
            const user = await User.findById(userId).select("email");
            if (!user) {
                logger.error("User not found", { userId });
                throw new Error("User not found");
            }

            // Tìm tài liệu được chia sẻ với userId hoặc email
            const documents = await Document.find({
                $or: [
                    { "share.sharedWith.userId": userId },
                    { "share.sharedWith.email": user.email },
                ],
                deleted: false,
            }).select("_id name type mimeType url directUrl driveId size uploadDate starred");

            logger.info(`Fetched shared documents for user ${userId}`, {
                userId,
                documentCount: documents.length,
            });

            return documents;
        } catch (error) {
            logger.error(`Failed to fetch shared documents for user ${userId}`, {
                userId,
                error: error.message,
            });
            throw new Error(`Failed to fetch shared documents: ${error.message}`);
        }
    }

    static async addPermission(documentId, userId, { email, userId: targetUserId, permission }) {
        const document = await this.validateDocument(documentId, userId);

        let targetEmail = email;
        if (targetUserId) {
            const targetUser = await User.findById(targetUserId);
            if (!targetUser) {
                logger.error("User not found", { documentId, userId, targetUserId });
                throw new Error(`User with ID ${targetUserId} not found`);
            }
            targetEmail = targetUser.email;
        } else if (!targetEmail) {
            logger.error("Email or userId is required", { documentId, userId });
            throw new Error("Email or userId is required");
        }

        // Kiểm tra quyền hiện có
        const existingPermission = document.share.sharedWith.find(
            (item) => item.email === targetEmail
        );
        if (existingPermission && existingPermission.permission === permission) {
            return document.share.sharedWith; // Không cần gọi Google Drive API
        }

        try {
            let permissionId = existingPermission?.permissionId;
            if (!permissionId) {
                const response = await retryDriveRequest(
                    drive.permissions.create({
                        fileId: document.driveId,
                        requestBody: {
                            role: permission === "editor" ? "writer" : "reader",
                            type: "user",
                            emailAddress: targetEmail,
                        },
                    }),
                    `Failed to share with ${targetEmail}`
                );
                permissionId = response.data.id;
            } else if (existingPermission.permission !== permission) {
                // Cập nhật quyền nếu thay đổi
                await retryDriveRequest(
                    drive.permissions.update({
                        fileId: document.driveId,
                        permissionId,
                        requestBody: {
                            role: permission === "editor" ? "writer" : "reader",
                        },
                    }),
                    `Failed to update permission for ${targetEmail}`
                );
            }

            if (existingPermission) {
                document.share.sharedWith = document.share.sharedWith.map((item) =>
                    item.email === targetEmail
                        ? { email: targetEmail, userId: targetUserId, permission, permissionId }
                        : item
                );
            } else {
                document.share.sharedWith.push({
                    email: targetEmail,
                    userId: targetUserId,
                    permission,
                    permissionId,
                });
            }

            await document.save();

            logger.info("Permission added successfully", {
                documentId,
                userId,
                targetEmail,
                permission,
            });

            return document.share.sharedWith;
        } catch (error) {
            logger.error("Failed to add permission", {
                documentId,
                userId,
                targetEmail,
                error: error.message,
            });
            throw new Error(`Failed to add permission: ${error.message}`);
        }
    }

    static async getPermissions(documentId, userId) {
        const document = await this.validateDocument(documentId, userId);
        return document.share.sharedWith;
    }

    static async removePermission(documentId, userId, targetUserId) {
        const document = await this.validateDocument(documentId, userId);

        const sharedEntry = document.share.sharedWith.find(
            (item) => item.userId?.toString() === targetUserId
        );
        if (!sharedEntry) {
            logger.error("User not found in shared list", {
                documentId,
                userId,
                targetUserId,
            });
            throw new Error("User not found in shared list");
        }

        try {
            await retryDriveRequest(
                drive.permissions.delete({
                    fileId: document.driveId,
                    permissionId: sharedEntry.permissionId,
                }),
                `Failed to remove permission for ${sharedEntry.email}`
            );

            document.share.sharedWith = document.share.sharedWith.filter(
                (item) => item.userId?.toString() !== targetUserId
            );
            await document.save();

            logger.info("Permission removed successfully", {
                documentId,
                userId,
                targetUserId,
                email: sharedEntry.email,
            });

            return document.share.sharedWith;
        } catch (error) {
            logger.error("Failed to remove permission", {
                documentId,
                userId,
                targetUserId,
                error: error.message,
            });
            throw new Error(`Failed to remove permission: ${error.message}`);
        }
    }
}

module.exports = ShareService;
