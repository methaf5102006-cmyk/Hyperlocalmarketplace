const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");

// ================= GET NOTIFICATIONS =================
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notifications = await Notification.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Notification Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;