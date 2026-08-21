import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRevenue = () => {
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

  const revenue = bookings.length * 100;

  return (
    <div className="p-8 bg-[#0f172a] text-white min-h-screen">
      <h1 className="text-3xl mb-6">Revenue</h1>
      <p>Total Revenue: ${revenue}</p>
    </div>
  );
};

export default AdminRevenue;