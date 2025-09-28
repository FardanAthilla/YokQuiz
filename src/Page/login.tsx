import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../API/firebase";
import { useNavigate } from "react-router-dom";
import ilustrasi from "/pemrogaman_web/React/QuizWeb/src/assets/Ilustrasi.png";
import teks from "/pemrogaman_web/React/QuizWeb/src/assets/teks.png";
import Logo from "/pemrogaman_web/React/QuizWeb/src/assets/Logo.png";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Login berhasil:", result.user);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Login gagal!");
    }
  };

return (
  <div className="flex h-screen bg-blue-300">
    <div className="hidden lg:flex items-center justify-center flex-1">
      <div className="max-w-md text-center">
        <img src={ilustrasi} alt="YokQuiz" />
      </div>
    </div>

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
        </div>
      </div>
    </div>
  </div>
);
};

export default Login;
