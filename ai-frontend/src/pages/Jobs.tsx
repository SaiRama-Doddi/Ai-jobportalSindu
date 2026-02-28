import { useEffect, useState } from "react";
import axios from "axios";
import InterviewPage from "./InterviewPage";
import { useNavigate } from "react-router-dom";

type Job = {
  id: number;
  title: string;
  description: string;
};

type Question = {
  id: number;
  difficulty: string;
  questionTextEn: string;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobId, setAppliedJobId] = useState<number | null>(null);
  const [loadingJobId, setLoadingJobId] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
const navigate = useNavigate();
/* localStorage.setItem("interviewId", String(iRes.data.id)); */
  const [interviewData, setInterviewData] = useState<{
    jobTitle: string;
    interviewId: number;
    questions: Question[];
  } | null>(null);

  const token = localStorage.getItem("token");
  const resumeId = Number(localStorage.getItem("resumeId"));

useEffect(() => {
  const fetchJobs = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get("http://localhost:8081/api/jobs/recommended", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  fetchJobs();
}, [token]);


if (pageLoading) {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600"></div>
      <p className="text-gray-500 text-sm">Finding best jobs for you...</p>
    </div>
  );
}

const applyJob = async (job: Job) => {
  if (!resumeId) {
    alert("Upload resume first");
    return;
  }

  try {
    setAppliedJobId(job.id);
    setLoadingJobId(job.id);

   const appRes = await axios.post(
  "http://localhost:8081/api/applications",
  { jobId: job.id, resumeId },
  { headers: { Authorization: `Bearer ${token}` } }
);

console.log("Application API Response:", appRes.data);

const applicationId = appRes.data?.id;

if (!applicationId) {
  throw new Error("Application ID missing from backend response");
}

    await axios.post(
  `http://localhost:8081/api/skills/analyze/${applicationId}`,
  {},
  { headers: { Authorization: `Bearer ${token}` } }
);

if (!appRes.data || !appRes.data.id) {
  alert("Application creation failed");
  return;
}

    // 🔥 START INTERVIEW FIRST
    const iRes = await axios.post(
      `http://localhost:8081/api/interviews/start/${applicationId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔥 THEN GENERATE QUESTIONS
    const qRes = await axios.post(
      `http://localhost:8081/api/questions/generate/${applicationId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setInterviewData({
      jobTitle: job.title,
      interviewId: iRes.data.id,
      questions: qRes.data,
    });

  } catch (err) {
    console.error(err);
    alert("Failed to start interview");
    setAppliedJobId(null);
  } finally {
    setLoadingJobId(null);
  }
};


  // 🚀 Interview page (UNCHANGED)
  if (interviewData) {
    return (
      <InterviewPage
        jobTitle={interviewData.jobTitle}
        interviewId={interviewData.interviewId}
        questions={interviewData.questions}
      />
    );
  }

 return (
  <div className="min-h-screen bg-[#0f172a] relative overflow-hidden px-6 py-16 text-white">

    {/* Background Glow */}
    <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"></div>

    <div className="max-w-7xl mx-auto relative z-10 space-y-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

        <div>
          <h2 className="text-4xl font-extrabold">
            Recommended Jobs
          </h2>
          <p className="text-gray-400 mt-2">
            Apply and start your AI-powered assessment instantly
          </p>
        </div>

        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl text-sm font-semibold
                     border border-white/20 bg-white/5
                     hover:bg-white/10 transition"
        >
          ← Go Back
        </button>

      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {jobs.map((job) => {
          const isApplied = appliedJobId === job.id;
          const isLoading = loadingJobId === job.id;

          return (
            <div
              key={job.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10
                         rounded-3xl p-8 flex flex-col justify-between
                         shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                         hover:scale-[1.03] hover:border-indigo-500/40
                         transition duration-300"
            >
              {/* Job Info */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-indigo-400">
                  {job.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">
                  {job.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => applyJob(job)}
                disabled={isLoading}
                className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold
                           transition duration-300
                  ${
                    isApplied
                      ? "bg-green-500/80 text-white"
                      : "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:scale-[1.05]"
                  }
                  ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {isLoading
                  ? "Preparing AI Assessment..."
                  : isApplied
                  ? "Applied Successfully"
                  : "Apply & Start Assessment"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!pageLoading && jobs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            No jobs available at the moment.
          </p>
        </div>
      )}

    </div>
  </div>
);
}
