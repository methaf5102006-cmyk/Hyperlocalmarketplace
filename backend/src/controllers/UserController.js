const User = require("../models/User");
const generateOTP = require("../utils/otpGenerator");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const dns = require("dns").promises; // ✅ Node.js built-in — koi install nahi

// ================= REGISTER =================
exports.createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // ✅ FREE DNS CHECK — Koi API nahi, email real world mein exist karti hai ya nahi
    const domain = email.split("@")[1];
    if (!domain) {
      return res.status(400).json({ message: "This email does not exist in the real world." });
    }

    try {
      await dns.resolveMx(domain);
    } catch (err) {
      return res.status(400).json({ message: "This email does not exist in the real world." });
    }
    // ✅ Email real hai — aage chalte hain

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();

    const user = await User.create({
      email,
      password,
      role,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(email, `Your OTP is: ${otp}`);

    res.json({ message: "Account created. Verify OTP" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify email first" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    res.json({ message: "Login successful", token, user: safeUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET USERS =================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET USER =================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE USER =================
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE USER =================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};