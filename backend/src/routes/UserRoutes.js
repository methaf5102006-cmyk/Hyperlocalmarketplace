const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getUsers,
  verifyOTP,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ ADD THIS (multer)
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= AUTH ROUTES =================
router.post("/register", createUser);
router.post("/login", loginUser);

// ================= OTP VERIFICATION =================
router.post("/verify-otp", verifyOTP);

// ================= USERS =================
router.get("/", getUsers);

// ✅ KEEP SAME — ONLY ADD upload HERE
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, upload.single("profilePic"), updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;