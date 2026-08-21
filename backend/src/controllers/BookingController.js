const Booking = require("../models/Booking");
const ServiceProvider = require("../models/ServiceProvider");

// ================= CREATE BOOKING =================
const createBooking = async (req, res) => {
  try {
    const { userId, providerId, location, coordinates } = req.body;

    if (!userId || !providerId) {
      return res.status(400).json({
        message: "userId & providerId required",
      });
    }

    const provider = await ServiceProvider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    const booking = await Booking.create({
      userId,
      providerId,
      service: provider.service,
      price: provider.price || 0,
      location: location || "",
      coordinates: coordinates || { lat: 0, lng: 0 },
      status: "pending",
    });

    const populated = await Booking.findById(booking._id)
      .populate("providerId", "name service location price")
      .populate("userId", "name email role");

    return res.status(201).json({
      message: "Booking created",
      booking: populated,
    });

  } catch (err) {
    console.log("BOOKING ERROR:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// ================= USER BOOKINGS =================
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.params.userId,
    })
      .populate("providerId", "name service location price image")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= PROVIDER BOOKINGS =================
const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      providerId: req.params.providerId,
    })
      .populate("userId", "name email")
      .populate("providerId", "name service")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE STATUS =================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "accepted", "rejected", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("providerId", "name service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
};