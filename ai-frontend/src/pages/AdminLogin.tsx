import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8081/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        alert("Not an admin");
      }
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  if (localStorage.getItem("role") === "ADMIN") {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Admin Login
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Secure access to admin dashboard
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block text-sm text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <label className="block text-sm text-gray-400 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition
            ${
              loading
                ? "bg-indigo-600 opacity-70 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-[1.02]"
            }
          `}
        >
          {loading && (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}