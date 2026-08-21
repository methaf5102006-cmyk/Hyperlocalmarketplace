import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowRight, KeyRound } from "lucide-react";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      setMessage(res.data.message || "Email verified ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log("OTP ERROR:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "OTP verification failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden px-4">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[140px] rounded-full"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md">

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="text-center mb-8">

            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheck className="text-white" size={30} />
            </div>

            <h1 className="text-4xl font-black text-white tracking-wide">
              Verify OTP
            </h1>

            <p className="text-gray-300 mt-2 text-sm">
              Enter the 6-digit code sent to
            </p>

            <p className="text-blue-400 font-semibold text-sm break-all">
              {email}
            </p>

          </div>

          {/* FORM */}
          <form onSubmit={handleVerify} className="space-y-6">

            {/* OTP INPUT */}
            <div className="relative">

              <label className="text-sm text-gray-300 block mb-2">
                OTP Code
              </label>

              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-blue-500 transition">

                <KeyRound className="text-gray-400" size={20} />

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full bg-transparent px-3 py-4 text-white placeholder-gray-400 outline-none text-center text-2xl tracking-widest"
                  required
                />

              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          {/* MESSAGE */}
          {message && (
            <p className="mt-6 text-center text-sm font-medium text-yellow-300 bg-white/5 p-2 rounded-xl">
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;