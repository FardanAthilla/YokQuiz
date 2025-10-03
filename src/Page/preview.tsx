import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../API/firebase";
import { doc, getDoc } from "firebase/firestore";

type Wallpaper = {
  id: string;
  name: string;
  rarity: string;
  imageUrl: string;
};

const Preview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const snap = await getDoc(doc(db, "wallpapers", id));
      if (snap.exists()) {
        setWallpaper({
          ...(snap.data() as Omit<Wallpaper, "id">),
          id: snap.id,
        });
      }
    };
    fetchData();
  }, [id]);

  if (!wallpaper)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Tombol Back */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white/70 px-3 py-1 rounded-md z-20"
      >
        Kembali
      </button>

      {/* Wallpaper */}
      <div
        className={`w-full h-full bg-center bg-cover`}
        style={{ backgroundImage: `url(${wallpaper.imageUrl})` }}
      />

      {/* Aura khusus Exclusive */}
      {(wallpaper.rarity === "Exclusive" || wallpaper.rarity === "Legend") && (
        <>
          {/* Aura di pinggir layar */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-purple-600/50 via-transparent to-transparent blur-3xl" />
            <div className="absolute inset-0 animate-spin-slow bg-gradient-to-b from-pink-600/30 via-transparent to-transparent blur-3xl" />
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-cyan-500/30 via-transparent to-transparent blur-2xl" />
          </div>
        </>
      )}

      {/* Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white z-20">
        <h1 className="text-3xl font-bold">{wallpaper.name}</h1>
        <p className="uppercase tracking-wide">{wallpaper.rarity}</p>
      </div>
    </div>
  );
};

export default Preview;
