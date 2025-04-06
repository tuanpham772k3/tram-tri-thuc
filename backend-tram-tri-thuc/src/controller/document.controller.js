const Document = require("../models/Document.model");
const drive = require("../config/googleDrive");
const fs = require("fs");

const uploadDocument = async (req, res) => {
    try {
        const file = req.file;
        const userId = req.user;

        if (!file) {
            console.log("No file received");
            return res.status(400).json({
                success: false,
                message: "Không có file được tải lên",
            });
        }
        console.log("File received:", file);

        // Upload lên Google Drive
        console.log("Uploading to Google Drive...");
        const driveResponse = await drive.files.create({
            requestBody: {
                name: file.originalname,
                parents: ["1-fgLMBdBpSISgbSTAuLzt-5VM_-K6BB7"],
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path),
            },
            fields: "id, webContentLink",
        });
        console.log("Google Drive response:", driveResponse.data);

        // Cấu hình quyền truy cập công khai để dễ dàng embed
        await drive.permissions.create({
            fileId: driveResponse.data.id,
            requestBody: {
                role: "reader",
                type: "anyone", // Cho phép bất kỳ ai có link đều có thể xem
            },
        });

        // Chia sẻ file với tài khoản cá nhân của bạn
        await drive.permissions.create({
            fileId: driveResponse.data.id,
            requestBody: {
                role: "writer", // Hoặc 'reader' nếu chỉ cần xem
                type: "user",
                emailAddress: "tuanphamu23@gmail.com", // Thay bằng email của bạn
            },
        });

        const fileUrl = `https://drive.google.com/file/d/${driveResponse.data.id}/view`;
        const directUrl = driveResponse.data.webContentLink; // Link tải trực tiếp

        // Lưu vào MongoDB
        console.log("Saving to MongoDB...");
        const document = new Document({
            name: file.originalname,
            url: fileUrl,
            directUrl,
            userId,
            type: file.mimetype,
            size: file.size,
            driveId: driveResponse.data.id, // Lưu thêm ID để dễ xử lý
        });
        await document.save();
        console.log("Saved to MongoDB");

        // Xóa file tạm
        console.log("Deleting temp file:", file.path);
        await require("fs").promises.unlink(file.path);
        console.log("Temp file deleted");

        res.json({
            success: true,
            file: {
                name: file.originalname,
                url: fileUrl,
                directUrl,
                id: driveResponse.data.id,
            },
        });
    } catch (error) {
        console.error("Upload Error:", error.message, error.stack);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi upload",
        });
    }
};

const getDocuments = async (req, res) => {
    try {
        const userId = req.user;
        const documents = await Document.find({ userId });
        res.json({ success: true, documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách",
        });
    }
};

module.exports = { uploadDocument, getDocuments };
