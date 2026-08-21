const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
} = require("../controllers/BookingController");

const authMiddleware = require("../middleware/authMiddleware");

// ================= ROUTES =================

// ✅ GET ALL BOOKINGS (admin dashboard)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const Booking = require("../models/Booking");

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("providerId", "name service")
      .sort({ createdAt: -1 });

    console.log("📋 Total bookings:", bookings.length);

    res.json(bookings);
  } catch (err) {
    console.log("ALL BOOKINGS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// CREATE BOOKING
router.post("/", authMiddleware, createBooking);

// GET USER BOOKINGS
router.get("/user/:userId", authMiddleware, getUserBookings);

// GET PROVIDER BOOKINGS
router.get("/provider/:providerId", authMiddleware, getProviderBookings);

// UPDATE STATUS
router.put("/:id", authMiddleware, updateBookingStatus);

// ================= FEEDBACK =================
router.post("/:id/feedback", authMiddleware, async (req, res) => {
  try {
    const { feedback, rating } = req.body;

    const Booking = require("../models/Booking");

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { feedback, rating },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
