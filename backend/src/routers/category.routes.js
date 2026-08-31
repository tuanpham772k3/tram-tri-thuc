const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { getCategories } = require("../controller/category.controller");

const router = express.Router();

router.get("/", authenticate, getCategories);

module.exports = router;
