import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import Header from "../Components/header";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../API/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

type Wallpaper = {
  id: string;
  name: string;
  rarity: string;
  imageUrl: string;
  owned?: boolean;
};

// 🔹 Komponen untuk 1 kartu wallpaper
const WallpaperCard: React.FC<{ wp: Wallpaper }> = ({ wp }) => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate(); // ⬅️ tambahin ini

  return (
    <div
      onClick={() => navigate(`/preview/${wp.id}`)} // ⬅️ klik pindah ke preview
      className="relative bg-white rounded-lg shadow p-2 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition"
    >
      {!loaded && <div className="w-full h-32 rounded-md shimmer" />}

      <img
        src={wp.imageUrl}
        alt={wp.name}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-32 object-cover rounded-md transition-opacity duration-500 ${
          wp.owned ? "" : "opacity-30"
        } ${loaded ? "opacity-100" : "opacity-0 absolute"}`}
      />

      <p className="mt-2 font-semibold text-sm">{wp.name}</p>
      <span className="text-xs text-gray-500">{wp.rarity}</span>

      {!wp.owned && (
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🔒
        </div>
      )}
    </div>
  );
};


const Koleksi: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  // 🔹 Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // 🔹 Fetch semua wallpaper global + data user
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil semua wallpaper global
        const wallpapersSnap = await getDocs(collection(db, "wallpapers"));
        const allWallpapers: Wallpaper[] = wallpapersSnap.docs.map(
          (docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Wallpaper, "id">),
          })
        );

        if (user) {
          // Ambil koleksi user
          const userWallpapersSnap = await getDocs(
            collection(db, "users", user.uid, "wallpapers")
          );
          const ownedIds = userWallpapersSnap.docs
            .filter((d) => d.data().owned)
            .map((d) => d.id);

          // Tandai mana yang user punya
          const merged = allWallpapers.map((wp) => ({
            ...wp,
            owned: ownedIds.includes(wp.id),
          }));
          setWallpapers(merged);
        } else {
          setWallpapers(allWallpapers);
        }
      } catch (error) {
        console.error("Error fetching wallpapers:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Koleksi Wallpaper
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wallpapers.map((wp) => (
              <WallpaperCard key={wp.id} wp={wp} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Koleksi;
