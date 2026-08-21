const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: String,
  provider: String,
  rating: Number,
  comment: String,
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);