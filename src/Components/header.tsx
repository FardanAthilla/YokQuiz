import React, { useState } from "react";
import { type User } from "firebase/auth";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [imgError, setImgError] = useState(false);
  const location = useLocation();

  // mapping pathname ke judul halaman
  const pageTitleMap: Record<string, string> = {
    "/": "Beranda",
    "/hasil": "Hasil",
    "/koleksi": "Koleksi",
    "/gacha": "Gacha",
  };

  // ambil title sesuai route
  let title = "Halaman";
  if (pageTitleMap[location.pathname]) {
    title = pageTitleMap[location.pathname];
  } else if (location.pathname.startsWith("/materi")) {
    title = "Materi";
  } else if (location.pathname.startsWith("/quiz")) {
    title = "Quiz";
  } else if (location.pathname.startsWith("/prepare")) {
    title = "Persiapan";
  }

  const fallbackChar = (user?.displayName || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <button className="md:hidden text-gray-500 focus:outline-none">
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 ml-2 md:ml-4 pl-2 md:pl-0">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-500 focus:outline-none">
          <i className="fas fa-bell"></i>
        </button>
        <button className="text-gray-500 focus:outline-none">
          <i className="fas fa-envelope"></i>
        </button>

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
  );
};

export default Header;
