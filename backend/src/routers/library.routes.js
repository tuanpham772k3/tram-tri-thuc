const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { getLibraryBooks, getBookToRead, updateReadingProgress } = require("../controller/library.controller");

const router = express.Router();

router.get("/", authenticate, getLibraryBooks);
router.get("/:bookId/read", authenticate, getBookToRead);
router.patch("/:bookId/progress", authenticate, updateReadingProgress);

module.exports = router;
