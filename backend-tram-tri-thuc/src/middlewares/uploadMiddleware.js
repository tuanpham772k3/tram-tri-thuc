const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../../uploads");
        // Tạo thư mục uploads nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Giữ tên gốc cho cập nhật tài liệu, thêm timestamp để tránh trùng
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
        cb(null, `${Date.now()}-${originalName}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Kiểm tra file rỗng
        if (!file) {
            return cb(new Error("Không có file được gửi lên"));
        }

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Định dạng file không hỗ trợ. Chỉ hỗ trợ PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX."
                )
            );
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // Giới hạn 10MB
        files: 1, // Chỉ cho phép 1 file
    },
});

// Middleware để xóa file tạm sau khi xử lý
const cleanupUpload = (req, res, next) => {
    const originalSend = res.send;
    res.send = function () {
        // Xóa file tạm nếu tồn tại
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Failed to delete temp file:", err);
                }
            });
        }
        return originalSend.apply(res, arguments);
    };
    next();
};

module.exports = { upload, cleanupUpload };
