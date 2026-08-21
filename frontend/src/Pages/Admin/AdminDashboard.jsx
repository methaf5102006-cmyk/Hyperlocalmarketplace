import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/providers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProviders(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProviders();
    fetchBookings();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const deleteProvider = async (id) => {
    if (!window.confirm("Delete this provider?")) return;
    await axios.delete(`http://localhost:5000/api/providers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProviders();
  };

  // STATUS BADGE
  const getStatusBadge = (status) => {
    const base =
      "px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide";

    if (status === "pending")
      return `${base} bg-yellow-100 text-yellow-700`;
    if (status === "accepted")
      return `${base} bg-green-100 text-green-700`;
    if (status === "rejected")
      return `${base} bg-red-100 text-red-700`;

    return `${base} bg-gray-100 text-gray-700`;
  };

  // FILTER
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBookings = bookings.filter((b) =>
    b.service?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* SIDEBAR */}
      <div className="w-72 bg-slate-900 text-white p-6 fixed h-full shadow-2xl">
        <Link to="/">
          <h1 className="text-2xl font-bold mb-10 tracking-wide">
            SkillLink Admin
          </h1>
        </Link>

        <div className="space-y-3">
          {["dashboard", "users", "providers", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full p-3 rounded-lg text-left capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "bg-blue-600 shadow-md"
                  : "hover:bg-slate-800"
              }`}
            >
              {tab === "dashboard" && "📊"}
              {tab === "users" && "👥"}
              {tab === "providers" && "🔧"}
              {tab === "bookings" && "📅"}{" "}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 ml-72 p-8">

        {/* SEARCH */}
        {activeTab !== "dashboard" && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search..."
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Dashboard Overview
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {/* CARD */}
              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <p className="text-gray-500">Total Users</p>
                <h3 className="text-4xl font-bold mt-2 text-blue-600">
                  {users.length}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <p className="text-gray-500">Providers</p>
                <h3 className="text-4xl font-bold mt-2 text-green-600">
                  {providers.length}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <p className="text-gray-500">Bookings</p>
                <h3 className="text-4xl font-bold mt-2 text-purple-600">
                  {bookings.length}
                </h3>
              </div>

            </div>
          </div>
        )}

        {/* USERS TABLE */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Users</h2>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4">Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROVIDERS TABLE */}
        {activeTab === "providers" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Providers</h2>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4">Name</th>
                    <th>Service</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProviders.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{p.name}</td>
                      <td>{p.service}</td>
                      <td>
                        <button
                          onClick={() => deleteProvider(p._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TABLE */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Bookings</h2>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th>Service</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">
                        {b.userId?.name || "Customer"}
                      </td>
                      <td>{b.service}</td>
                      <td>
                        <span className={getStatusBadge(b.status)}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;