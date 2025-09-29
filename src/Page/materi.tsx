import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../API/firebase"; // ✅ tambahkan auth
import Sidebar from "../Components/sidebar";
import Header from "../Components/header"; // ✅ import Header
import { onAuthStateChanged, type User } from "firebase/auth"; // ✅ import User

type Topic = {
  id: string;
  title: string;
  grade: number;
  image: string;
};

function Materi() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [user, setUser] = useState<User | null>(null); // ✅ simpan user

  // ✅ auth listener untuk header
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

useEffect(() => {
  const fetchTopics = async () => {
    if (!subject) return;
    const docRef = doc(db, "pelajaran", subject);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // ✅ ambil hanya field yang diawali "materi"
      const topicsArray: Topic[] = Object.entries(data)
        .filter(([id]) => id.startsWith("materi"))
        .map(([id, value]: [string, any]) => ({
          id,
          title: value.materi,
          grade: value.kelas,
          image: value.gambar || "",
        }));

      setTopics(topicsArray);
    }
  };
  fetchTopics();
}, [subject]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* ✅ pakai header yang sudah reusable */}
        <Header user={user} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() =>
                  navigate(
                    `/quiz/${subject}/${encodeURIComponent(topic.title)}`
                  )
                }
                className="cursor-pointer flex items-center justify-between bg-white p-4 rounded-lg border hover:shadow-md hover:scale-[1.02] transition"
              >
                <div className="text-left">
                  <h2 className="text-base font-semibold">{topic.title}</h2>
                  <p className="text-sm text-gray-500">Kelas {topic.grade}</p>
                </div>
                {topic.image && (
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Materi;
