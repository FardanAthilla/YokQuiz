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
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/preview/${wp.id}`)}
      className="relative bg-white rounded-lg shadow p-2 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition"
    >
      {/* Container gambar */}
      <div className="relative w-full h-32 rounded-md overflow-hidden">
        {/* Shimmer loader */}
        {!loaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-md" />
        )}

        {/* Gambar */}
        <img
          src={wp.imageUrl}
          alt={wp.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover rounded-md transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${wp.owned ? "" : "opacity-30"}`}
        />

        {/* 🔒 Overlay */}
        {!wp.owned && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl bg-gray-800/50 rounded-md">
            🔒
          </div>
        )}
      </div>

      {/* Info bawah */}
      <p className="mt-2 font-semibold text-sm">{wp.name}</p>
      <span className="text-xs text-gray-500">{wp.rarity}</span>
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

  // 🔹 mapping rarity ke angka biar gampang sorting
  const rarityOrder: Record<string, number> = {
    Common: 1,
    Rare: 2,
    Epic: 3,
    Legend: 4,
    Exclusive: 5,
  };

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

        let merged: Wallpaper[] = [];

        if (user) {
          // Ambil koleksi user
          const userWallpapersSnap = await getDocs(
            collection(db, "users", user.uid, "wallpapers")
          );
          const ownedIds = userWallpapersSnap.docs
            .filter((d) => d.data().owned)
            .map((d) => d.id);

          merged = allWallpapers.map((wp) => ({
            ...wp,
            owned: ownedIds.includes(wp.id),
          }));
        } else {
          merged = allWallpapers;
        }

        // 🔹 Urutkan berdasarkan rarity
        merged.sort(
          (a, b) =>
            (rarityOrder[a.rarity] || 999) - (rarityOrder[b.rarity] || 999)
        );

        setWallpapers(merged);
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
