import React from "react";
import { Link } from "react-router-dom";

import {
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  // ================= GET USER (ONLY FOR AVATAR) =================
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const getDashboardRoute = () => {
    if (!user) return "/login";
    if (user.role === "customer") return "/dashboard";
    if (user.role === "admin") return "/admin-dashboard";
    return "/provider-dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-2">

          <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
            S
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-800">
              Skill<span className="text-blue-600">Link</span>
            </h1>

            <p className="text-xs text-gray-500 -mt-1">
              Hyper Local Marketplace
            </p>
          </div>

        </Link>

        {/* ================= NAV LINKS ================= */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

          <Link
            to="/"
            className="hover:text-blue-600 transition duration-200"
          >
            Home
          </Link>

          <Link
            to="/services"
            className="hover:text-blue-600 transition duration-200"
          >
            Services
          </Link>

          <Link
            to="/about"
            className="hover:text-blue-600 transition duration-200"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="hover:text-blue-600 transition duration-200"
          >
            Contact
          </Link>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">

          {/* LOGIN, REGISTER, ADMIN — only show when NOT logged in */}
          {!user && (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className="flex items-center gap-2 border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-4 py-2 rounded-xl font-medium transition"
              >
                <FaSignInAlt />

                <span className="hidden sm:block">
                  Login
                </span>
              </Link>

              {/* REGISTER */}
              <Link
                to="/register"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition"
              >
                <FaUserPlus />

                <span className="hidden sm:block">
                  Sign Up
                </span>
              </Link>

              {/* ADMIN */}
              <Link
                to="/admin-login"
                className="hidden lg:block bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-medium transition"
              >
                Admin
              </Link>
            </>
          )}

          {/* ================= USER AVATAR — ONLY NEW ADDITION ================= */}
          {user && (
            <Link
              to={getDashboardRoute()}
              title="Go to Dashboard"
              className="flex items-center gap-2 border border-blue-200 hover:border-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition"
            >
              {user.name ? (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <FaUserCircle className="text-blue-600 text-2xl" />
              )}
              <span className="hidden sm:block text-blue-700 font-medium text-sm">
                {user.name?.split(" ")[0] || "My Account"}
              </span>
            </Link>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;