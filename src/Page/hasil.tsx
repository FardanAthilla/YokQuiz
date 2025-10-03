import { useEffect, useState } from "react";
import { db, auth } from "../API/firebase";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../Components/sidebar";
import Header from "../Components/header";
import { onAuthStateChanged, type User } from "firebase/auth";

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
  const [openAttempt, setOpenAttempt] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const attemptsPerPage = 5;

  const totalPages = Math.ceil(attempts.length / attemptsPerPage);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

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

      const sortedData = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setAttempts(sortedData);
    };
    fetchResults();
  }, []);

  // slice data untuk page sekarang
  const startIndex = (currentPage - 1) * attemptsPerPage;
  const currentAttempts = attempts.slice(
    startIndex,
    startIndex + attemptsPerPage
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="mb-5">
            <h1 className="text-3xl font-bold text-gray-900">Riwayat Quiz</h1>
            <p className="text-gray-600 mt-2">
              Lihat hasil percobaan quiz kamu sebelumnya
            </p>
          </div>

          <div className="space-y-6">
            {currentAttempts.length > 0 ? (
              currentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  {/* Ringkasan Attempt */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() =>
                      setOpenAttempt(
                        openAttempt === attempt.id ? null : attempt.id
                      )
                    }
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      {/* Kiri: subject & tanggal */}
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {attempt.subject} - {attempt.topic}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Tanggal: {new Date(attempt.date).toLocaleString()}
                        </p>
                      </div>

                      {/* Kanan: skor */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium mt-4 md:mt-0 ${
                          attempt.score / attempt.total >= 0.7
                            ? "bg-green-100 text-green-800"
                            : attempt.score / attempt.total >= 0.4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        Skor {attempt.score}/{attempt.total}
                      </span>
                    </div>
                  </div>
                  {/* Detail Attempt */}
                  <div
                    className={`px-6 transition-all duration-300 overflow-hidden ${
                      openAttempt === attempt.id
                        ? "max-h-[9999px] pb-6"
                        : "max-h-0"
                    }`}
                  >
                    {attempt.questions.map((q, idx) => (
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
                  </div>{" "}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">
                Belum ada hasil quiz yang anda selesaikan
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="inline-flex items-center p-1 rounded bg-white space-x-2">
                <button
                  className="p-1 rounded border text-black bg-white hover:text-white hover:bg-blue-500 hover:border-blue-500 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                    />
                  </svg>
                </button>
                <p className="text-gray-500">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <button
                  className="p-1 rounded border text-black bg-white hover:text-white hover:bg-blue-500 hover:border-blue-500 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Hasil;
