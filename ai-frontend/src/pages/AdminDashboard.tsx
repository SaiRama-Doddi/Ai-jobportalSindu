import { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User Filters
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Job Filters
  const [jobSearch, setJobSearch] = useState("");
  const [jobDateFilter, setJobDateFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const usersRes = await axios.get(
        "http://localhost:8081/api/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const jobsRes = await axios.get(
        "http://localhost:8081/api/admin/jobs",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(usersRes.data);
      setJobs(jobsRes.data);
    } catch {
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTERED USERS ================= */

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) =>
        roleFilter === "ALL" ? true : u.role === roleFilter
      )
      .filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
      .filter((u) =>
        dateFilter
          ? new Date(u.createdAt).toISOString().slice(0, 10) === dateFilter
          : true
      );
  }, [users, roleFilter, search, dateFilter]);

  /* ================= FILTERED JOBS ================= */

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) =>
        j.title.toLowerCase().includes(jobSearch.toLowerCase())
      )
      .filter((j) =>
        jobDateFilter
          ? new Date(j.createdAt).toISOString().slice(0, 10) === jobDateFilter
          : true
      );
  }, [jobs, jobSearch, jobDateFilter]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900">
        <div className="text-center">
          <div className="animate-spin h-14 w-14 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 text-white px-10 py-12">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Manage platform users and jobs
        </p>
      </div>

      {/* ================= USER FILTER BAR ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-10 flex flex-wrap gap-6 items-center">

        <input
          type="text"
          placeholder="Search by name or email..."
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="HR">HR</option>
          <option value="INTERVIEWER">Interviewer</option>
          <option value="CANDIDATE">Candidate</option>
        </select>

        <input
          type="date"
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl mb-14">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/10 text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Created</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4">{u.id}</td>
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= JOB SECTION ================= */}
      <div>
        <div className="flex justify-between items-center flex-wrap gap-6 mb-8">
          <h2 className="text-xl font-semibold">
            All Jobs
          </h2>

          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search jobs..."
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm w-56 focus:ring-2 focus:ring-indigo-500"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
            />

            <input
              type="date"
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              value={jobDateFilter}
              onChange={(e) => setJobDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <p className="text-gray-400">No jobs found.</p>
          ) : (
            filteredJobs.map((j) => (
              <div
                key={j.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition"
              >
                <h3 className="text-lg font-semibold text-indigo-400">
                  {j.title}
                </h3>

                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {j.description}
                </p>

                <p className="text-xs text-gray-500 mt-3">
                  Created: {new Date(j.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}