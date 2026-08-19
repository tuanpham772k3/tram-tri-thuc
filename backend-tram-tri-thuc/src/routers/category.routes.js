const express = require("express");
const { getCategories } = require("../controller/category.controller");

const router = express.Router();

router.get("/", getCategories);

module.exports = router;
