const Message = require("../models/Message");

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { senderId, roomId, message } = req.body;

    if (!senderId || !roomId || !message) {
      return res.status(400).json({
        message: "senderId, roomId and message required",
      });
    }

    const newMessage = await Message.create({
      senderId,
      roomId,
      message,
    });

    // ✅ FIX: Convert to plain object so senderId/_id are strings not ObjectIds
    const msgObj = newMessage.toObject();
    msgObj._id = String(msgObj._id);
    msgObj.senderId = String(msgObj.senderId);

    const io = req.app.get("io");

    if (io) {
      io.in(roomId).emit("receiveMessage", msgObj);
    }

    res.status(201).json(msgObj);
  } catch (err) {
    console.log("MESSAGE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// GET MESSAGES
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({
        message: "roomId required",
      });
    }

    const messages = await Message.find({ roomId }).sort({
      createdAt: 1,
    });

    // ✅ FIX: Convert all messages to plain objects so senderId is a plain string
    const plainMessages = messages.map((m) => {
      const obj = m.toObject();
      obj._id = String(obj._id);
      obj.senderId = String(obj.senderId);
      return obj;
    });

    res.json(plainMessages);
  } catch (err) {
    console.log("GET MESSAGE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};