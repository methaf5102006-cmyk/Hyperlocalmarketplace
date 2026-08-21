const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const Message = require("./src/models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

// ================= ONLINE USERS STORE =================
const onlineUsers = new Map();

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // ================= JOIN ROOM =================
  socket.on("joinRoom", (roomId) => {
    if (!roomId) return;

    socket.join(roomId);
    console.log(`📦 Joined room: ${roomId}`);
  });

  // ================= SEND MESSAGE =================
  socket.on("sendMessage", async (data) => {
    try {
      const { roomId, message, senderId } = data;

      if (!roomId || !message || !senderId) return;

      const savedMessage = await Message.create({
        roomId,
        message,
        senderId,
        status: "sent", // ✅ FIX: explicitly set initial status
      });

      // ✅ FIX: Convert to plain object so senderId is a plain string,
      // not a Mongoose ObjectId — this ensures String(msg.senderId) === String(userId)
      // works correctly on the frontend for BOTH customer and provider
      const msgObj = savedMessage.toObject();
      msgObj._id = String(msgObj._id);
      msgObj.senderId = String(msgObj.senderId);

      // Broadcast to everyone in the room (sender + receiver both get it)
      io.to(roomId).emit("receiveMessage", msgObj);

      // OPTIONAL: delivery status
      io.to(roomId).emit("messageDelivered", msgObj._id);

    } catch (err) {
      console.log("Socket error:", err.message);
    }
  });

  // ================= SEEN MESSAGES =================
  socket.on("messageSeen", async ({ roomId, userId }) => {
    try {
      if (!roomId || !userId) return;

      await Message.updateMany(
        {
          roomId,
          senderId: { $ne: userId },
          status: { $ne: "seen" },
        },
        { status: "seen" }
      );

      io.to(roomId).emit("messagesSeen", { roomId, userId });
    } catch (err) {
      console.log("Seen error:", err.message);
    }
  });

  // ================= TYPING =================
  socket.on("typing", (roomId) => {
    socket.to(roomId).emit("typing", true);
  });

  socket.on("stopTyping", (roomId) => {
    socket.to(roomId).emit("typing", false);
  });

  // ================= ONLINE STATUS =================
  socket.on("userOnline", (userId) => {
    if (!userId) return;

    onlineUsers.set(userId, socket.id);

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/api/auth", require("./src/routes/AuthRoutes"));
app.use("/api/users", require("./src/routes/UserRoutes"));
app.use("/api/providers", require("./src/routes/serviceproviderRoutes"));
app.use("/api/bookings", require("./src/routes/BookingRoutes"));
app.use("/api/messages", require("./src/routes/MessageRoutes"));
app.use("/api/admin", require("./src/routes/AdminRoutes"));
app.use("/api/notifications", require("./src/routes/NotificationRoutes"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    message: err.message || "Server error",
  });
});

// ================= DB + SERVER =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB error:", err.message);
  });