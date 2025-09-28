import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../API/firebase";
import Sidebar from "../Components/sidebar";

const Account: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setImgError(false);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-600">
          Anda belum login
        </h2>
      </div>
    );
  }

  const fallbackChar = (user.displayName || user.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          {user.photoURL && !imgError ? (
            <img
              src={user.photoURL}
              alt="Foto Profil"
              className="w-24 h-24 rounded-full mx-auto mb-4"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">{fallbackChar}</span>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-2">{user.displayName}</h2>
          <p className="text-gray-600 mb-4">{user.email}</p>

          <div className="border-t pt-4 text-sm text-left">
            <p>
              <span className="font-semibold">UID:</span> {user.uid}
            </p>
            <p>
              <span className="font-semibold">Email Verified:</span>{" "}
              {user.emailVerified ? "Ya" : "Belum"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
