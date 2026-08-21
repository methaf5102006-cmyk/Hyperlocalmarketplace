import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ DEBUG (IMPORTANT)
      console.log("LOGIN PAYLOAD:", {
        email,
        password,
      });

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim(),
          password: password.trim(),
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

      const user = res.data.user;

      if (!user || !user.role) {
        alert("Invalid response from server ❌");
        return;
      }

      const role = (user.role || "")
        .toLowerCase()
        .trim();

      const cleanUser = {
        ...user,
        role,
      };

      // clear old data
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      localStorage.setItem(
        "token",
        res.data.token
      );
      localStorage.setItem(
        "user",
        JSON.stringify(cleanUser)
      );

      console.log(
        "LOGGED IN USER:",
        cleanUser
      );

      // redirect based on role
      if (role === "customer") {
        navigate("/dashboard");
      } else if (
        role === "electrician" ||
        role === "plumber"
      ) {
        navigate("/provider-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(
        "LOGIN ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Login failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] flex items-center justify-center">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl w-full max-w-md shadow-2xl">

        <div className="text-center mb-6">
          <ShieldCheck
            className="text-blue-400 mx-auto mb-2"
            size={40}
          />
          <h1 className="text-white text-3xl font-bold">
            Login
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3 rounded-xl transition font-semibold shadow-lg"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}

            {!loading && (
              <ArrowRight
                className="inline ml-2"
                size={18}
              />
            )}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4">
          Don’t have account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;