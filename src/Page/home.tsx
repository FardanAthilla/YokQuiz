import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../API/firebase";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/sidebar";
import { subjects } from "../Data/Subject";

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setImgError(false);
    });
    return () => unsubscribe();
  }, []);

  const fallbackChar = (user?.displayName || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button className="md:hidden text-gray-500 focus:outline-none">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="text-xl font-semibold text-gray-800 ml-4">
              Beranda
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 focus:outline-none">
              <i className="fas fa-bell"></i>
            </button>
            <button className="text-gray-500 focus:outline-none">
              <i className="fas fa-envelope"></i>
            </button>

            {/* USER INFO */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {user.photoURL && !imgError ? (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.photoURL}
                    alt="User"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {fallbackChar}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Anda belum login</p>
            )}
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            Pilih Pelajaran
          </h1>

          {/* GRID PELAJARAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Object.keys(subjects).map((key) => (
              <div
                key={key}
                onClick={() => navigate(`/materi/${key}`)}
                className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform text-center"
              >
                <h2 className="text-xl font-bold capitalize">
                  {key === "mtk"
                    ? "Matematika"
                    : key === "indo"
                    ? "Bahasa Indonesia"
                    : key === "inggris"
                    ? "Bahasa Inggris"
                    : key === "ipa"
                    ? "IPA"
                    : key === "ips"
                    ? "IPS"
                    : "Pendidikan Pancasila"}
                </h2>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
