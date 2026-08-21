import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const userId = user?._id || user?.id;
  const role = user?.role;

  // ✅ FETCH NOTIFICATIONS (UPDATED LOGIC)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(res.data || []);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        <div className="space-y-3">

          {notifications.map((n) => (
            <div
              key={n._id}
              className="bg-white p-4 rounded-xl shadow border"
            >

              <p className="text-gray-800">
                {n.message}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Notifications;