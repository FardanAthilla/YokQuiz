import React, { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../API/firebase";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/sidebar";
import { collection, getDocs } from "firebase/firestore";
import Header from "../Components/header";

type Subject = {
  id: string;
  gambar?: string;
  kategori: string;
};

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      const querySnapshot = await getDocs(collection(db, "pelajaran"));
      const data: Subject[] = [];
      querySnapshot.forEach((docSnap) => {
        const docData = docSnap.data();
        data.push({
          id: docSnap.id,
          gambar: docData.gambar || "",
          kategori: docData.kategori || "umum", // default kalau belum ada
        });
      });
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  // ✅ group subjects by kategori
  const groupedSubjects = subjects.reduce((acc, subject) => {
    if (!acc[subject.kategori]) acc[subject.kategori] = [];
    acc[subject.kategori].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header user={user} />

        <main className="flex-1 p-8">
          {Object.entries(groupedSubjects).map(([kategori, subjectList]) => (
            <div key={kategori} className="mb-10">
              <h2 className="text-2xl font-bold mb-6 capitalize">
                {kategori === "umum"
                  ? "Pelajaran Umum"
                  : kategori === "bahasa"
                  ? "Pelajaran Bahasa"
                  : kategori === "khusus"
                  ? "Pelajaran Khusus"
                  : kategori}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {subjectList.map((subject) => (
                  <div
                    key={subject.id}
                    onClick={() => navigate(`/materi/${subject.id}`)}
                    className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform text-center capitalize overflow-hidden"
                  >
                    {subject.gambar && (
                      <img
                        src={subject.gambar}
                        alt={subject.id}
                        className="w-full h-36 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h2 className="text-base font-semibold truncate">
                        {subject.id}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Home;
