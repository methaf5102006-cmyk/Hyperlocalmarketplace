const express = require("express");
const router = express.Router();

const { searchServices } = require("../controllers/SearchController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Protected Route
router.get("/", authMiddleware, searchServices);

module.exports = router;
