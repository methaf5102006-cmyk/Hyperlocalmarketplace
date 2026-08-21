import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data.length);
    };
    fetch();
  }, []);

  return (
    <div className="p-8 bg-[#0f172a] text-white min-h-screen">
      <h1 className="text-3xl mb-6">Analytics</h1>
      <p>Total Users: {users}</p>
    </div>
  );
};

export default AdminAnalytics;