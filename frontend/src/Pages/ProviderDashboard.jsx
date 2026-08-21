import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // ✅ ADDED

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [requests, setRequests] = useState([]);
  const [providerProfile, setProviderProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const userId = user?._id || user?.id;

  // ================= ROLE PROTECTION =================
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    if (!["electrician", "plumber"].includes(user?.role)) {
      navigate("/dashboard");
      return;
    }
  }, []);

  // ================= LOAD PROVIDER PROFILE =================
  useEffect(() => {
    const loadProvider = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/providers");
        const me = res.data.find(
          (p) => String(p?.userId?._id || p?.userId) === String(userId)
        );
        setProviderProfile(me || null);
      } catch (e) {
        console.log(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId) loadProvider();
  }, [userId]);

  const providerId = providerProfile?._id;

  // ================= LOAD BOOKINGS =================
  useEffect(() => {
    const fetchBookings = async () => {
      if (!providerId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/provider/${providerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(res.data || []);

        // auto-generate notifications from bookings
        const notifs = (res.data || []).map((b) => ({
          id: b._id,
          message: `New request from ${b.userId?.name || "a customer"} for ${b.service}`,
          type: "request",
          bookingId: b._id,
        }));
        setNotifications(notifs);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchBookings();
  }, [providerId]);

  // ================= UPDATE STATUS =================
  const updateStatus = async (e, id, status) => {
    e.stopPropagation();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: res.data.status } : r))
      );
    } catch (err) {
      console.log(err.message);
      alert("Failed to update status ❌");
    }
  };

  // ================= CHAT =================
  const openChat = (e, customerId) => {
    e.stopPropagation();
    if (!customerId || !providerProfile) {
      alert("Chat unavailable ❌");
      return;
    }
    const provId = String(providerProfile?.userId?._id || providerProfile?.userId);
    const roomId = `${String(customerId)}_${provId}`;
    navigate(`/chat/${roomId}`);
  };

  // ================= MAP =================
  const handleCardClick = (coordinates) => {
    if (coordinates?.lat && coordinates?.lng) {
      setSelectedLocation({ lat: coordinates.lat, lng: coordinates.lng });
    } else {
      setSelectedLocation({
        lat: 33.6 + Math.random() * 0.05,
        lng: 73.0 + Math.random() * 0.05,
      });
    }
  };

  // ================= EDIT PROFILE =================
 const goToEditProfile = () => {
  console.log("BUTTON CLICKED");
  console.log("Provider Profile:", providerProfile);

  const id = providerProfile?._id;

  if (id) {
    navigate(`/profile/${id}`);
  } else {
    alert("Profile not found ❌");
  }
};
  // ================= DELETE PROFILE =================
  const deleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/providers/${providerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/register");
    } catch (err) {
      alert("Failed to delete profile ❌");
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================= FILTER =================
  const filtered = requests.filter((r) => {
    const matchSearch =
      r?.service?.toLowerCase().includes(search.toLowerCase()) ||
      r?.userId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ? true : r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <p className="text-gray-600 font-medium text-lg animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f0eafa] flex">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 min-h-screen bg-[#ede8f7] flex flex-col justify-between py-8 px-6 shadow-lg">

        <div>
          {/* LOGO */}
          <h1 className="text-2xl font-black text-gray-800 mb-10">
            SkillLink
          </h1>

          {/* AVATAR */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow">
              {providerProfile?.name?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <p className="mt-3 font-bold text-gray-800 text-lg text-center">
              {providerProfile?.name || "Provider"}
            </p>
            <p className="text-gray-500 text-sm capitalize">
              {providerProfile?.service || "Service Provider"}
            </p>
          </div>

          {/* NAV */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === "dashboard"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:bg-white/60"
              }`}
            >
              <span className="text-lg">👤</span> Dashboard
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === "notifications"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:bg-white/60"
              }`}
            >
              <span className="text-lg">✉️</span> Notifications
              {notifications.length > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === "requests"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:bg-white/60"
              }`}
            >
              <span className="text-lg">📋</span> Requests
              {stats.pending > 0 && (
                <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pending}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={goToEditProfile}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Edit Profile
          </button>
          <button
            onClick={deleteProfile}
            className="w-full bg-gray-800 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Delete Profile
          </button>
          <button
            onClick={logout}
            className="w-full bg-gray-800 hover:bg-gray-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Log out
          </button>
        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-6">
              Your Dashboard
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* PERSONAL INFORMATION */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-700 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Name</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1">
                      {providerProfile?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Mobile No.</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1">
                      {providerProfile?.phone || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Email</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1">
                      {providerProfile?.userId?.email || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Role</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1 capitalize">
                      {providerProfile?.service || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* YOUR LOCATION */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-700 mb-4">
                  Your Location
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Country</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1">
                      Pakistan
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">State</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1">
                      Punjab
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Street Address
                    </label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1">
                      {providerProfile?.location || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* YOUR EXPERTISE */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-700 mb-4">
                  Your Expertise
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500 text-sm">Service</span>
                    <span className="font-semibold capitalize text-gray-800">
                      {providerProfile?.service || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500 text-sm">Price</span>
                    <span className="font-semibold text-gray-800">
                      Rs. {providerProfile?.price || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500 text-sm">Rating</span>
                    <span className="font-semibold text-gray-800">
                      ⭐ {providerProfile?.rating || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-500 text-sm">Available</span>
                    <span
                      className={`font-semibold ${
                        providerProfile?.isAvailable
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {providerProfile?.isAvailable ? "Yes ✅" : "No ❌"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ABOUT */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-700 mb-4">About</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {providerProfile?.bio ||
                    "No bio added yet. Click Edit Profile to add information about yourself."}
                </p>

                {/* STATS */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-yellow-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-black text-yellow-600">
                      {stats.pending}
                    </p>
                    <p className="text-xs text-yellow-500 mt-1">Pending</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-black text-green-600">
                      {stats.accepted}
                    </p>
                    <p className="text-xs text-green-500 mt-1">Accepted</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-black text-blue-600">
                      {stats.completed}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">Completed</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-black text-gray-600">
                      {stats.total}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===== NOTIFICATIONS TAB ===== */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-6">
              Notifications
            </h2>

            <div className="bg-white rounded-2xl shadow p-6">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No notifications yet
                </p>
              ) : (
                <div className="flex flex-col divide-y">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-4"
                    >
                      <p className="text-gray-600 text-sm">{n.message}</p>
                      <button
                        onClick={() => setActiveTab("requests")}
                        className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-lg ml-4 whitespace-nowrap"
                      >
                        Check Request
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== REQUESTS TAB ===== */}
        {activeTab === "requests" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div>
              <h2 className="text-3xl font-black text-gray-800 mb-6">
                Requests
              </h2>

              {/* SEARCH + FILTER */}
              <div className="bg-white rounded-2xl shadow p-4 mb-5">
                <input
                  className="w-full p-3 border rounded-xl mb-3 text-sm"
                  placeholder="Search services or customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="w-full p-3 border rounded-xl text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* REQUEST CARDS */}
              <div className="flex flex-col gap-4">
                {filtered.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No requests found
                  </p>
                ) : (
                  filtered.map((r) => (
                    <div
                      key={r._id}
                      className="bg-white rounded-2xl shadow p-5 cursor-pointer hover:shadow-md transition"
                      onClick={() => handleCardClick(r.coordinates)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 capitalize">
                          {r.service}
                        </h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium
                          ${r.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                          ${r.status === "accepted" ? "bg-green-100 text-green-700" : ""}
                          ${r.status === "rejected" ? "bg-red-100 text-red-700" : ""}
                          ${r.status === "completed" ? "bg-blue-100 text-blue-700" : ""}
                        `}
                        >
                          {r.status}
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mt-1">
                        👤 {r.userId?.name || "Customer"}
                      </p>

                      {r.location && (
                        <p className="text-gray-400 text-xs mt-1">
                          📍 {r.location}
                        </p>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={(e) => updateStatus(e, r._id, "accepted")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => updateStatus(e, r._id, "rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm"
                        >
                          Reject
                        </button>
                        <button
                          onClick={(e) => openChat(e, r.userId?._id)}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-xl text-sm"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* MAP */}
            <div className="bg-white rounded-2xl shadow overflow-hidden h-[600px] sticky top-8">
              <MapContainer
                center={[33.6, 73.0]}
                zoom={12}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                  >
                    <Popup>Customer Location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ProviderDashboard;