import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate , useLocation} from "react-router-dom";

type Job = {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  minExperience: number;
  createdAt: string;
};

export default function HrDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
   const [loading, setLoading] = useState(true);
     const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8081/api/jobs/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch {
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Reload when page opens OR when returning from other pages
useEffect(() => {
  fetchJobs();
}, [location.key]); // ⭐ better than pathname


const deleteJob = async (id: number) => {
  if (!window.confirm("Delete this job?")) return;

  await axios.delete(`http://localhost:8081/api/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  fetchJobs();   // ⭐ ALWAYS REFRESH FROM SERVER
};


if (loading) {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600"></div>
    </div>
  );
}

if (!loading && jobs.length === 0) {
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">HR Dashboard</h2>

        <button
          onClick={() => navigate("/hr/create")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
        >
          + Create Job
        </button>
      </div>

      <div className="text-center mt-24 text-gray-500">
        <h2 className="text-2xl font-semibold">No Jobs Created Yet</h2>
        <p className="mt-2">Click "Create Job" to get started.</p>
      </div>
    </div>
  );
}



  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 text-white px-10 py-12">

    {/* HEADER */}
    <div className="flex justify-between items-center flex-wrap gap-6 mb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          HR Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your job postings and candidates
        </p>
      </div>

      <button
        onClick={() => navigate("/hr/create")}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl font-semibold hover:scale-105 transition"
      >
        + Create Job
      </button>
    </div>

    {/* STATS SECTION */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <p className="text-gray-400 text-sm">Total Jobs</p>
        <p className="text-2xl font-bold text-indigo-400 mt-2">
          {jobs.length}
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <p className="text-gray-400 text-sm">Active Listings</p>
        <p className="text-2xl font-bold text-green-400 mt-2">
          {jobs.length}
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <p className="text-gray-400 text-sm">Created This Session</p>
        <p className="text-2xl font-bold text-cyan-400 mt-2">
          {jobs.length}
        </p>
      </div>
    </div>

    {/* EMPTY STATE */}
    {jobs.length === 0 ? (
      <div className="text-center mt-32 text-gray-400">
        <h2 className="text-2xl font-semibold">
          No Jobs Created Yet
        </h2>
        <p className="mt-2">
          Click "Create Job" to start hiring.
        </p>
      </div>
    ) : (

      /* JOB GRID */
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-indigo-400">
                {job.title}
              </h3>

              <p className="text-gray-300 mt-3 line-clamp-3">
                {job.description}
              </p>

              <div className="mt-4 text-sm text-gray-400">
                Experience Required: {job.minExperience}+ years
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.requiredSkills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex gap-3 flex-wrap">

              <button
                onClick={() => navigate(`/hr/edit/${job.id}`)}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm hover:bg-yellow-500/30 transition"
              >
                Edit
              </button>

              <button
                onClick={() => deleteJob(job.id)}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition"
              >
                Delete
              </button>

              <button
                onClick={() => navigate(`/hr/job/${job.id}`)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg text-sm font-medium hover:scale-105 transition"
              >
                View Candidates
              </button>

            </div>

          </div>
        ))}
      </div>
    )}

  </div>
);
}
