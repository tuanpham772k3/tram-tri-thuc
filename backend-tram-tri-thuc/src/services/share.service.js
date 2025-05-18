const mongoose = require("mongoose");
const Document = require("../models/Document.model");
const User = require("../models/User.model");
const drive = require("../config/googleDrive.config");
const { retryDriveRequest } = require("../utils/driveHelper");
const logger = require("../utils/logger");
const { sendShareNotification } = require("../utils/email");

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

            const userEmail = user.email;
            // Tìm tài liệu được chia sẻ với userId hoặc email
            const documents = await Document.find({
                "share.sharedWith": {
                    $elemMatch: {
                        $or: [
                            { userId: userId ? new mongoose.Types.ObjectId(userId) : null },
                            { email: userEmail },
                        ],
                    },
                },
                deleted: false,
            })
                .populate("userId", "email avatar")
                .lean();

            logger.info(`Fetched shared documents for user ${userId}`, {
                userId,
                userEmail,
                documentCount: documents.length,
                documentIds: documents.map((doc) => doc._id.toString()),
            });

            return documents;
        } catch (error) {
            logger.error(`Failed to fetch shared documents for user ${userId}`, {
                userId,
                error: error.message,
                stack: error.stack,
            });
            throw new Error(`Failed to fetch shared documents: ${error.message}`);
        }
    }

    static async addPermission(documentId, userId, { email, userId: targetUserId, permission }) {
        const document = await this.validateDocument(documentId, userId);
        let targetEmail = email;
        const owner = await User.findById(userId).select("email");

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

        // Kiểm tra email trùng với chủ sở hữu
        if (targetEmail === owner.email) {
            logger.error("Cannot share with owner", { documentId, userId, targetEmail });
            throw new Error("Cannot share with yourself");
        }

        // Kiểm tra quyền hiện có
        const existingPermission = document.share.sharedWith.find(
            (item) => item.email === targetEmail
        );
        if (existingPermission && existingPermission.permission === permission) {
            logger.info("Permission already exists", {
                documentId,
                userId,
                targetEmail,
                permission,
            });
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
                        fields: "id",
                    }),
                    `Failed to share with ${targetEmail}`
                );

                permissionId = response.id;
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

            // (Tùy chọn) Gửi email thông báo
            try {
                await sendShareNotification(targetEmail, document.name, permission);
            } catch (emailError) {
                logger.warn("Failed to send share notification", {
                    targetEmail,
                    documentId,
                    error: emailError.message,
                });
            }

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

    static async getSharedDocument(documentId, userId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(documentId)) {
                logger.error("Invalid document ID", { documentId, userId });
                throw new Error("Invalid document ID");
            }

            const user = await User.findById(userId).select("email");
            if (!user) {
                logger.error("User not found", { documentId, userId });
                throw new Error("User not found");
            }

            const document = await Document.findOne({
                _id: documentId,
                deleted: false,
                $or: [
                    { userId }, // Owner
                    {
                        "share.sharedWith": {
                            $elemMatch: {
                                $or: [
                                    { userId: userId ? new mongoose.Types.ObjectId(userId) : null },
                                    { email: user.email },
                                ],
                            },
                        },
                    },
                ],
            })
                .populate("userId", "email avatar")
                .lean();

            if (!document) {
                logger.error("Document not found or not accessible", { documentId, userId });
                throw new Error("Document not found or you don't have access");
            }

            let permission = "viewer";
            if (document.userId && document.userId.toString() === userId) {
                permission = "owner";
            } else {
                const sharedEntry = document.share.sharedWith.find(
                    (item) =>
                        (item.userId && item.userId.toString() === userId) ||
                        item.email === user.email
                );
                permission = sharedEntry ? sharedEntry.permission : "viewer";
            }

            logger.info("Shared document accessed", { documentId, userId, permission });

            return {
                document: {
                    _id: document._id,
                    name: document.name,
                    type: document.type,
                    mimeType: document.mimeType,
                    url: document.url,
                    directUrl: document.directUrl,
                    driveId: document.driveId,
                    size: document.size,
                    uploadDate: document.uploadDate,
                    previewUrl: document.share.previewUrl,
                    userId: document.userId,
                },
                permission,
            };
        } catch (error) {
            logger.error("Failed to access shared document", {
                documentId,
                userId,
                error: error.message,
                stack: error.stack,
            });
            throw new Error(`Failed to access shared document: ${error.message}`);
        }
    }

    static async editDocument(documentId, userId, file) {
        try {
            const document = await Document.findOne({
                _id: documentId,
                deleted: false,
            });
            if (!document) {
                throw new Error("Document not found or has been deleted");
            }

            // Kiểm tra quyền editor hoặc owner
            const user = await User.findById(userId).select("email");
            if (!user) {
                throw new Error("User not found");
            }

            const isOwner = document.userId.toString() === userId;
            const hasEditorPermission = document.share.sharedWith.some(
                (item) =>
                    (item.userId?.toString() === userId || item.email === user.email) &&
                    item.permission === "editor"
            );

            if (!isOwner && !hasEditorPermission) {
                throw new Error("You don't have permission to edit this document");
            }

            // Upload file mới lên Google Drive
            const fileMetadata = {
                name: document.name,
            };
            const media = {
                mimeType: file.mimetype,
                body: require("fs").createReadStream(file.path),
            };

            const response = await retryDriveRequest(
                drive.files.update({
                    fileId: document.driveId,
                    requestBody: fileMetadata,
                    media,
                }),
                "Failed to update file on Google Drive"
            );

            // Cập nhật metadata trong MongoDB
            document.mimeType = file.mimetype;
            document.size = file.size;
            document.url = `https://drive.google.com/file/d/${document.driveId}/view`;
            document.directUrl = `https://drive.google.com/uc?export=download&id=${document.driveId}`;
            document.share.previewUrl = `https://docs.google.com/viewer?url=https://drive.google.com/uc?id=${document.driveId}&embedded=true`;
            document.uploadDate = new Date();

            await document.save();

            // Gửi email thông báo cho người được chia sẻ
            try {
                const sharedEmails = document.share.sharedWith.map((item) => item.email);
                for (const email of sharedEmails) {
                    await sendShareNotification(
                        email,
                        document.name,
                        "updated",
                        `Tài liệu "${document.name}" đã được cập nhật bởi ${user.email}.`
                    );
                }
            } catch (emailError) {
                logger.warn("Failed to send update notification", {
                    documentId,
                    userId,
                    error: emailError.message,
                });
            }

            logger.info("Document edited successfully", {
                documentId,
                userId,
                fileName: file.originalname,
            });

            const populatedDocument = await Document.findById(documentId)
                .populate("userId", "email avatar")
                .lean();

            return {
                document: {
                    _id: document._id,
                    name: document.name,
                    type: document.type,
                    mimeType: document.mimeType,
                    url: document.url,
                    directUrl: document.directUrl,
                    driveId: document.driveId,
                    size: document.size,
                    uploadDate: document.uploadDate,
                    previewUrl: document.share.previewUrl,
                    userId: populatedDocument.userId,
                },
                permission: isOwner ? "owner" : "editor",
            };
        } catch (error) {
            logger.error("Failed to edit document", {
                documentId,
                userId,
                error: error.message,
            });
            throw error;
        }
    }
}

module.exports = ShareService;
