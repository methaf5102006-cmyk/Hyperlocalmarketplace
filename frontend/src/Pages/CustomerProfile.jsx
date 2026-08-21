import React, { useState } from "react";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerProfile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const userId = user?._id || user?.id;

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile saved successfully ✅");
      navigate("/dashboard");

    } catch (err) {
      console.log(err.message);
      alert("Failed to save ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden py-10 px-4">

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          <div className="grid md:grid-cols-2 gap-5">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="p-3 rounded-xl bg-white/10 text-white border"
              placeholder="Name"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="p-3 rounded-xl bg-white/10 text-white border"
              placeholder="Email"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="p-3 rounded-xl bg-white/10 text-white border"
              placeholder="Phone"
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="p-3 rounded-xl bg-white/10 text-white border"
              placeholder="Address"
            />

          </div>

          <div className="mt-8">
            <button
              onClick={saveProfile}
              className="bg-blue-600 px-6 py-3 rounded-xl text-white flex items-center gap-2"
            >
              <Save size={18} /> Save Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;