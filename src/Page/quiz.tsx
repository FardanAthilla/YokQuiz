import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchQuestions, type Question } from "../API/ApiQuiz";
import { db, auth } from "../API/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

function Quiz() {
  const { subject, topic } = useParams<{ subject: string; topic: string }>();
  const decodedTopic = topic ? decodeURIComponent(topic) : "";

  const [searchParams] = useSearchParams();
  const jumlah = Number(searchParams.get("jumlah")) || 5;
  const wallpaperId = searchParams.get("wallpaper");

  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);
  const [wallpaperRarity, setWallpaperRarity] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false); // ⬅️ modal keluar

  const hasFetched = useRef(false);
  const navigate = useNavigate();

  // 🔹 Fetch soal dari API sekali aja
  useEffect(() => {
    async function loadQuestions() {
      if (hasFetched.current) return;
      hasFetched.current = true;

      if (subject && decodedTopic) {
        const data = await fetchQuestions(subject, decodedTopic, jumlah);
        setQuestions(data);
      }
    }
    loadQuestions();
  }, [subject, decodedTopic, jumlah]);

  // 🔹 Ambil data wallpaper dari Firestore
  useEffect(() => {
    const fetchWallpaper = async () => {
      if (!wallpaperId) return;
      const snap = await getDoc(doc(db, "wallpapers", wallpaperId));
      if (snap.exists()) {
        const data = snap.data();
        setWallpaperUrl(data.imageUrl);
        setWallpaperRarity(data.rarity);
      }
    };
    fetchWallpaper();
  }, [wallpaperId]);

  const handleAnswer = () => {
    if (!selected) return;

    const updatedAnswers = [...answers];
    updatedAnswers[current] = selected;

    if (selected === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    setAnswers(updatedAnswers);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected("");
      setShowAnswer(false);
    } else {
      setShowResult(true);
      saveResult(answers);
    }
  };

  // 🔹 Simpan hasil + snapshot soal ke Firestore
  const saveResult = async (finalAnswers: string[]) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    const finalScore = questions.reduce((acc, q, idx) => {
      return acc + (q.answer === finalAnswers[idx] ? 1 : 0);
    }, 0);

    // ✅ Hitung total koin dari jawaban benar
    const coinsEarned = finalScore * 10;

    const attemptsRef = collection(db, "results", uid, "attempts");

    await addDoc(attemptsRef, {
      subject,
      topic,
      score: finalScore,
      total: questions.length,
      date: new Date().toISOString(),
      wallpaper: wallpaperId,
      coinsEarned, // simpan juga info coin yang didapat dari quiz
      questions: questions.map((q, idx) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        userAnswer: finalAnswers[idx] || null,
      })),
    });

    // ✅ Update koin user di Firestore
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentCoins = userData.coins || 0;

      await updateDoc(userRef, {
        coins: currentCoins + coinsEarned,
      });
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <img
          className="w-20 h-20 animate-spin"
          src="https://www.svgrepo.com/show/173880/loading-arrows.svg"
          alt="Loading icon"
        />
      </div>
    );
  }

  if (showResult) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden"
        style={{
          backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {(wallpaperRarity === "Exclusive" || wallpaperRarity === "Legend") && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-purple-600/50 via-transparent to-transparent blur-3xl" />
            <div className="absolute inset-0 animate-spin-slow bg-gradient-to-b from-pink-600/30 via-transparent to-transparent blur-3xl" />
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-cyan-500/30 via-transparent to-transparent blur-2xl" />
          </div>
        )}

        {/* ✅ Card hasil quiz */}
        <div className="bg-white/90 shadow-md rounded-xl p-6 w-full max-w-xl z-20 text-center">
          <h2 className="text-2xl font-bold">Hasil Quiz</h2>
          <p className="mt-4 text-lg">
            Skor kamu: {score} / {questions.length}
          </p>

          {/* kalau mau tampilkan juga koin */}
          <p className="mt-2 text-md font-semibold text-yellow-600">
            +{score * 10} Koin 🎉
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen p-6 relative"
      style={{
        backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {(wallpaperRarity === "Exclusive" || wallpaperRarity === "Legend") && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-purple-600/50 via-transparent to-transparent blur-3xl" />
          <div className="absolute inset-0 animate-spin-slow bg-gradient-to-b from-pink-600/30 via-transparent to-transparent blur-3xl" />
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-cyan-500/30 via-transparent to-transparent blur-2xl" />
        </div>
      )}

      <div className="bg-white/90 shadow-md rounded-xl p-6 w-full max-w-xl z-20">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Soal {current + 1} dari {questions.length}
          </p>
          <button
            onClick={() => setShowExitModal(true)} // ⬅️ pakai modal, bukan langsung keluar
            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Keluar
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {subject} - {decodedTopic}
        </h1>

        <h2 className="text-lg font-semibold mb-4">
          {questions[current].question}
        </h2>
        <div className="space-y-2">
          {questions[current].options.map((opt, idx) => {
            let optionClass = "block p-2 border rounded cursor-pointer";
            if (showAnswer) {
              if (opt === questions[current].answer) {
                optionClass += " bg-green-200 border-green-500";
              } else if (selected === opt) {
                optionClass += " bg-red-200 border-red-500";
              }
            } else if (selected === opt) {
              optionClass += " bg-blue-100 border-blue-500";
            }

            return (
              <label key={idx} className={optionClass}>
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                  className="mr-2"
                  disabled={showAnswer}
                />
                {opt}
              </label>
            );
          })}
        </div>

        {!showAnswer ? (
          <button
            onClick={handleAnswer}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Jawab
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {current + 1 < questions.length ? "Selanjutnya" : "Selesai"}
          </button>
        )}
      </div>

      {/* 🔹 Modal Konfirmasi Keluar */}
      {showExitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-80">
            <h2 className="text-lg font-bold mb-4">Konfirmasi</h2>
            <p className="mb-4">Apakah kamu yakin ingin keluar dari quiz?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
