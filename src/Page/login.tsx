import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../API/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

import ilustrasi from "../assets/Illustration.png";
import teks from "../assets/Name.png";
import Logo from "../assets/Icon.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [buttonHidden, setButtonHidden] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setButtonHidden(true);
    try {
      // 🔹 Login pakai Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("✅ Login berhasil:", user.uid, user.email);

      // 🔹 Cek apakah user sudah ada di Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // 🔹 Kalau belum ada, buat user baru dengan data awal
        await setDoc(userRef, {
          coins: 100, // kamu bisa ubah default coin awal di sini
          gachaCount: 0,
          selectedWallpapers: null,
        });
        console.log("🆕 User baru dibuat di Firestore:", user.uid);
      } else {
        console.log("👤 User sudah ada di Firestore:", user.uid);
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMsg("Login gagal atau dibatalkan!");
      setTimeout(() => setErrorMsg(null), 2000);
      setLoading(false);
      setButtonHidden(false);
    }
  };

  const restoreButton = () => {
    setButtonHidden(false);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-blue-300 relative">
      {errorMsg && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-red-200 px-6 py-3 rounded-md text-sm flex items-center shadow-lg z-50">
          <svg
            viewBox="0 0 24 24"
            className="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-2"
          >
            <path
              fill="currentColor"
              d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
            ></path>
          </svg>
          <span className="text-red-800">{errorMsg}</span>
        </div>
      )}

      {/* Kiri */}
      <div className="hidden lg:flex items-center justify-center flex-1">
        <div className="max-w-md text-center">
          <img src={ilustrasi} alt="YokQuiz" />
        </div>
      </div>

      {/* Kanan */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="bg-gray-100 rounded-l-3xl shadow-lg w-full h-full flex items-center justify-center">
          <div className="max-w-md w-full p-6 text-center">
            <img src={Logo} alt="teks" className="h-36 mx-auto pb-5" />
            <h1 className="text-3xl font-semibold mb-2 text-black">
              Selamat Datang di
            </h1>
            <img src={teks} alt="teks" className="h-16 mx-auto" />
            <p className="text-sm text-gray-500 mb-6">
              Ayo bergabung dengan komunitas kami! Akses kapan saja dan gratis!
            </p>

            {/* Tombol login */}
            {!buttonHidden ? (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 mb-3"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Masuk menggunakan Google
              </button>
            ) : loading ? (
              <div className="w-full flex justify-center items-center p-2 mb-3">
                <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <button
                onClick={restoreButton}
                className="w-full flex justify-center items-center gap-2 bg-blue-500 text-sm p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 mb-3"
              >
                Kembali
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
