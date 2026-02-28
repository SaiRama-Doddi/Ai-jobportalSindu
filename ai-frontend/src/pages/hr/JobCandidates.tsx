import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Candidate {
  applicationId: number;
  candidateName: string;
  candidateEmail: string;
  matchScore: number;
  missingSkills: string[] | string;
  matchingSkills: string[] | string;
  resumeId: number;
  assignedInterviewer?: string;

  averageRating?: number;   // NEW
  verdict?: string;         // NEW
  finalComment?: string;    // NEW
  interviewStatus?: string;

}


interface Interviewer {
  id: number;
  name: string;
}

export default function JobCandidates() {
  const { jobId } = useParams();
  const token = localStorage.getItem("token");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [schedule, setSchedule] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
const [assigning, setAssigning] = useState<number | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const candRes = await axios.get(
           `http://localhost:8081/api/applications/jobs/${jobId}/candidates`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

      const intRes = await axios.get(
  "http://localhost:8081/api/auth/hr/interviewers",
  { headers: { Authorization: `Bearer ${token}` } }
);

        setCandidates(candRes.data);
        setInterviewers(intRes.data);
      } catch (err) {
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, token]);


  const downloadResume = async (resumeId: number) => {
  try {
    const res = await axios.get(
      `http://localhost:8081/api/resumes/download/${resumeId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.pdf"; // or dynamic filename
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch {
    alert("Resume download failed");
  }
};

  /* ================= PARSE SKILLS ================= */
  const parseSkills = (skills: any) => {
    if (!skills) return "—";
    if (Array.isArray(skills)) return skills.join(", ");
    if (typeof skills === "string") {
      try {
        return JSON.parse(skills).join(", ");
      } catch {
        return skills;
      }
    }
    return "—";
  };

  /* ================= MATCH SCORE COLOR ================= */
  const scoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  /* ================= SCHEDULE ================= */
  const scheduleInterview = async (applicationId: number) => {
    const data = schedule[applicationId];
    if (!data?.interviewerId || !data?.dateTime) {
      return alert("Select interviewer & date");
    }

    try {
      await axios.post(
        "http://localhost:8081/api/interviews/schedule",
        {
          applicationId,
          interviewerId: data.interviewerId,
          dateTime: data.dateTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Interview Scheduled");
    } catch {
      alert("Scheduling failed");
    }
  };


  const assignInterviewer = async (applicationId: number) => {
    setAssigning(applicationId);
  const data = schedule[applicationId];

  if (!data?.interviewerId) {
    return alert("Select interviewer first");
  }

  try {
    await axios.post(
      "http://localhost:8081/api/interviews/schedule",
      {
        applicationId,
        interviewerId: data.interviewerId,
        dateTime: new Date().toISOString(),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ find interviewer name
    const interviewer = interviewers.find(
      (i) => i.id === Number(data.interviewerId)
    );

    // ✅ update UI
    setCandidates((prev) =>
      prev.map((c) =>
        c.applicationId === applicationId
          ? { ...c, assignedInterviewer: interviewer?.name }
          : c
      )
    );

    alert("Interviewer Assigned Successfully");

  } catch {
    alert("Assignment failed");

  }
};


if (loading)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white/70 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl px-10 py-12 flex flex-col items-center gap-6">

        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>

        <p className="text-slate-600 font-semibold text-lg tracking-wide">
          Loading Candidates...
        </p>
      </div>
    </div>
  );

  if (candidates.length === 0)
    return <p className="text-center mt-10 text-gray-500">No candidates applied yet</p>;

return (
  <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 text-white px-10 py-12">

    {/* HEADER */}
    <div className="flex justify-between items-center flex-wrap gap-6 mb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Job Candidates
        </h1>
        <p className="text-gray-400 mt-2">
          Review and manage applicants
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 backdrop-blur-xl">
        <span className="text-sm text-gray-400">Applicants</span>
        <p className="text-xl font-semibold text-indigo-400">
          {candidates.length}
        </p>
      </div>
    </div>

    {/* CANDIDATE LIST */}
    <div className="space-y-8">
      {candidates.map((c) => (
        <div
          key={c.applicationId}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition duration-300"
        >

          {/* TOP ROW */}
          <div className="flex justify-between items-start flex-wrap gap-8">

            {/* Candidate Info */}
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xl">
                {c.candidateName.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-semibold text-lg">
                  {c.candidateName}
                </p>
                <p className="text-sm text-gray-400">
                  {c.candidateEmail}
                </p>
              </div>
            </div>

            {/* Match Score */}
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Match Score</p>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${scoreColor(c.matchScore || 0)}`}>
                {Math.round(c.matchScore ?? 0)}%
              </div>
            </div>

          </div>

          {/* SKILLS SECTION */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">

            {/* Missing Skills */}
            <div>
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {parseSkills(c.missingSkills).split(",").map((s: string, i: number) => (
                  <span
                    key={i}
                    className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Matching Skills */}
            <div>
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
                Matching Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {parseSkills(c.matchingSkills).split(",").map((s: string, i: number) => (
                  <span
                    key={i}
                    className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* ACTION SECTION */}
          <div className="mt-8 flex flex-wrap items-center gap-6 justify-between">

            {/* Resume */}
            <button
              onClick={() => downloadResume(c.resumeId)}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg text-sm font-semibold hover:scale-105 transition"
            >
              Download Resume
            </button>

            {/* Interviewer Assignment */}
            {c.assignedInterviewer ? (
              <span className="text-green-400 text-sm bg-green-500/20 px-4 py-2 rounded-full">
                Assigned: {c.assignedInterviewer}
              </span>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">

                <select
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) =>
                    setSchedule((prev) => ({
                      ...prev,
                      [c.applicationId]: {
                        ...prev[c.applicationId],
                        interviewerId: e.target.value,
                      },
                    }))
                  }
                >
                  <option>Select Interviewer</option>
                  {interviewers.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => assignInterviewer(c.applicationId)}
                  className="px-5 py-2 bg-green-600 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  {assigning === c.applicationId ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Assign"
                  )}
                </button>
              </div>
            )}

            {/* Evaluation Summary */}
            <div className="flex items-center gap-10 text-sm">

              <div className="text-center">
                <p className="text-xs text-gray-400">Rating</p>
                <p className="font-bold text-indigo-400">
                  {c.averageRating ? c.averageRating.toFixed(1) : "—"}
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-400">Verdict</p>
                <p
                  className={`font-bold ${
                    c.verdict === "PASS"
                      ? "text-green-400"
                      : c.verdict === "HOLD"
                      ? "text-yellow-400"
                      : c.verdict === "FAIL"
                      ? "text-red-400"
                      : c.interviewStatus === "IN_PROGRESS"
                      ? "text-blue-400"
                      : c.interviewStatus === "SCHEDULED"
                      ? "text-purple-400"
                      : "text-gray-400"
                  }`}
                >
                  {c.verdict || c.interviewStatus || "APPLIED"}
                </p>
              </div>

              <div className="max-w-xs text-xs text-gray-400 truncate">
                {c.finalComment || "No comment yet"}
              </div>

            </div>

          </div>

        </div>
      ))}
    </div>

  </div>
);


}
