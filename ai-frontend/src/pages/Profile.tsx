import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ===================== TYPES ===================== */

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ResumeResponse {
  exists: boolean;
  resumeId?: number;
  fileName?: string;
  uploadedAt?: string;
}

interface InterviewResult {
  averageRating: number;
  verdict: string;
  message: string;
}

/* ===================== COMPONENT ===================== */

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [interviewResult, setInterviewResult] =
    useState<InterviewResult | null>(null);

  const token = localStorage.getItem("token");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  /* ===================== LOAD PROFILE ===================== */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        setPageLoading(true);

        const res = await axios.get<UserProfile>(
          "http://localhost:8081/api/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile(res.data);

        if (res.data.role === "HR") {
          navigate("/hr");
        }
      } catch {
        navigate("/login");
      } finally {
        setPageLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate]);

  /* ===================== LOAD RESUME ===================== */

  useEffect(() => {
    if (!profile || profile.role !== "CANDIDATE") return;

    axios
      .get<ResumeResponse>("http://localhost:8081/api/resumes/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.exists && res.data.resumeId) {
          setResumeId(res.data.resumeId);
          localStorage.setItem("resumeId", String(res.data.resumeId));
        } else {
          setResumeId(null);
        }
      })
      .catch(() => setResumeId(null));
  }, [profile, token]);

  /* ===================== LOAD INTERVIEW RESULT ===================== */

  useEffect(() => {
    if (!profile || profile.role !== "CANDIDATE") return;

    const interviewId = localStorage.getItem("interviewId");
    if (!interviewId) return;

    axios
      .get<InterviewResult>(
        `http://localhost:8081/api/interviews/${interviewId}/result`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setInterviewResult(res.data);
      })
      .catch(() => {
        setInterviewResult(null);
      });
  }, [profile, token]);

  /* ===================== UPLOAD ===================== */

  const uploadResume = async (selectedFile: File) => {
    if (!token) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(
        "http://localhost:8081/api/resumes/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Resume uploaded successfully");

      const res = await axios.get<ResumeResponse>(
        "http://localhost:8081/api/resumes/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.exists && res.data.resumeId) {
        setResumeId(res.data.resumeId);
        localStorage.setItem("resumeId", String(res.data.resumeId));
      }
    } catch {
      alert("Resume upload failed");
    }
  };

  const downloadResume = async () => {
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
    link.download = "resume.pdf";
    link.click();
  };

  /* ===================== UI ===================== */

 /* ===================== UI ===================== */

if (pageLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="flex flex-col items-center gap-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
        <p className="text-gray-400 text-sm">Loading your AI dashboard...</p>
      </div>
    </div>
  );
}

if (!profile) return null;

return (
  <div className="min-h-screen bg-[#0f172a] relative overflow-hidden px-6 py-16 text-white">

    {/* Background Glow */}
    <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"></div>

    <div className="max-w-5xl mx-auto relative z-10 space-y-10">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold mb-3">
          Candidate Dashboard
        </h2>
        <p className="text-gray-400">
          Manage your AI-powered profile and hiring progress
        </p>
      </div>

      {/* Profile Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="grid md:grid-cols-3 gap-6 text-sm">

          <div>
            <p className="text-gray-400">Full Name</p>
            <p className="text-lg font-semibold">{profile.name}</p>
          </div>

          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-lg font-semibold">{profile.email}</p>
          </div>

          <div>
            <p className="text-gray-400">Role</p>
            <p className="text-lg font-semibold text-indigo-400">
              {profile.role}
            </p>
          </div>

        </div>
      </div>

      {/* Resume Section */}
      {profile.role === "CANDIDATE" && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-6">

          <h3 className="text-xl font-semibold">
            Resume Management
          </h3>

          {resumeId ? (
            <div className="flex flex-wrap gap-6 items-center">

              <button
                onClick={downloadResume}
                className="px-6 py-3 rounded-xl text-sm font-semibold
                           bg-gradient-to-r from-indigo-500 to-cyan-500
                           hover:scale-[1.05] transform transition duration-300"
              >
                Download Resume
              </button>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadResume(f);
                }}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-xl text-sm font-semibold
                           border border-white/20 bg-white/5
                           hover:bg-white/10 transition"
              >
                Replace Resume
              </button>

            </div>
          ) : (
            <div className="space-y-4">

              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-400"
              />

              <button
                onClick={() => file && uploadResume(file)}
                className="px-6 py-3 rounded-xl text-sm font-semibold
                           bg-gradient-to-r from-indigo-500 to-cyan-500
                           hover:scale-[1.05] transform transition duration-300"
              >
                Upload Resume
              </button>

            </div>
          )}

        </div>
      )}

      {/* Interview Result */}
      {interviewResult && (
        <div
          className={`backdrop-blur-xl rounded-3xl p-8 text-center border
          ${
            interviewResult.verdict === "PASS"
              ? "bg-green-500/10 border-green-400/30"
              : interviewResult.verdict === "HOLD"
              ? "bg-yellow-500/10 border-yellow-400/30"
              : "bg-red-500/10 border-red-400/30"
          }`}
        >
          <h3 className="text-2xl font-bold mb-3">
            {interviewResult.message}
          </h3>

          <p className="text-gray-300">
            Average Rating:{" "}
            <span className="text-indigo-400 font-semibold">
              {interviewResult.averageRating}
            </span>
          </p>
        </div>
      )}

      {/* Recommended Jobs */}
      <div className="text-center pt-6">
        <button
          onClick={() => navigate("/jobs")}
          className="px-10 py-4 rounded-xl text-sm font-semibold
                     bg-gradient-to-r from-indigo-500 to-cyan-500
                     hover:scale-[1.05] transform transition duration-300
                     shadow-[0_10px_30px_rgba(99,102,241,0.5)]"
        >
          View Recommended Jobs
        </button>
      </div>

    </div>
  </div>
);
}