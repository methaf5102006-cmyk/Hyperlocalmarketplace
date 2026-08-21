const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },

    service: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      default: "",
    },

    // 📍 Leaflet coordinates
    coordinates: {
      lat: {
        type: Number,
        default: 0,
      },

      lng: {
        type: Number,
        default: 0,
      },
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },

    // ✅ FEEDBACK & RATING (ADDED ONLY)
    feedback: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);