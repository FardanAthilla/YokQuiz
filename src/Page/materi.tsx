import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../API/firebase";
import Sidebar from "../Components/sidebar";

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

  useEffect(() => {
    const fetchTopics = async () => {
      if (!subject) return;
      const docRef = doc(db, "pelajaran", subject);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const topicsArray: Topic[] = Object.entries(data).map(
          ([id, value]: [string, any]) => ({
            id,
            title: value.materi,
            grade: value.kelas,
            image: value.gambar || "",
          })
        );
        setTopics(topicsArray);
      }
    };
    fetchTopics();
  }, [subject]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Pilih Materi {subject}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(`/quiz/${subject}/${topic.id}`)}
              className="cursor-pointer flex items-center justify-between bg-white p-4 rounded-lg border hover:shadow-md hover:scale-[1.02] transition"
            >
              <div className="text-left">
                <h2 className="text-base font-semibold">{topic.title}</h2>
                <p className="text-sm text-gray-500">
                  Kelas {topic.grade}
                </p>
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
  );
}

export default Materi;
