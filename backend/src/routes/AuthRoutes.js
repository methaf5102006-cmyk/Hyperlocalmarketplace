const express = require("express");
const router = express.Router();

const authController = require("../controllers/AuthController");

// ================= SAFE WRAPPER =================
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ================= AUTH ROUTES =================
router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));

// 🔥 NEW ROUTE: VERIFY OTP
router.post("/verify-otp", asyncHandler(authController.verifyOtp));

module.exports = router;