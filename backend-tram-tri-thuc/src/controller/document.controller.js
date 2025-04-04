const Document = require("../models/Document.model");
const drive = require("../config/googleDrive");
const fs = require("fs");

const uploadDocument = async (req, res) => {
    try {
        const file = req.file;
        const userId = req.user.id;

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
            requestBody: { name: file.originalname },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path),
            },
        });
        console.log("Google Drive response:", driveResponse.data);

        const fileUrl = `https://drive.google.com/file/d/${driveResponse.data.id}/view`;

        // Lưu vào MongoDB
        console.log("Saving to MongoDB...");
        const document = new Document({
            name: file.originalname,
            url: fileUrl,
            userId,
            type: file.mimetype,
            size: file.size,
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
        const userId = req.user.id;
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
