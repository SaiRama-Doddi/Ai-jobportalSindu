import axios from "axios";

type Language = "EN" | "HI" | "TE";

export const translateText = async (
  text: string,
  from: Language,
  to: Language
): Promise<string> => {
  if (!text || from === to) return text;

  const token = localStorage.getItem("token");

  const res = await axios.post(
    "http://localhost:8081/api/translate",
    { text, from, to },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
