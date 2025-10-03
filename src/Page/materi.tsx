import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../API/firebase";
import Sidebar from "../Components/sidebar";
import Header from "../Components/header";
import { onAuthStateChanged, type User } from "firebase/auth";

function Materi() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // fetch array materi
  useEffect(() => {
    const fetchTopics = async () => {
      if (!subject) return;
      const docRef = doc(db, "pelajaran", subject);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const materiArray: string[] = data.materi || [];
        setTopics(materiArray);
      }
    };
    fetchTopics();
  }, [subject]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Kembali</span>
              </button>
            </div>

            {/* Grid materi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((materi, index) => (
                <div
                  key={index}
                  onClick={() =>
                    navigate(
                      `/prepare/${subject}/${encodeURIComponent(materi)}`
                    )
                  }
                  className="cursor-pointer flex items-center justify-between bg-white p-4 rounded-lg border hover:shadow-md hover:scale-[1.02] transition"
                >
                  <div className="text-left">
                    <h2 className="text-base font-semibold">{materi}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Materi;
