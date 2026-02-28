import { useState } from "react";
import { login } from "../api/authApi";
import type { LoginRequest } from "../types/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await login(form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("name", res.data.name);
    localStorage.setItem("email", form.email);

    const role = res.data.role;

    if (role === "HR") navigate("/hr");
    else if (role === "CANDIDATE") navigate("/profile");
    else if(role==="INTERVIEWER") navigate("/interviewer");
    else navigate("/jobs");

  } catch {
    alert("Invalid credentials");
  }
};

const [showPassword, setShowPassword] = useState(false);
  return (
  <div className="min-h-screen flex relative overflow-hidden bg-[#0f172a]">

    {/* Gradient Mesh Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-900 opacity-95"></div>

    {/* Glow Effects */}
    <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-3xl"></div>

    {/* ================= LEFT SIDE (DESKTOP ONLY) ================= */}
    <div className="hidden lg:flex w-1/2 items-center justify-center px-20 text-white relative z-10">

      <div className="max-w-lg">
        <h1 className="text-5xl font-extrabold leading-tight mb-8">
          Welcome Back <br />
          to Intelligent <br />
          Hiring
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          Log in to access your AI-powered dashboard —
          resume analytics, automated interviews,
          candidate scoring, and real-time hiring insights.
        </p>

        <div className="mt-10 space-y-4 text-gray-400 text-sm">
          <p>✔ AI-Based Resume Filtering</p>
          <p>✔ Automated Interview Scheduling</p>
          <p>✔ Smart Hiring Insights</p>
        </div>
      </div>
    </div>

    {/* ================= RIGHT SIDE LOGIN CARD ================= */}
    <div className="flex flex-1 items-center justify-center px-6 py-16 relative z-20">

      <div className="w-full max-w-md">

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-2xl bg-white/10 border border-white/20
                     shadow-[0_20px_80px_rgba(0,0,0,0.6)]
                     rounded-3xl p-10 space-y-8 text-white"
        >

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              Sign In
            </h2>
            <p className="text-gray-400 text-sm">
              Access your AI Recruitment Dashboard
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         placeholder-gray-400 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
            <label className="text-sm text-gray-300">
              Password
            </label>

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         placeholder-gray-400 pr-12 transition"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] text-gray-300 hover:text-white transition"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-500 to-cyan-500
                       hover:scale-[1.03] transform transition duration-300
                       shadow-[0_10px_30px_rgba(99,102,241,0.6)]"
          >
            Login
          </button>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-400 hover:text-cyan-400 cursor-pointer font-medium transition"
            >
              Register
            </span>
          </p>

        </form>
      </div>
    </div>
  </div>
);
}
