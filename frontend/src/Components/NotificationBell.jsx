import React from "react";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  return (
    <div className="relative cursor-pointer">
      <FaBell size={22} />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
        3
      </span>
    </div>
  );
};

export default NotificationBell;