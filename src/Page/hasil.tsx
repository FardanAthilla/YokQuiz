import { useEffect, useState } from "react";
import { db, auth } from "../API/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Attempt {
  id: string;
  subject: string;
  topic: string;
  score: number;
  total: number;
  date: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
    userAnswer: string | null;
  }[];
}

function Hasil() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      const attemptsRef = collection(db, "results", uid, "attempts");
      const snapshot = await getDocs(attemptsRef);

      const data: Attempt[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Attempt[];

      setAttempts(data);
    };
    fetchResults();
  }, []);

  if (selectedAttempt) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedAttempt(null)}
          className="mb-4 text-blue-600 underline"
        >
          ← Kembali
        </button>
        <h2 className="text-xl font-bold mb-2">
          {selectedAttempt.subject} - {selectedAttempt.topic}
        </h2>
        <p className="mb-4">
          Skor: {selectedAttempt.score} / {selectedAttempt.total}
        </p>

        {selectedAttempt.questions.map((q, idx) => (
          <div key={idx} className="p-3 border rounded mb-3">
            <p className="font-semibold">{q.question}</p>
            <ul className="list-disc list-inside ml-4">
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className={
                    opt === q.answer
                      ? "text-green-600 font-bold"
                      : opt === q.userAnswer
                      ? "text-red-500"
                      : ""
                  }
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Riwayat Quiz</h1>
      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          onClick={() => setSelectedAttempt(attempt)}
          className="p-4 bg-white rounded shadow cursor-pointer hover:shadow-lg"
        >
          <h2 className="text-lg font-semibold">
            {attempt.subject} - {attempt.topic}
          </h2>
          <p>Skor: {attempt.score} / {attempt.total}</p>
          <p className="text-sm text-gray-500">
            Tanggal: {new Date(attempt.date).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Hasil;
