import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    experience: 0,
  });

  /* ================= LOAD JOB DATA ================= */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/jobs/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const job = res.data.find((j: any) => j.id === Number(jobId));
        if (!job) return alert("Job not found");

        setForm({
          title: job.title,
          description: job.description,
          skills: job.requiredSkills.join(", "),
          experience: job.minExperience || 0,
        });
      } catch {
        alert("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, token]);

  /* ================= UPDATE JOB ================= */
  const updateJob = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/jobs/${jobId}`,
        {
          title: form.title,
          description: form.description,
          requiredSkills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          minExperience: form.experience,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Job updated successfully");
      navigate("/hr");
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 text-white px-10 py-14">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-12 flex-wrap gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Job
        </h1>
        <p className="text-gray-400 mt-2">
          Update job details and requirements
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

      <div className="space-y-6">

        {/* Job Title */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Job Title
          </label>
          <input
            type="text"
            placeholder="Job Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Job Description
          </label>
          <textarea
            placeholder="Job Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 h-40 text-gray-200 focus:ring-2 focus:ring-indigo-500 resize-none"
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
            value={form.skills}
            onChange={(e) =>
              setForm({ ...form, skills: e.target.value })
            }
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Minimum Experience (Years)
          </label>
          <input
            type="number"
            placeholder="Minimum Experience"
            value={form.experience}
            onChange={(e) =>
              setForm({
                ...form,
                experience: Number(e.target.value),
              })
            }
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-6 pt-6 flex-wrap">

          <button
            onClick={updateJob}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold hover:scale-105 transition"
          >
            Update Job
          </button>

          <button
            onClick={() => navigate("/hr")}
            className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  </div>
);
}
