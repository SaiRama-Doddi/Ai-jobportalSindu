import { useEffect, useState } from "react";
import axios from "axios";
import InterviewPage from "./InterviewPage";
import { useNavigate } from "react-router-dom";

type Job = {
  id: number;
  title: string;
  description: string;
};

type MyApplication = {
  id: number;
  jobId: number;
  status: string;
};

type Question = {
  id: number;
  difficulty: string;
  questionTextEn: string;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [loadingJobId, setLoadingJobId] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [interviewData, setInterviewData] = useState<{
    jobTitle: string;
    interviewId: number;
    questions: Question[];
  } | null>(null);

  const token = localStorage.getItem("token");
  const resumeId = Number(localStorage.getItem("resumeId"));
  const navigate = useNavigate();

  /* ================= LOAD JOBS ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);

        const jobsRes = await axios.get(
          "http://localhost:8081/api/jobs/recommended",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setJobs(jobsRes.data);

        // 🔥 LOAD MY APPLICATIONS
        const appRes = await axios.get<MyApplication[]>(
          "http://localhost:8081/api/applications/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const appliedIds = appRes.data.map((a) => a.jobId);
        setAppliedJobIds(appliedIds);

      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (pageLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 text-sm">Finding best jobs for you...</p>
      </div>
    );
  }

  /* ================= APPLY ================= */

  const applyJob = async (job: Job) => {
    if (!resumeId) {
      alert("Upload resume first");
      return;
    }

    try {
      setLoadingJobId(job.id);

      const appRes = await axios.post(
        "http://localhost:8081/api/applications",
        { jobId: job.id, resumeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const applicationId = appRes.data?.id;

      if (!applicationId) {
        throw new Error("Application ID missing");
      }

      await axios.post(
        `http://localhost:8081/api/skills/analyze/${applicationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const iRes = await axios.post(
        `http://localhost:8081/api/interviews/start/${applicationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const qRes = await axios.post(
        `http://localhost:8081/api/questions/generate/${applicationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Mark job as applied permanently
      setAppliedJobIds((prev) => [...prev, job.id]);

      setInterviewData({
        jobTitle: job.title,
        interviewId: iRes.data.id,
        questions: qRes.data,
      });

    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    } finally {
      setLoadingJobId(null);
    }
  };

  /* ================= INTERVIEW PAGE ================= */

  if (interviewData) {
    return (
      <InterviewPage
        jobTitle={interviewData.jobTitle}
        interviewId={interviewData.interviewId}
        questions={interviewData.questions}
      />
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-16 text-white">
      <div className="max-w-7xl mx-auto space-y-12">

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-extrabold">
              Recommended Jobs
            </h2>
            <p className="text-gray-400 mt-2">
              Apply and start your AI-powered assessment instantly
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl text-sm font-semibold
                       border border-white/20 bg-white/5
                       hover:bg-white/10 transition"
          >
            ← Go Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const isLoading = loadingJobId === job.id;

            return (
              <div
                key={job.id}
                className="bg-white/5 border border-white/10
                           rounded-3xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-indigo-400">
                  {job.title}
                </h3>

                <p className="text-gray-400 text-sm mb-6">
                  {job.description}
                </p>

                <button
                  onClick={() => applyJob(job)}
                  disabled={isApplied || isLoading}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition
                    ${
                      isApplied
                        ? "bg-green-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-[1.05]"
                    }
                    ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {isLoading
                    ? "Preparing AI Assessment..."
                    : isApplied
                    ? "Already Applied"
                    : "Apply & Start Assessment"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}