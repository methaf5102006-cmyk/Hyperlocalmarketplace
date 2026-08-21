const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

// ================= ADMIN LOGIN =================
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    // ================= CHECK EMAIL =================
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ================= CHECK PASSWORD =================
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ================= CREATE TOKEN =================
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET || "secretKey123",
      {
        expiresIn: "1d",
      }
    );

    // ================= SUCCESS RESPONSE =================
    return res.status(200).json({
      message: "Admin login successful",

      token,

      role: "admin",

      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name || "Admin",
      },
    });

  } catch (error) {

    console.log(
      "ADMIN LOGIN ERROR:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;