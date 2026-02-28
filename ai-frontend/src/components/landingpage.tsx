import {
  Brain,
  FileText,
  BarChart3,
  UserCheck,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingSections() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-[#0f172a] text-white overflow-hidden mt-7">

      {/* Background Glow */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"></div>

      {/* ================= PLATFORM OVERVIEW ================= */}
      <section className="relative py-28 px-6 max-w-7xl mx-auto text-center z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          AI-Powered Recruitment Ecosystem
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
          Automate resume generation, intelligent screening, AI-based interviews,
          adaptive assessments, and predictive hiring analytics —
          all powered by next-generation artificial intelligence.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {[
            {
              icon: <Brain size={28} />,
              title: "AI Resume Generator",
              desc: "Automatically create optimized, ATS-ready resumes tailored to job roles.",
            },
            {
              icon: <FileText size={28} />,
              title: "Smart Resume Filtering",
              desc: "AI ranks candidates instantly using skill and experience scoring.",
            },
            {
              icon: <BarChart3 size={28} />,
              title: "Live Job Tracking",
              desc: "Monitor job pipelines and candidate stages in real time.",
            },
            {
              icon: <UserCheck size={28} />,
              title: "Auto Interview Scheduling",
              desc: "Schedule interviews based on availability and AI ranking.",
            },
            {
              icon: <ClipboardCheck size={28} />,
              title: "AI Exam & Evaluation",
              desc: "Conduct secure online exams with instant AI grading.",
            },
            {
              icon: <Sparkles size={28} />,
              title: "Predictive Hiring Insights",
              desc: "Use data intelligence to improve hiring accuracy and outcomes.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/5 border border-white/10
                         rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                         hover:scale-[1.03] hover:border-indigo-500/40
                         transition duration-300"
            >
              <div className="mb-5 text-indigo-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative py-28 px-6 z-10">
        <h2 className="text-4xl font-bold text-center mb-20">
          How Our AI Recruitment Works
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-center">

          {[
            "Upload Resume",
            "AI Profile Analysis",
            "Automated Exam & Screening",
            "Smart Interview & Hiring",
          ].map((step, i) => (
            <div
              key={i}
              className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center 
                              rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 
                              text-white font-bold text-lg shadow-lg">
                {i + 1}
              </div>
              <p className="text-gray-300 font-medium">
                {step}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">

          {[
            { number: "95%", label: "AI Accuracy" },
            { number: "70%", label: "Faster Hiring" },
            { number: "50K+", label: "Candidates Processed" },
            { number: "500+", label: "Trusted Companies" },
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                {stat.number}
              </h3>
              <p className="text-gray-400 text-sm">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-28 px-6 text-center z-10">
        <h2 className="text-4xl font-bold mb-6">
          Transform Your Hiring With AI
        </h2>

        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Join a next-generation recruitment ecosystem built for
          speed, intelligence, and automation.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-500 to-cyan-500
                       hover:scale-[1.05] transform transition duration-300
                       shadow-[0_10px_30px_rgba(99,102,241,0.5)]"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/jobs")}
            className="px-10 py-4 rounded-xl text-sm font-semibold text-white
                       border border-white/20 bg-white/5 backdrop-blur-md
                       hover:bg-white/10 transition duration-300"
          >
            Browse Jobs
          </button>
        </div>
      </section>

    </div>
  );
}