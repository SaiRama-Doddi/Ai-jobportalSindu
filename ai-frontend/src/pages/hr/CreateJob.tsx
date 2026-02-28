import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateJob() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    experience: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await axios.post(
        "http://localhost:8081/api/jobs",
        {
          title: form.title,
          description: form.description,
          requiredSkills: form.skills.split(",").map((s) => s.trim()),
          minExperience: form.experience,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/hr");

    } catch {
      alert("Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 text-white px-8 py-14">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Job
          </h1>
          <p className="text-gray-400 mt-2">
            Post a new job opportunity
          </p>
        </div>

        <button
          onClick={() => navigate("/hr")}
          className="px-5 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/20 transition"
        >
          ← Back
        </button>
      </div>

      {/* FORM CONTAINER */}
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-xl">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Job Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Senior React Developer"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Job Description
            </label>
            <textarea
              placeholder="Describe responsibilities and requirements..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 h-40 text-gray-200 focus:ring-2 focus:ring-indigo-500 resize-none"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="React, Spring Boot, MySQL"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setForm({ ...form, skills: e.target.value })
              }
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Minimum Experience (Years)
            </label>
            <input
              type="number"
              min={0}
              placeholder="2"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setForm({
                  ...form,
                  experience: Number(e.target.value),
                })
              }
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition
                ${
                  submitting
                    ? "bg-indigo-600 opacity-70 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-[1.02]"
                }
              `}
            >
              {submitting && (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              {submitting ? "Creating Job..." : "Create Job"}
            </button>
          </div>

        </form>
      </div>

      {/* FULL SCREEN OVERLAY */}
      {submitting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-lg font-semibold">
              Creating Job...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}