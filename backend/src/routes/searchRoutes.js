const express = require("express");
const router = express.Router();

const { searchServices } = require("../controllers/searchController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Protected Route
router.get("/", authMiddleware, searchServices);

module.exports = router;