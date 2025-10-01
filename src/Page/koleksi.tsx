import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import Header from "../Components/header";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../API/firebase";

const Koleksi: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex min-h-screen bg-stan-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* pakai user */}
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Konten Utama
            </h2>
            <p className="text-gray-600">
              Ini template halaman kosong. Silakan isi sesuai kebutuhanmu.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Koleksi;
