import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  GiftIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import logo from "/pemrogaman_web/React/QuizWeb/src/assets/Logo2.png";
import { signOut } from "firebase/auth";
import { auth } from "../API/firebase";

const menu1 = [
  { name: "Beranda", icon: HomeIcon, path: "/" },
  { name: "Hasil", icon: ChartBarIcon, path: "/hasil" },
  { name: "Gacha", icon: GiftIcon, path: "/gacha" },
  { name: "Akun", icon: UsersIcon, path: "/account" },
  { name: "Admin", icon: UsersIcon, path: "/admin" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <aside className="w-64 bg-gray-100 text-gray-700 shadow-md h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="h-16 flex items-center justify-center mb-5 mt-4">
          <img src={logo} alt="YokQuiz" className="h-16" />
        </div>

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
                onClick={() => navigate(item.path)}
                className={`mt-3 flex items-center gap-2 p-2 w-full text-left rounded-lg transition-colors
        ${isActive ? "bg-blue-500 text-white" : "hover:bg-blue-200"}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 mb-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 w-full text-left rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
