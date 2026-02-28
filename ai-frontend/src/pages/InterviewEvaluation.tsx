import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface QA {
  answerId: number;
  question: string;
  answer: string;
}

export default function InterviewEvaluation() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [details, setDetails] = useState<any>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/interviews/${interviewId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDetails(res.data))
      .catch(() => alert("Failed to load interview details"));
  }, [interviewId, token]);

  const submitEvaluation = async () => {
    try {
      setSubmitting(true);

      await axios.post(
        `http://localhost:8081/api/interviews/${interviewId}/evaluate`,
        { ratings, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect back to interviewer dashboard
      navigate("/interviewer");

    } catch {
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!details)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 text-white px-10 py-12 relative">

      {/* HEADER */}
      {/* HEADER */}
<div className="mb-10 flex items-center justify-between">

  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      {details.candidate}
    </h1>
    <p className="text-gray-400 mt-2">{details.job}</p>
  </div>

  <button
    onClick={() => navigate("/interviewer")}
    disabled={submitting}
    className="px-6 py-2 rounded-xl bg-white/10 border border-white/20 text-sm font-medium hover:bg-white/20 transition"
  >
    ← Back to Dashboard
  </button>

</div>

      {/* QUESTIONS */}
      <div className="space-y-8">
        {details.questionsAnswers.map((qa: QA, index: number) => (
          <div
            key={qa.answerId}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold text-indigo-400 mb-4">
              Question {index + 1}
            </h2>

            <p className="text-gray-200 font-medium mb-4">
              {qa.question}
            </p>

            <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-gray-300 leading-relaxed">
              {qa.answer}
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Rate Answer</p>

              <div className="flex gap-3 flex-wrap">
                {[5,4,3,2,1].map((value) => (
                  <button
                    key={value}
                    disabled={submitting}
                    onClick={() =>
                      setRatings({ ...ratings, [qa.answerId]: value })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition
                      ${
                        ratings[qa.answerId] === value
                          ? "bg-indigo-600"
                          : "bg-white/10 hover:bg-white/20"
                      }
                      ${submitting ? "opacity-60 cursor-not-allowed" : ""}
                    `}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COMMENT SECTION */}
      <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">
          Final Evaluation Comment
        </h3>

        <textarea
          placeholder="Write your overall evaluation..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-gray-200 focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitting}
        />
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="mt-10 flex justify-between items-center">

        <div className="text-gray-400 text-sm">
          Average Score:{" "}
          <span className="text-indigo-400 font-semibold">
            {Object.values(ratings).length > 0
              ? (
                  Object.values(ratings).reduce((a, b) => a + b, 0) /
                  Object.values(ratings).length
                ).toFixed(1)
              : "0.0"}
          </span>
        </div>

        <button
          onClick={submitEvaluation}
          disabled={submitting}
          className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-3 transition
            ${
              submitting
                ? "bg-green-600 opacity-70 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105"
            }
          `}
        >
          {submitting && (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          )}
          {submitting ? "Submitting..." : "Submit Evaluation"}
        </button>

      </div>

      {/* FULL SCREEN LOADING OVERLAY */}
      {submitting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-lg font-semibold">
              Submitting Evaluation...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}