import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import Header from "../Components/header";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../API/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";

interface Wallpaper {
  id: string;
  name: string;
  rarity: string;
  imageUrl: string;
}

const GachaWallpaper: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const [gachaCount, setGachaCount] = useState<number>(0);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [result, setResult] = useState<Wallpaper | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // 🔹 shimmer state
  const [showRateModal, setShowRateModal] = useState(false); // 🔹 modal drop rate

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Ambil data user
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setCoins(snap.data().coins || 0);
          setGachaCount(snap.data().gachaCount || 0);
        }

        // Ambil semua wallpaper global
        const wallpaperRef = collection(db, "wallpapers");
        const docsSnap = await getDocs(wallpaperRef);
        const list: Wallpaper[] = [];
        docsSnap.forEach((d) => {
          const data = d.data() as Wallpaper;
          const { id, ...rest } = data;
          list.push({ id: d.id, ...rest });
        });

        setWallpapers(list);
      }
    });
    return () => unsub();
  }, []);

  // Fungsi roll rarity
  const rollRarity = (): string => {
    const rand = Math.random() * 100;
    if (rand < 60) return "common";
    if (rand < 85) return "rare";
    if (rand < 95) return "epic";
    if (rand < 99.5) return "legend";
    return "ancient";
  };

  // Fungsi gacha
  const handleGacha = async () => {
    if (!user) return;
    if (coins < 20) {
      alert("Coins tidak cukup!");
      return;
    }

    let chosen: Wallpaper | null = null;

    // Cek pity (jaminan ancient)
    if ((gachaCount + 1) % 100 === 0) {
      const ancientList = wallpapers.filter((w) => w.rarity === "ancient");
      chosen = ancientList[Math.floor(Math.random() * ancientList.length)];
    } else {
      const rarity = rollRarity();
      const filtered = wallpapers.filter((w) => w.rarity === rarity);
      if (filtered.length > 0) {
        chosen = filtered[Math.floor(Math.random() * filtered.length)];
      }
    }

    if (!chosen) {
      alert("Tidak ada wallpaper tersedia!");
      return;
    }

    // Update user data
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      coins: coins - 20,
      gachaCount: gachaCount + 1,
    });

    // Simpan ke koleksi user
    const ownedRef = doc(db, "users", user.uid, "wallpapers", chosen.id);
    await setDoc(ownedRef, { owned: true }, { merge: true });

    // Update state
    setCoins(coins - 20);
    setGachaCount(gachaCount + 1);
    setResult(chosen);
    setImageLoaded(false); // reset shimmer
    setShowResultModal(true);
  };

  return (
    <div className="flex min-h-screen bg-stan-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Gacha Wallpaper
            </h2>
            <p className="text-gray-600">Coins: {coins}</p>
            <p className="text-gray-600">Total Gacha: {gachaCount}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleGacha}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={showResultModal} // cegah double gacha pas animasi
              >
                Gacha (20 Coins)
              </button>

              <button
                onClick={() => setShowRateModal(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Lihat Drop Rate
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 🔹 Modal Result */}
      {showResultModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg w-80">
            <h3 className="text-xl font-bold">Kamu mendapatkan!</h3>
            <p className="mt-2 text-lg font-semibold">{result.name}</p>

            {/* 🔹 shimmer wrapper */}
            <div className="w-full h-32 rounded-md relative overflow-hidden mt-2">
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md" />
              )}
              <img
                src={result.imageUrl}
                alt={result.name}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-32 object-cover rounded-md transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            <p className="mt-2 italic capitalize">Rarity: {result.rarity}</p>

            {gachaCount % 100 === 0 && (
              <p className="mt-3 text-red-600 font-bold">
                🎉 Pity Reward: Ancient Wallpaper!
              </p>
            )}

            <button
              onClick={() => setShowResultModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Modal Drop Rate */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h3 className="text-xl font-bold text-center mb-4">Drop Rate</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Common: 60%</li>
              <li>Rare: 30%</li>
              <li>Epic: 7%</li>
              <li>Legend: 2.5%</li>
              <li>Ancient: 0.5%</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Setiap 100x gacha, dijamin dapat 1 Ancient Wallpaper
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowRateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GachaWallpaper;
