type Language = "EN" | "HI" | "TE";

interface Props {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LanguageSelector({
  language,
  setLanguage,
}: Props) {
  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Interview Language
      </label>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="w-full border px-4 py-2.5 rounded-lg bg-white
                   focus:ring-2 focus:ring-blue-500 focus:outline-none
                   transition"
      >
        <option value="EN">English</option>
        <option value="HI">Hindi</option>
        <option value="TE">Telugu</option>
      </select>
    </div>
  );
}
