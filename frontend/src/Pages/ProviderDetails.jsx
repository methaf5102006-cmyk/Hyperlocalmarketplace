import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // ================= FETCH PROVIDER =================
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/providers/${id}`
        );

        setProvider(res.data);
      } catch (err) {
        console.log("API ERROR:", err.response?.data || err.message);
      }
    };

    fetchProvider();
  }, [id]);

  // ================= BOOKING =================
  const handleBooking = async () => {
    try {
      if (!user || !token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      // 🔴 ONLY FIX ADDED (ROLE CHECK)
      if (user?.role !== "customer") {
        alert("Only customers can hire providers");
        return;
      }

      if (!provider?._id) {
        alert("Provider not loaded yet");
        return;
      }

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          userId: user._id,
          providerId: provider?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking created successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      console.log("BOOKING ERROR:", err.response?.data || err.message);
      alert("Booking failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING STATE =================
  if (!provider) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10">
      <div className="max-w-4xl mx-auto bg-[#1e293b] rounded-3xl overflow-hidden">

        <img
          src={
            provider?.image ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          }
          className="w-full h-80 object-cover"
          alt="provider"
        />

        <div className="p-8">

          <h1 className="text-4xl font-bold">
            {provider?.name}
          </h1>

          <p className="text-blue-400 text-xl mt-2 capitalize">
            {provider?.service}
          </p>

          <p className="mt-5 text-gray-300">
            📍 {provider?.location}
          </p>

          <p className="mt-3 text-green-400 text-2xl font-bold">
            Rs {provider?.price}
          </p>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="mt-8 bg-blue-600 px-6 py-3 rounded-xl w-full"
          >
            {loading ? "Booking..." : "Hire Now"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProviderDetails;