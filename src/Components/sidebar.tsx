import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  GiftIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "/pemrogaman_web/React/QuizWeb/src/assets/Logo2.png";
import { signOut } from "firebase/auth";
import { auth } from "../API/firebase";
import { useState } from "react";

const menu1 = [
  { name: "Beranda", icon: HomeIcon, path: "/" },
  { name: "Hasil", icon: ChartBarIcon, path: "/hasil" },
  { name: "Gacha", icon: GiftIcon, path: "/gacha" },
  { name: "Akun", icon: UsersIcon, path: "/account" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  const MenuList = () => (
    <div className="flex-1">
      {menu1.map((item) => {
        let isActive = location.pathname === item.path;
        if (
          item.path === "/" &&
          (location.pathname.startsWith("/materi") ||
            location.pathname.startsWith("/quiz"))
        ) {
          isActive = true;
        }

        return (
          <button
            key={item.name}
            onClick={() => {
              navigate(item.path);
              setOpen(false); // auto close di mobile
            }}
            className={`mt-3 flex items-center gap-2 p-2 w-full text-left rounded-lg transition-colors
              ${isActive ? "bg-blue-500 text-white" : "hover:bg-blue-200"}`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Tombol Hamburger (hanya mobile) */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-100 rounded-md shadow"
      >
        {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {/* Overlay saat sidebar terbuka di mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar utama */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 bg-gray-100 text-gray-700 shadow-md h-screen p-4 flex flex-col justify-between transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:sticky top-0 lg:flex`}
      >
        <div>
          <div className="h-16 flex items-center justify-center mb-5 mt-4">
            <img src={logo} alt="YokQuiz" className="h-16" />
          </div>
          <MenuList />
        </div>

        <div className="mt-5 mb-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 p-2 w-full text-left rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Modal konfirmasi logout */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
          <div className="bg-white rounded-md shadow-xl max-w-md w-full">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
              >
                ✕
              </button>
            </div>
            <div className="p-6 pt-0 text-center">
              <svg
                className="w-20 h-20 text-red-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                Apakah anda yakin untuk keluar?
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleLogout();
                }}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base px-3 py-2.5 mr-2"
              >
                Keluar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium rounded-lg text-base px-3 py-2.5"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
