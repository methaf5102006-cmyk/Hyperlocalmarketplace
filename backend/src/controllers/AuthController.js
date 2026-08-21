const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const jwt = require("jsonwebtoken");

// ✅ ADD THIS (IMPORTANT)
const sendEmail = require("../utils/sendEmail");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("OTP GENERATED:", otp);

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role,
      isVerified: false,
      otp: otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    if (role === "electrician" || role === "plumber") {
      await ServiceProvider.create({
        userId: user._id,
        name,
        service: role,
      });
    }

    // ✅ FIX: SEND OTP EMAIL (THIS WAS MISSING)
    await sendEmail(cleanEmail, otp);
    console.log("OTP EMAIL SENT TO:", cleanEmail);

    res.status(201).json({
      message: "Registered successfully. Verify OTP sent to email",
      email: cleanEmail,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired. Please register again ❌" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully ✅ You can now login."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    const match = await user.comparePassword(cleanPassword);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ FIXED: same secret as authMiddleware
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretKey123",
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      token,
      user: userWithoutPassword,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};