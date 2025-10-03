import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../API/firebase";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../Components/sidebar";
import Header from "../Components/header";

type Wallpaper = {
  id: string;
  name: string;
  rarity: string;
  imageUrl?: string;
  owned?: boolean;
};

const WallpaperCard: React.FC<{
  wp: Wallpaper;
  selected: boolean;
  onSelect: (id: string) => void;
}> = ({ wp, selected, onSelect }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={() => wp.owned && onSelect(wp.id)}
      className={`relative bg-white rounded-lg shadow p-2 flex flex-col items-center justify-center cursor-pointer transition 
        ${wp.owned ? "hover:shadow-lg" : "opacity-40 pointer-events-none"}
        ${selected ? "ring-2 ring-blue-500" : ""}`}
    >
      {wp.id === "default" ? (
        <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-gray-500 text-sm rounded-md"></div>
      ) : (
        <div className="relative w-full h-32 rounded-md overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-md" />
          )}
          <img
            src={wp.imageUrl}
            alt={wp.name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover rounded-md transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {!wp.owned && (
            <div className="absolute inset-0 flex items-center justify-center text-2xl bg-gray-800/50 rounded-md">
              🔒
            </div>
          )}
        </div>
      )}

      {/* Info bawah */}
      <p className="mt-2 font-semibold text-sm">{wp.name}</p>
      <span className="text-xs text-gray-500">{wp.rarity}</span>
    </div>
  );
};

const QuizSetup: React.FC = () => {
  const { subject, materi } = useParams<{ subject: string; materi: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(
    "default"
  );
  const [jumlahSoal, setJumlahSoal] = useState(5);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const wallpapersSnap = await getDocs(collection(db, "wallpapers"));
        const allWallpapers: Wallpaper[] = wallpapersSnap.docs.map(
          (docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Wallpaper, "id">),
          })
        );

        // mapping rarity ke angka
        const rarityOrder: Record<string, number> = {
          Default: 1,
          Common: 2,
          Rare: 3,
          Epic: 4,
          Legend: 5,
          Exclusive: 6,
        };

        let merged: Wallpaper[] = [];

        if (user) {
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

        // tambah default
        const allWallpapersWithDefault: Wallpaper[] = [
          {
            id: "default",
            name: "",
            rarity: "Default",
            owned: true,
          },
          ...merged,
        ];

        // sort berdasarkan rarity
        allWallpapersWithDefault.sort(
          (a, b) =>
            (rarityOrder[a.rarity] || 999) - (rarityOrder[b.rarity] || 999)
        );

        setWallpapers(allWallpapersWithDefault);
      } catch (err) {
        console.error("Error fetching wallpapers:", err);
      }
    };

    fetchWallpapers();
  }, [user]);

  const startQuiz = () => {
    if (!selectedWallpaper) {
      alert("Pilih wallpaper dulu sebelum mulai quiz!");
      return;
    }

    navigate(
      `/quiz/${subject}/${encodeURIComponent(
        materi || ""
      )}?wallpaper=${selectedWallpaper}&jumlah=${jumlahSoal}`
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">

            {/* pilih jumlah soal */}
            <div className="mb-6">
  <label className="block font-semibold mb-2">Jumlah Soal:</label>
  <div className="relative inline-block w-28">
    <select
      value={jumlahSoal}
      onChange={(e) => setJumlahSoal(Number(e.target.value))}
      className="border rounded px-3 py-1 w-full text-center appearance-none"
    >
      <option value={3}>3</option>
      <option value={5}>5</option>
      <option value={8}>8</option>
      <option value={10}>10</option>
    </select>
    {/* Icon arrow custom */}
    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
      ▼
    </span>
  </div>
</div>


            {/* Grid wallpaper */}
            <h3 className="font-semibold mb-3">Pilih Wallpaper:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {wallpapers.map((wp) => (
                <WallpaperCard
                  key={wp.id}
                  wp={wp}
                  selected={selectedWallpaper === wp.id}
                  onSelect={setSelectedWallpaper}
                />
              ))}
            </div>

            {/* Tombol mulai */}
            <button
              onClick={startQuiz}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Mulai Quiz
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizSetup;
