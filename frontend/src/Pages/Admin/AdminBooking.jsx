import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="p-8 bg-[#0f172a] text-white min-h-screen">
      <h1 className="text-3xl mb-6">Bookings</h1>

      {bookings.map((b) => (
        <div key={b._id} className="bg-[#1e293b] p-4 mb-3 rounded-xl">
          <p>{b.service}</p>
          <p className="text-gray-400">{b.status}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;