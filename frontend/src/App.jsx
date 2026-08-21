import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Profile from "./Pages/Profile.jsx";

import Dashboard from "./Pages/Dashboard.jsx";
import ProviderDashboard from "./Pages/ProviderDashboard.jsx";

import SearchPage from "./Pages/SearchPage.jsx";
import VerifyOTP from "./Pages/VerifyOTP.jsx";

import ServicesPage from "./Pages/ServicesPage.jsx";
import ServiceDetails from "./Pages/ServiceDetails.jsx";
import ProviderDetails from "./Pages/ProviderDetails.jsx";

import ChatRoom from "./Pages/ChatRoom.jsx";

import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import AdminLogin from "./Pages/Admin/AdminLogin.jsx";

import Notifications from "./Pages/Notifications.jsx";

import CustomerProfile from "./Pages/CustomerProfile.jsx";

import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/verify-otp",
    "/admin-login",
    "/admin-dashboard",
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* SERVICES */}
        <Route path="/services/:type?" element={<ServicesPage />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/search" element={<SearchPage />} />

        {/* ✅ PROVIDER DETAIL ROUTE ADDED */}
        <Route path="/providers/:id" element={<ProviderDetails />} />

        {/* CUSTOMER */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer-profile"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* PROVIDER DASHBOARD */}
        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute allowedRoles={["electrician", "plumber"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat/:roomId"
          element={
            <ProtectedRoute allowedRoles={["customer", "electrician", "plumber"]}>
              <ChatRoom />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route path="/profile/:id" element={<Profile />} />

      </Routes>

      {!hideNavbar && <Footer />}
    </>
  );
};

export default App;