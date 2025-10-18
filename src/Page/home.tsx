import React, { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../API/firebase";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/sidebar";
import { collection, getDocs } from "firebase/firestore";
import Header from "../Components/header";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

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
          kategori: docData.kategori || "umum",
        });
      });
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  const groupedSubjects = subjects.reduce((acc, subject) => {
    if (!acc[subject.kategori]) acc[subject.kategori] = [];
    acc[subject.kategori].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar tetap di kiri */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex flex-col flex-1 min-h-screen">
        <Header user={user} />

        <main className="flex-1 p-8 overflow-y-auto">
          {Object.entries(groupedSubjects).map(([kategori, subjectList]) => (
            <div key={kategori} className="mb-10">
              <h2 className="text-2xl font-bold mb-6 capitalize">
                {kategori === "umum"
                  ? "Pelajaran Umum"
                  : kategori === "bahasa"
                  ? "Pelajaran Bahasa"
                  : kategori === "khusus"
                  ? "UTBK"
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

        {/* ✅ Footer */}
        <footer className="bg-blue-500 text-white py-6 mt-auto">
          <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center space-x-8 mb-4">
              <a
                href="https://www.instagram.com/fardan_athilla/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition"
              >
                <FaInstagram className="h-6 w-6 inline" />
              </a>
              <a
                href="https://github.com/FardanAthilla/YokQuiz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition"
              >
                <FaGithub className="h-6 w-6 inline" />
              </a>
              <a
                href="https://www.linkedin.com/in/fardan-athilla-haidar-210943295/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition"
              >
                <FaLinkedin className="h-6 w-6 inline" />
              </a>
            </div>

            <p className="text-sm font-semibold text-white">
              © {new Date().getFullYear()} Dibuat oleh{" "}
              <span className="font-semibold text-white">
                Fardan Athilla Haidar
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
