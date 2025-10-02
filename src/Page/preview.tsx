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
          id: snap.id, // id dari Firestore document
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
        className="absolute top-4 left-4 bg-white/70 px-3 py-1 rounded-md"
      >
        ← Back
      </button>

      {/* Wallpaper */}
      <div
        className={`
          w-full h-full bg-center bg-cover
          ${wallpaper.rarity === "legend" ? "parallax" : ""}
          ${wallpaper.rarity === "ancient" ? "parallax aura" : ""}
        `}
        style={{ backgroundImage: `url(${wallpaper.imageUrl})` }}
      />

      {/* Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white">
        <h1 className="text-3xl font-bold">{wallpaper.name}</h1>
        <p className="uppercase tracking-wide">{wallpaper.rarity}</p>
      </div>
    </div>
  );
};

export default Preview;
