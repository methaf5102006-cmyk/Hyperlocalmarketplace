import React from "react";
import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-10">

      <div className="max-w-7xl mx-auto px-6">

        {/* ================= TOP SECTION ================= */}
        <div className="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-14">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-3">

              <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                S
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Skill<span className="text-blue-500">Link</span>
                </h2>

                <p className="text-gray-400 text-sm">
                  Hyper Local Marketplace
                </p>
              </div>

            </div>

            <p className="text-gray-400 mt-6 leading-relaxed">
              Find trusted electricians and plumbers near you with
              secure booking, verified professionals, and affordable pricing.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-6">

              <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-blue-600 transition flex items-center justify-center cursor-pointer">
                <FaFacebookF />
              </div>

              <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-pink-500 transition flex items-center justify-center cursor-pointer">
                <FaInstagram />
              </div>

              <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-sky-500 transition flex items-center justify-center cursor-pointer">
                <FaTwitter />
              </div>

              <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-blue-700 transition flex items-center justify-center cursor-pointer">
                <FaLinkedinIn />
              </div>

            </div>

          </div>

          {/* QUICK LINKS */}
          <div>

            <h3 className="text-xl font-bold mb-6">
              Quick Links
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">

              <Link
                to="/"
                className="hover:text-blue-400 transition"
              >
                Home
              </Link>

              <Link
                to="/services"
                className="hover:text-blue-400 transition"
              >
                Services
              </Link>

              <Link
                to="/about"
                className="hover:text-blue-400 transition"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="hover:text-blue-400 transition"
              >
                Contact
              </Link>

            </div>

          </div>

          {/* SERVICES */}
          <div>

            <h3 className="text-xl font-bold mb-6">
              Services
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">

              <p className="hover:text-blue-400 transition cursor-pointer">
                Electrician Services
              </p>

              <p className="hover:text-blue-400 transition cursor-pointer">
                Plumbing Services
              </p>

              <p className="hover:text-blue-400 transition cursor-pointer">
                Emergency Repairs
              </p>

              <p className="hover:text-blue-400 transition cursor-pointer">
                Home Maintenance
              </p>

            </div>

          </div>

          {/* SUPPORT */}
          <div>

            <h3 className="text-xl font-bold mb-6">
              Support
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">

              <p className="hover:text-blue-400 transition cursor-pointer">
                Help Center
              </p>

              <p className="hover:text-blue-400 transition cursor-pointer">
                Terms & Conditions
              </p>

              <p className="hover:text-blue-400 transition cursor-pointer">
                Privacy Policy
              </p>

              <p className="hover:text-blue-400 transition cursor-pointer">
                Customer Support
              </p>

            </div>

          </div>

        </div>

        {/* ================= BOTTOM ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 SkillLink. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">
            Designed with ❤️ for modern local services
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;