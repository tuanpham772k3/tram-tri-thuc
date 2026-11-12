const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

const uploadBookFiles = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "fileUrl", maxCount: 1 },
]);

module.exports = uploadBookFiles;
