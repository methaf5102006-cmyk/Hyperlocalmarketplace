import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

// ✅ FIX: Create socket ONCE outside component so it never gets killed on re-render
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
});

const ChatRoom = () => {
  const { roomId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const messagesEndRef = useRef(null);

  // ================= LOAD OLD MESSAGES =================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${roomId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (roomId) fetchMessages();
  }, [roomId]);

  // ================= SOCKET =================
  useEffect(() => {
    if (!roomId || !userId) return;

    // ================= JOIN ROOM =================
    const joinRoom = () => {
      socket.emit("joinRoom", roomId);
      console.log("✅ Joined room:", roomId);
    };

    socket.on("connect", joinRoom);

    if (socket.connected) {
      joinRoom();
    }

    // ================= RECEIVE MESSAGE =================
    const handleMessage = (data) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m._id && data._id && String(m._id) === String(data._id)
        );
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receiveMessage", handleMessage);

    // ✅ FIX: Only remove listeners on cleanup — NEVER disconnect
    // Disconnecting caused "WebSocket closed before connection established"
    return () => {
      socket.off("connect", joinRoom);
      socket.off("receiveMessage", handleMessage);
    };
  }, [roomId, userId]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      senderId: userId,
      message,
    };

    // ✅ FIX: Only emit — server broadcasts back to room including sender
    socket.emit("sendMessage", msgData);

    setMessage("");
  };

  return (
    <div style={styles.container}>
      {/* CHAT BOX */}
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            style={{
              ...styles.message,
              alignSelf:
                String(msg.senderId) === String(userId)
                  ? "flex-end"
                  : "flex-start",
              backgroundColor:
                String(msg.senderId) === String(userId) ? "#DCF8C6" : "#fff",
            }}
          >
            {msg.message}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BOX */}
      <div style={styles.inputBox}>
        <input
          type="text"
          value={message}
          placeholder="Type message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

// ================= SIMPLE STYLES =================
const styles = {
  container: {
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    padding: 10,
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: 10,
    background: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    padding: "10px 15px",
    borderRadius: 10,
    maxWidth: "60%",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  inputBox: {
    display: "flex",
    padding: 10,
    gap: 10,
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};