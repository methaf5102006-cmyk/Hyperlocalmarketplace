import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";

// ✅ FIX: Create socket ONCE outside component so it never gets killed on re-render
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
});

const Chat = () => {
  const { roomId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  // ================= LOAD MESSAGES =================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${roomId}`
        );
        setMessages(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    if (roomId) fetchMessages();
  }, [roomId]);

  // ================= SOCKET =================
  useEffect(() => {
    if (!roomId || !userId) return;

    const joinRoom = () => {
      socket.emit("joinRoom", roomId);
      socket.emit("messageSeen", { roomId, userId });
    };

    socket.on("connect", joinRoom);

    if (socket.connected) {
      joinRoom();
    }

    const handleMessage = (data) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => String(m._id) === String(data._id)
        );
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receiveMessage", handleMessage);

    const handleTyping = (state) => setTyping(state);
    socket.on("typing", handleTyping);

    const handleMessagesSeen = () => {
      setMessages((prev) =>
        prev.map((m) =>
          String(m.senderId) === String(userId)
            ? { ...m, status: "seen" }
            : m
        )
      );
    };
    socket.on("messagesSeen", handleMessagesSeen);

    const handleDelivered = (msgId) => {
      setMessages((prev) =>
        prev.map((m) =>
          String(m._id) === String(msgId) ? { ...m, status: "delivered" } : m
        )
      );
    };
    socket.on("messageDelivered", handleDelivered);

    // ✅ FIX: Only remove listeners — NEVER disconnect
    return () => {
      socket.off("connect", joinRoom);
      socket.off("receiveMessage", handleMessage);
      socket.off("typing", handleTyping);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("messageDelivered", handleDelivered);
    };
  }, [roomId, userId]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      message,
      senderId: userId,
    });

    setMessage("");
  };

  // ================= TYPING HANDLER =================
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", roomId);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", roomId);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* HEADER */}
      <div className="bg-black text-white px-6 py-4">
        <h1 className="text-xl font-bold">Chat Room</h1>
        <p className="text-sm">Room: {roomId}</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => {
          const isMe = String(msg.senderId) === String(userId);

          return (
            <div
              key={msg._id || i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 my-1 rounded-lg max-w-xs ${
                  isMe ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {msg.message}

                {/* STATUS TICK */}
                {isMe && (
                  <div className="text-xs mt-1 opacity-70">
                    {msg.status === "seen"
                      ? "✓✓ Seen"
                      : msg.status === "delivered"
                      ? "✓ Delivered"
                      : "✓ Sent"}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* TYPING */}
        {typing && (
          <p className="text-sm text-gray-500 px-2">
            typing...
          </p>
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 flex gap-2 bg-white">
        <input
          className="flex-1 border p-2"
          value={message}
          onChange={handleTyping}
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;