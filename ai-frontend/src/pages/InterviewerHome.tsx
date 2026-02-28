import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Interview {
  interviewId: number;
  candidateName: string;
  jobTitle: string;
  status: string;
  matchScore: number; // NEW
}

export default function InterviewerHome() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
  axios.get("http://localhost:8081/api/interviews/assigned", 
 {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInterviews(res.data))
      .catch(() => alert("Failed to load interviews"));
  }, []);

  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 text-white px-8 py-10">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Interviewer Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage and evaluate assigned interviews
        </p>
      </div>

      <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10">
        Total Assigned:{" "}
        <span className="font-semibold text-indigo-400">
          {interviews.length}
        </span>
      </div>
    </div>

    {/* SUMMARY CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <p className="text-gray-400 text-sm">Pending</p>
        <p className="text-2xl font-bold text-yellow-400 mt-2">
          {interviews.filter(i => i.status === "PENDING").length}
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <p className="text-gray-400 text-sm">Completed</p>
        <p className="text-2xl font-bold text-green-400 mt-2">
          {interviews.filter(i => i.status === "COMPLETED").length}
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <p className="text-gray-400 text-sm">In Review</p>
        <p className="text-2xl font-bold text-indigo-400 mt-2">
          {interviews.filter(i => i.status === "IN_REVIEW").length}
        </p>
      </div>
    </div>

    {/* INTERVIEW TABLE */}
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">

      <div className="overflow-x-auto">
        <table className="w-full text-left">

          <thead className="bg-white/10 text-gray-300 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Candidate</th>
              <th className="px-6 py-4">Job Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Match Score</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {interviews.map((i) => (
              <tr
                key={i.interviewId}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-6 py-5 font-medium">
                  {i.candidateName}
                </td>

                <td className="px-6 py-5 text-gray-300">
                  {i.jobTitle}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        i.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : i.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-indigo-500/20 text-indigo-400"
                      }
                    `}
                  >
                    {i.status}
                  </span>
                </td>

                <td className="px-6 py-5 w-56">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${Math.round(i.matchScore ?? 0)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(i.matchScore ?? 0)}%
                  </p>
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => navigate(`/interview/${i.interviewId}`)}
                    className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg text-sm font-medium hover:scale-105 transition"
                  >
                    Evaluate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>

  </div>
);
}
