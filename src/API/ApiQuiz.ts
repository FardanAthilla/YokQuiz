const API_KEY = "AIzaSyDgKAIQqFOkAYpjz-l-PtuQ9GrO8EkIOoc";

export type Question = {
  question: string;
  options: string[];
  answer: string;
};

export async function fetchQuestions(
  subject: string,
  topic: string
): Promise<Question[]> {
  try {
    console.log("=== INPUT fetchQuestions ===", subject, topic);

    const prompt = `Buatkan 5 soal kuiz ${subject} dengan materi ${topic}.
Balas hanya dalam format JSON array tanpa penjelasan apapun.
Contoh format:
[
  {
    "question": "Pertanyaan?",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }
]`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    let match = text.match(/\[[\s\S]*\]/);
    let parsed: Question[] = [];
    if (match) {
      parsed = JSON.parse(match[0]);
    }

    return parsed;
  } catch (err) {
    console.error("Error fetch soal:", err);
    return [];
  }
}
