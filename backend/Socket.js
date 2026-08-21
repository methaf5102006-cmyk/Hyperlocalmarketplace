let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // ================= JOIN ROOM =================
    socket.on("joinRoom", (roomId) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log("📦 Joined room:", roomId);
    });

    // ================= CHAT MESSAGE =================
    socket.on("sendMessage", (data) => {
      try {
        const { roomId, message, senderId } = data;

        if (!roomId || !message || !senderId) return;

        io.to(roomId).emit("receiveMessage", {
          roomId,
          message,
          senderId,
          time: new Date(),
        });
      } catch (err) {
        console.log("Socket message error:", err.message);
      }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };