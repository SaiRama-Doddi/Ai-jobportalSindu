import { useEffect, useState } from "react";
import axios from "axios";

interface Interviewer {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function HrInterviewers() {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:8081/api/auth/hr/interviewers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInterviewers(res.data);
      } catch (err) {
        console.error("Error fetching interviewers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewers();
  }, [token]);

  /* 🔥 LOADING UI */
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900">
      <div className="text-center">
        <div className="animate-spin h-14 w-14 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
        <p className="text-gray-400 text-sm">
          Loading interviewers...
        </p>
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
          My Interviewers
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your assigned interview panel members
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 backdrop-blur-xl">
        <span className="text-sm text-gray-400">
          Total Interviewers
        </span>
        <p className="text-xl font-semibold text-indigo-400">
          {interviewers.length}
        </p>
      </div>
    </div>

    {/* EMPTY STATE */}
    {interviewers.length === 0 ? (
      <div className="text-center mt-32 text-gray-400">
        <h2 className="text-2xl font-semibold">
          No Interviewers Created Yet
        </h2>
        <p className="mt-2">
          Create interviewers from the registration page.
        </p>
      </div>
    ) : (

      /* INTERVIEWERS GRID */
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interviewers.map((user) => (
          <div
            key={user.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition duration-300"
          >
            <h2 className="text-xl font-semibold text-indigo-400">
              {user.name}
            </h2>

            <p className="text-gray-300 mt-3 break-all">
              {user.email}
            </p>

            <span className="inline-block mt-6 px-4 py-1 text-sm bg-indigo-500/20 text-indigo-300 rounded-full">
              {user.role}
            </span>
          </div>
        ))}
      </div>
    )}

  </div>
);
}
