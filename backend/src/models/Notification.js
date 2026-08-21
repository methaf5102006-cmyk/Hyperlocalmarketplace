const mongoose = require("mongoose");

// ================= NOTIFICATION SCHEMA =================
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "general", // e.g. booking, chat, system
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ================= EXPORT MODEL =================
module.exports = mongoose.model("Notification", notificationSchema);