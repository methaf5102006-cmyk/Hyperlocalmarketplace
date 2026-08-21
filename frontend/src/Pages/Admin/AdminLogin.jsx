import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password }
      );

      const data = res.data;

      if (!data.token || !data.admin) {
        alert("Invalid admin response");
        return;
      }

      // ✅ FIX: SAME FORMAT AS NORMAL LOGIN
      const adminUser = {
        ...data.admin,
        role: "admin",
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(adminUser));

      navigate("/admin-dashboard");

    } catch (error) {
      console.log(error);
      alert("Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-md bg-white/10 p-8 rounded-3xl text-white">

        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-2xl">
            <Shield />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            className="w-full p-3 rounded-xl bg-white/10"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-xl bg-white/10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 py-3 rounded-xl"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;