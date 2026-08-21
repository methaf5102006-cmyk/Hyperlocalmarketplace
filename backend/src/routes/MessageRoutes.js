const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require("../controllers/MessageController");

// SEND MESSAGE
router.post("/", sendMessage);

// GET ROOM CHAT
router.get("/:roomId", getMessages);

module.exports = router;