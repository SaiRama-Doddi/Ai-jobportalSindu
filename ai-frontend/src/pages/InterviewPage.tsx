import { useState } from "react";
import axios from "axios";
import InterviewQuestions from "../components/InterviewQuestions";
import SubmitInterviewButton from "../components/SubmitInterviewButton";
import { useNavigate } from "react-router-dom";

type Question = {
  id: number;
  difficulty: string;
  questionTextEn: string;
};

interface Props {
  jobTitle: string;
  interviewId: number;
  questions: Question[];
}

export default function InterviewPage({
  jobTitle,
  interviewId,
  questions,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answersSubmitted, setAnswersSubmitted] = useState(false);
  const [interviewSubmitted, setInterviewSubmitted] = useState(false);

  // ✅ NEW LOADING STATES
  const [answersLoading, setAnswersLoading] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (qid: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  // 🟢 SUBMIT ANSWERS
  const submitAnswers = async () => {
    try {
      setAnswersLoading(true);

      const payloadAnswers = questions
        .filter((q) => answers[q.id]?.trim())
        .map((q) => ({
          questionId: q.id,
          answerText: answers[q.id].trim(),
        }));

      await axios.post(
        "http://localhost:8081/api/answers/submit",
        { interviewId, answers: payloadAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswersSubmitted(true);
      alert("Answers submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to submit answers");
    } finally {
      setAnswersLoading(false);
    }
  };

  // 🟣 SUBMIT INTERVIEW
  const submitInterview = async () => {
    try {
      setInterviewLoading(true);

      await axios.post(
        `http://localhost:8081/api/interviews/${interviewId}/submit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterviewSubmitted(true);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to submit interview");
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Interview – {jobTitle}</h2>

      <InterviewQuestions
        questions={questions}
        answers={answers}
        disabled={answersSubmitted}
        onChange={handleChange}
      />

      <SubmitInterviewButton
        answersSubmitted={answersSubmitted}
        interviewSubmitted={interviewSubmitted}
        answersLoading={answersLoading}          // ✅ PASS LOADING
        interviewLoading={interviewLoading}      // ✅ PASS LOADING
        onSubmitAnswers={submitAnswers}
        onSubmitInterview={submitInterview}
      />
    </div>
  );
}
