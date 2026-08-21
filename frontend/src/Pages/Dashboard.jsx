import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// ================= ICONS =================
const defaultIcon = L.icon({ iconUrl, shadowUrl, iconSize: [25, 41] });
L.Marker.prototype.options.icon = defaultIcon;

// Blue icon = customer
const customerIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Red icon = provider
const providerIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ================= LOCATION PICKER =================
const LocationPicker = ({ setLocation, setCoords }) => {
  useMapEvents({
    click(e) {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      setLocation(`${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
    },
  });
  return null;
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [providers, setProviders] = useState([]);
  const [providerCoords, setProviderCoords] = useState({}); // { providerId: {lat, lng} }
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [feedbackMap, setFeedbackMap] = useState({});
  const [ratingMap, setRatingMap] = useState({});
  const [loadingBooking, setLoadingBooking] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const userId = user?._id || user?.id;

  // ================= ROLE GUARD =================
  useEffect(() => {
    if (!token || !user) { navigate("/login"); return; }
    if (["electrician", "plumber"].includes(user?.role)) {
      navigate("/provider-dashboard"); return;
    }
  }, []);

  // ================= AUTO GPS ON LOAD ✅ =================
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      },
      () => console.log("Location permission denied")
    );
  }, []);

  // ================= FETCH PROVIDERS =================
  useEffect(() => {
    axios.get("http://localhost:5000/api/providers")
      .then(res => setProviders(res.data || []))
      .catch(err => console.log(err.message));
  }, []);

  // ================= GEOCODE PROVIDERS (text location → lat/lng) ✅ =================
  useEffect(() => {
    if (providers.length === 0) return;

    const geocodeProvider = async (provider) => {
      // Agar provider ke paas already coordinates hain toh direct use karo
      if (provider.coordinates?.lat && provider.coordinates?.lng) {
        setProviderCoords(prev => ({
          ...prev,
          [provider._id]: { lat: provider.coordinates.lat, lng: provider.coordinates.lng }
        }));
        return;
      }

      // Warna text location ko geocode karo
      if (!provider.location) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(provider.location + ", Pakistan")}&format=json&limit=1`
        );
        const data = await res.json();
        if (data && data[0]) {
          setProviderCoords(prev => ({
            ...prev,
            [provider._id]: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
          }));
        }
      } catch (e) {
        console.log("Geocode failed for:", provider.name);
      }
    };

    // Har provider ko geocode karo (with delay to avoid rate limiting)
    providers.forEach((p, i) => {
      setTimeout(() => geocodeProvider(p), i * 300);
    });
  }, [providers]);

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId]);

  // ================= FETCH NOTIFICATIONS =================
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/notifications/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setNotifications(res.data || []))
      .catch(err => console.log(err.message));
  }, [userId]);

  // ================= REQUEST SERVICE =================
  const handleRequest = async (providerId) => {
    if (!coords) { alert("Please pin your location on the map first 📍"); return; }
    setLoadingBooking(providerId);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        { userId, providerId, location, coordinates: coords },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(prev => [res.data?.booking || res.data, ...prev]);
      alert("Request sent successfully ✅");
      setLocation(""); setCoords(null);
      setActiveTab("history");
    } catch (err) {
      console.log(err.message);
      alert("Request failed ❌");
    } finally {
      setLoadingBooking(null);
    }
  };

  // ================= SUBMIT FEEDBACK =================
  const submitFeedback = async (bookingId) => {
    const feedback = feedbackMap[bookingId];
    const rating = ratingMap[bookingId];
    if (!feedback || !rating) { alert("Please add rating and feedback ⚠️"); return; }
    try {
      await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/feedback`,
        { feedback, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback submitted ✅");
      setFeedbackMap(prev => ({ ...prev, [bookingId]: "" }));
      setRatingMap(prev => ({ ...prev, [bookingId]: "" }));
      fetchBookings();
    } catch (err) {
      console.log(err.message);
      alert("Feedback failed ❌");
    }
  };

  // ================= OPEN CHAT =================
  const openChat = (booking) => {
    const providerId = booking?.providerId?._id || booking?.providerId;
    if (!providerId) { alert("Chat unavailable ❌"); return; }
    const roomId = `${String(userId)}_${String(providerId)}`;
    navigate(`/chat/${roomId}`);
  };

  // ================= DELETE PROFILE =================
  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/register");
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ================= GPS =================
  const useMyLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      },
      () => alert("Unable to fetch location ❌")
    );
  };

  // ================= FILTER PROVIDERS =================
  const filteredProviders = providers.filter(p => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.service?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      serviceFilter === "all" ? true : p.service === serviceFilter;
    return matchSearch && matchFilter;
  });

  // ================= STATUS COLOR =================
  const statusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    accepted: bookings.filter(b => b.status === "accepted").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-[#f0eafa] flex">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 min-h-screen bg-[#ede8f7] flex flex-col justify-between py-8 px-6 shadow-lg">
        <div>
          <h1 className="text-2xl font-black text-gray-800 mb-10">SkillLink</h1>

          {/* AVATAR */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow">
              {user?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <p className="mt-3 font-bold text-gray-800 text-lg text-center">
              {user?.name || "Customer"}
            </p>
            <p className="text-gray-500 text-sm capitalize">
              {user?.role || "Customer"}
            </p>
          </div>

          {/* NAV */}
          <nav className="flex flex-col gap-2">
            {[
              { key: "dashboard", label: "Dashboard", icon: "👤" },
              { key: "find", label: "Find Experts", icon: "🔍" },
              { key: "history", label: "My Requests", icon: "📋", badge: stats.pending },
              { key: "notifications", label: "Notifications", icon: "✉️", badge: notifications.length },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === item.key
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500 hover:bg-white/60"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
                {item.badge > 0 && (
                  <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/customer-profile")}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDeleteProfile}
            className="w-full bg-gray-800 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Delete Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-800 hover:bg-gray-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Log out
          </button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              Your Dashboard
            </h2>
            <p className="text-gray-500 mb-6">
              Welcome back 👋 Manage your requests & explore services
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* PERSONAL INFO */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-700 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Name</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1">
                      {user?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Role</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1 capitalize">
                      {user?.role || "Customer"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-400">Email</label>
                    <p className="text-gray-800 font-medium mt-1 border-b pb-1">
                      {user?.email || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-700 mb-4">Request Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-black text-gray-700">{stats.total}</p>
                    <p className="text-xs text-gray-400 mt-1">Total</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-black text-yellow-600">{stats.pending}</p>
                    <p className="text-xs text-yellow-400 mt-1">Pending</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-black text-green-600">{stats.accepted}</p>
                    <p className="text-xs text-green-400 mt-1">Accepted</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-black text-blue-600">{stats.completed}</p>
                    <p className="text-xs text-blue-400 mt-1">Completed</p>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-700 mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setActiveTab("find")}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    🔍 Find an Expert
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50"
                  >
                    📋 View My Requests
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50"
                  >
                    ✉️ View Notifications
                  </button>
                </div>
              </div>

              {/* RECENT BOOKINGS */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-700 mb-4">Recent Requests</h3>
                {bookings.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No requests yet. Find an expert to get started!
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b._id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800 capitalize">
                            {b.providerId?.name || "Provider"}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">{b.service}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ===== FIND EXPERTS TAB ===== */}
        {activeTab === "find" && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-6">
              Find Experts
            </h2>

            <div className="bg-white rounded-2xl shadow p-4 mb-6 flex gap-3">
              <input
                className="flex-1 p-3 border rounded-xl text-sm"
                placeholder="Search by name or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="p-3 border rounded-xl text-sm"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="all">All Services</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
              </select>
            </div>

            {/* ===== MAP ===== */}
            <div className="bg-white rounded-2xl shadow p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-700">📍 Your Location & Nearby Experts</h3>
                <button
                  onClick={useMyLocation}
                  className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Use My GPS
                </button>
              </div>

              {/* LEGEND */}
              <div className="flex gap-4 mb-3">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  🔵 You
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  🔴 Electrician
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  🔴 Plumber
                </span>
              </div>

              {coords && (
                <p className="text-xs text-green-600 mb-2">
                  ✅ Your location: {location}
                </p>
              )}

              <div className="rounded-xl overflow-hidden border h-[380px]">
                <MapContainer
                  center={coords ? [coords.lat, coords.lng] : [31.5204, 74.3587]}
                  zoom={coords ? 13 : 12}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker setLocation={setLocation} setCoords={setCoords} />

                  {/* CUSTOMER PIN - BLUE */}
                  {coords && (
                    <Marker position={[coords.lat, coords.lng]} icon={customerIcon}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold text-blue-600">📍 You are here</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* PROVIDER PINS - RED ✅ */}
                  {filteredProviders.map((p) => {
                    const pc = providerCoords[p._id];
                    if (!pc) return null;
                    return (
                      <Marker
                        key={p._id}
                        position={[pc.lat, pc.lng]}
                        icon={providerIcon}
                      >
                        <Popup>
                          <div className="text-center min-w-[140px]">
                            <p className="font-bold text-gray-800">{p.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{p.service}</p>
                            <p className="text-xs text-yellow-500 mt-1">⭐ {p.rating || "0"}</p>
                            <p className="text-xs text-gray-400">Rs. {p.price || "0"}</p>
                            <p className={`text-xs font-semibold mt-1 ${p.isAvailable ? "text-green-600" : "text-red-500"}`}>
                              {p.isAvailable ? "✅ Available" : "❌ Unavailable"}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>

            {/* PROVIDER CARDS */}
            {filteredProviders.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No experts found</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {filteredProviders.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-2xl shadow p-5 border hover:shadow-md transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-3">
                      {p.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
                    <p className="text-gray-500 text-sm capitalize">{p.service}</p>
                    {p.location && (
                      <p className="text-gray-400 text-xs mt-1">📍 {p.location}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500 text-sm">⭐</span>
                      <span className="text-gray-600 text-sm">{p.rating || "0"}</span>
                      <span className="text-gray-400 text-xs ml-auto">
                        Rs. {p.price || "0"}
                      </span>
                    </div>
                    <div className={`mt-2 text-xs font-medium ${p.isAvailable ? "text-green-600" : "text-red-500"}`}>
                      {p.isAvailable ? "✅ Available" : "❌ Unavailable"}
                    </div>
                    <button
                      onClick={() => handleRequest(p._id)}
                      disabled={loadingBooking === p._id || !p.isAvailable}
                      className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                    >
                      {loadingBooking === p._id ? "Sending..." : "Request Service"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MY REQUESTS TAB ===== */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-6">
              My Requests
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <p className="text-gray-400">No requests yet.</p>
                <button
                  onClick={() => setActiveTab("find")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm"
                >
                  Find an Expert
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white rounded-2xl shadow p-6 border hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800 capitalize text-lg">
                          {b.service}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Provider: {b.providerId?.name || "—"}
                        </p>
                        {b.location && (
                          <p className="text-gray-400 text-xs mt-1">📍 {b.location}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-1">
                          🕐 {new Date(b.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </div>

                    {/* LIVE PROGRESS */}
                    <div className="mt-3 mb-4">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Live Progress</p>
                      <div className="flex items-center gap-1">
                        {["pending", "accepted", "completed"].map((step, i) => {
                          const steps = ["pending", "accepted", "completed"];
                          const currentIndex = steps.indexOf(b.status);
                          const stepIndex = steps.indexOf(step);
                          const isActive = stepIndex <= currentIndex;
                          const isRejected = b.status === "rejected";
                          return (
                            <React.Fragment key={step}>
                              <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                  ${isRejected ? "bg-red-100 text-red-500" :
                                    isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                                  {i + 1}
                                </div>
                                <span className="text-xs text-gray-400 mt-1 capitalize">{step}</span>
                              </div>
                              {i < 2 && (
                                <div className={`flex-1 h-0.5 mb-4 ${
                                  isRejected ? "bg-red-200" :
                                  stepIndex < currentIndex ? "bg-blue-600" : "bg-gray-200"}`}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => openChat(b)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm transition"
                      >
                        💬 Message Provider
                      </button>
                    </div>

                    {b.status === "completed" && !b.feedback && (
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">⭐ Leave Feedback</p>
                        <div className="flex gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRatingMap(prev => ({ ...prev, [b._id]: star }))}
                              className={`text-xl ${ratingMap[b._id] >= star ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <textarea
                          rows="2"
                          className="w-full p-2 border rounded-xl text-sm mb-2"
                          placeholder="Share your experience..."
                          value={feedbackMap[b._id] || ""}
                          onChange={(e) =>
                            setFeedbackMap(prev => ({ ...prev, [b._id]: e.target.value }))
                          }
                        />
                        <button
                          onClick={() => submitFeedback(b._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm transition"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    )}

                    {b.feedback && (
                      <div className="mt-3 bg-green-50 p-3 rounded-xl">
                        <p className="text-xs text-green-600 font-medium">
                          ✅ Feedback submitted — Rating: {b.rating}/5
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{b.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== NOTIFICATIONS TAB ===== */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-6">Notifications</h2>
            <div className="bg-white rounded-2xl shadow p-6">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No notifications yet</p>
              ) : (
                <div className="flex flex-col divide-y">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-gray-700 text-sm">{n.message}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("history")}
                        className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-lg ml-4 whitespace-nowrap transition"
                      >
                        View Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;