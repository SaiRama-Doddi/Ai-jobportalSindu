import { useState, useEffect } from "react";
import { register } from "../api/authApi";
import type { RegisterRequest, UserRole } from "../types/auth";

export default function Register() {
  const loggedRole = localStorage.getItem("role") as UserRole | null;

  const isAdmin = loggedRole === "ADMIN";
  const isHR = loggedRole === "HR";
  const isLoggedIn = !!loggedRole;

  const [activeTab, setActiveTab] = useState<"CANDIDATE" | "STAFF">("CANDIDATE");

  /* ================= INITIAL FORM ================= */
  const initialForm: RegisterRequest = {
    name: "",
    email: "",
    password: "",
    role: "CANDIDATE",
  };

  const [form, setForm] = useState<RegisterRequest>(initialForm);

  /* ================= ROLE LOGIC ================= */
  const getRoleOptions = (): UserRole[] => {
    // Public users
    if (!isLoggedIn) return ["CANDIDATE", "HR"];

    // HR logged in
    if (isHR) {
      return activeTab === "STAFF" ? ["INTERVIEWER"] : ["CANDIDATE"];
    }

    // Admin logged in
    if (isAdmin) {
      return activeTab === "STAFF" ? ["HR", "INTERVIEWER"] : ["CANDIDATE"];
    }

    return ["CANDIDATE"];
  };

  const roleOptions = getRoleOptions();

  /* ===== Auto set role when tab/login changes ===== */
  useEffect(() => {
    setForm(prev => ({ ...prev, role: roleOptions[0] }));
  }, [activeTab, loggedRole]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(form);
      alert("User registered successfully");

      // 🔥 CLEAR FORM
      setForm({
        ...initialForm,
        role: roleOptions[0],
      });

      setActiveTab("CANDIDATE");

    } catch (err: any) {
      alert(err.response?.data || "Registration failed");
    }
  };
const [showPassword, setShowPassword] = useState(false);
return (
  <div className="min-h-screen flex relative overflow-hidden bg-[#0f172a]">

    {/* Background Gradient Mesh */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-900 opacity-90"></div>

    {/* Animated Glow */}
    <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-3xl"></div>

    {/* ================= LEFT SIDE ================= */}
    <div className="hidden lg:flex w-1/2 relative items-center justify-center px-20 text-white z-10">

      <div className="max-w-lg">
        <h1 className="text-5xl font-extrabold leading-tight mb-8">
          Intelligent <br />
          Hiring Powered <br />
          by AI
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          Resume generation, automated filtering, AI-based interviews,
          smart exams, predictive hiring analytics — all in one
          intelligent recruitment ecosystem.
        </p>

        <div className="mt-10 space-y-4 text-gray-400 text-sm">
          <p>✔ 95% AI Accuracy</p>
          <p>✔ 70% Faster Hiring</p>
          <p>✔ Fully Automated Workflow</p>
        </div>
      </div>
    </div>

    {/* ================= RIGHT SIDE FORM ================= */}
    <div className="flex flex-1 items-center justify-center relative z-20 px-6 py-16">

      <div className="w-full max-w-md">

        {/* Glass Card */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 
                        shadow-[0_20px_80px_rgba(0,0,0,0.6)] 
                        rounded-3xl p-10 space-y-8 text-white">

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm">
              Join the AI Recruitment Platform
            </p>
          </div>

          {/* Tabs */}
          <div className="relative flex bg-white/10 rounded-xl p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("CANDIDATE")}
              className={`w-1/2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "CANDIDATE"
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg"
                  : "text-gray-300"
              }`}
            >
              Candidate
            </button>

            {(isHR || isAdmin) && (
              <button
                type="button"
                onClick={() => setActiveTab("STAFF")}
                className={`w-1/2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === "STAFF"
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg"
                    : "text-gray-300"
                }`}
              >
                Staff
              </button>
            )}
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         placeholder-gray-400 transition"
              required
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         placeholder-gray-400 transition"
              required
            />

            {/* Password with Icon Toggle */}
            <div className="relative">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none
                           placeholder-gray-400 pr-12 transition"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         text-white transition"
            >
              {roleOptions.map(role => (
                <option key={role} value={role} className="text-black">
                  {role}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-indigo-500 to-cyan-500
                         hover:scale-[1.03] transform transition duration-300
                         shadow-[0_10px_30px_rgba(99,102,241,0.6)]"
            >
              Register Now
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
);
}
