import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchQuestions, type Question } from "../API/ApiQuiz";
import { db, auth } from "../API/firebase";
import { collection, addDoc } from "firebase/firestore";

function Quiz() {
  const { subject, topic } = useParams<{ subject: string; topic: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<string[]>([]); 
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      if (subject && topic) {
        const data = await fetchQuestions(subject, topic);
        setQuestions(data);
      }
    }
    loadQuestions();
  }, [subject, topic]);

  const handleAnswer = () => {
    if (!selected) return;

    if (selected === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [...prev, selected]);

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected("");
    } else {
      setShowResult(true);
      saveResult();
    }
  };

  // Simpan hasil + snapshot soal ke Firestore
  const saveResult = async () => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    const attemptsRef = collection(db, "results", uid, "attempts");

    await addDoc(attemptsRef, {
      subject,
      topic,
      score,
      total: questions.length,
      date: new Date().toISOString(),
      questions: questions.map((q, idx) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        userAnswer: answers[idx] || null, // simpan jawaban user juga
      })),
    });
  };

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading soal...</div>;
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Hasil Quiz</h2>
        <p className="mt-4 text-lg">Skor kamu: {score} / {questions.length}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">
        Quiz {subject} - {topic}
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4">
          {questions[current].question}
        </h2>
        <div className="space-y-2">
          {questions[current].options.map((opt, idx) => (
            <label
              key={idx}
              className={`block p-2 border rounded cursor-pointer ${
                selected === opt ? "bg-blue-100 border-blue-500" : ""
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={selected === opt}
                onChange={() => setSelected(opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
        <button
          onClick={handleAnswer}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {current + 1 < questions.length ? "Next" : "Selesai"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
