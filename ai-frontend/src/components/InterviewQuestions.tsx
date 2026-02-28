import { useEffect, useState } from "react";

type Question = {
  id: number;
  difficulty: string;
  questionTextEn: string;
};

interface Props {
  questions: Question[];
  answers: Record<number, string>;
  disabled: boolean;
  onChange: (questionId: number, value: string) => void;
  onSubmit?: () => void; // optional submit handler
}

export default function InterviewQuestions({
  questions,
  answers,
  disabled,
  onChange,
  onSubmit,
}: Props) {

  /* ================= STATE ================= */

  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [listening, setListening] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* ================= VOICE INPUT ================= */

  const startListening = (questionId: number) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onChange(questionId, transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.start();
  };

  /* ================= CURRENT QUESTION ================= */

  const currentQuestion = questions[activeIndex];

  /* ================= UI ================= */

return (
<div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 text-white flex flex-col">

    {/* TOP BAR */}
    <div className="w-full bg-indigo-600 px-10 py-4 flex justify-between items-center">
      <h1 className="font-semibold text-lg">AI Interview Assessment</h1>
      <div className="text-sm">
        ⏱ Time Left: {formatTime(timeLeft)}
      </div>
    </div>

    {/* MAIN FULL SCREEN */}
    <div className="flex flex-1">

      {/* QUESTION SIDE */}
      <div className="flex-1 p-12">

        <h2 className="text-2xl font-semibold text-indigo-400 mb-6">
          Question No: {activeIndex + 1}
        </h2>

        <p className="text-lg mb-8">
          {currentQuestion.questionTextEn}
        </p>

        <textarea
          rows={8}
          disabled={disabled}
          value={answers[currentQuestion.id] || ""}
          onChange={(e) =>
            onChange(currentQuestion.id, e.target.value)
          }
          placeholder="Write your answer here..."
          className="w-full bg-black/40 border border-white/20 rounded-xl p-6 focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        <p className="text-right text-sm text-gray-400 mt-2">
          {answers[currentQuestion.id]
            ?.split(" ")
            .filter(Boolean).length || 0} words
        </p>

        <button
          onClick={() => startListening(currentQuestion.id)}
          disabled={disabled}
          className="mt-6 px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
        >
          {listening ? "Listening..." : "🎤 Voice Answer"}
        </button>

        <div className="flex justify-between mt-12">
          <button
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((prev) => prev - 1)}
            className="px-6 py-2 bg-gray-500 rounded-lg"
          >
            Previous
          </button>

          <button
            disabled={activeIndex === questions.length - 1}
            onClick={() => setActiveIndex((prev) => prev + 1)}
            className="px-6 py-2 bg-indigo-600 rounded-lg"
          >
            Save & Next
          </button>
        </div>

      </div>

      {/* PALETTE SIDE */}
      <div className="w-80 bg-black/40 border-l border-white/10 p-10">

        <h3 className="text-lg font-semibold text-indigo-400 mb-6">
          Question Palette
        </h3>

        <div className="grid grid-cols-5 gap-4">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-10 h-10 rounded-lg font-medium
                ${
                  activeIndex === index
                    ? "bg-red-500"
                    : "bg-white/10"
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

      </div>

    </div>
  </div>
);
}