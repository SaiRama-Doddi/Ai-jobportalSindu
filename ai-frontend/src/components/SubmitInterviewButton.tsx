interface Props {
  answersSubmitted: boolean;
  interviewSubmitted: boolean;
  answersLoading: boolean;
  interviewLoading: boolean;
  onSubmitAnswers: () => void;
  onSubmitInterview: () => void;
}

export default function SubmitInterviewButton({
  answersSubmitted,
  interviewSubmitted,
  answersLoading,
  interviewLoading,
  onSubmitAnswers,
  onSubmitInterview,
}: Props) {
  if (interviewSubmitted) {
    return (
      <p className="text-green-700 font-bold mt-4">
Assessment Submitted Successfully ✅
      </p>
    );
  }

  return (
    <div className="mt-4 space-x-3">
      {!answersSubmitted && (
        <button
          onClick={onSubmitAnswers}
          disabled={answersLoading}
          className={`px-4 py-2 rounded text-white ${
            answersLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {answersLoading ? "Submitting Answers..." : "Submit Answers"}
        </button>
      )}

      {answersSubmitted && (
        <button
          onClick={onSubmitInterview}
          disabled={interviewLoading}
          className={`px-4 py-2 rounded text-white ${
            interviewLoading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {interviewLoading ? "Submitting Assessment..." : "Submit Assessment"}
        </button>
      )}
    </div>
  );
}
