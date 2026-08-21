import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  User,
  UserCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    console.log("FORM DATA:", form);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      setMessage(
        res.data.message || "Account created successfully"
      );

      // ✅ CHANGED: redirect to verify-otp page with email
      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email: form.email },
        });
      }, 1500);

    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);

      if (err.response) {
        setMessage(err.response.data.message || "Server Error ❌");
      } else if (err.request) {
        setMessage("Cannot connect to backend server ❌");
      } else {
        setMessage(err.message || "Something went wrong ❌");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden px-4">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

      {/* REGISTER CARD */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-white" size={30} />
            </div>
            <h1 className="text-4xl font-black text-white">Create Account</h1>
            <p className="text-gray-300 mt-2">Join SkillLink marketplace today</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Full Name</label>
              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl px-4">
                <User className="text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent px-3 py-4 text-white placeholder-gray-400 outline-none"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Email Address</label>
              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl px-4">
                <Mail className="text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-3 py-4 text-white placeholder-gray-400 outline-none"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Password</label>
              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl px-4">
                <Lock className="text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Enter your password"
                  className="w-full bg-transparent px-3 py-4 text-white placeholder-gray-400 outline-none"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Select Role</label>
              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl px-4">
                <UserCheck className="text-gray-400" size={20} />
                <select
                  name="role"
                  value={form.role}
                  className="w-full bg-transparent px-3 py-4 text-white outline-none"
                  onChange={handleChange}
                  required
                >
                  <option value="customer" className="text-black">Customer</option>
                  <option value="electrician" className="text-black">Electrician</option>
                  <option value="plumber" className="text-black">Plumber</option>
                </select>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Sign Up"}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          {/* MESSAGE */}
          {message && (
            <p className="mt-5 text-center text-sm font-medium text-yellow-300">
              {message}
            </p>
          )}

          {/* LOGIN */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">Already have an account?</p>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Login Here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;