import React, { useState } from "react";
import Sidebar from "../Components/sidebar";

type Tier = "Umum" | "Langka" | "Epic" | "Legenda" | "Ancient";

interface Pool {
  tier: Tier;
  rate: number;
  images: string[];
}

const pools: Pool[] = [
  {
    tier: "Umum",
    rate: 60,
    images: Array.from({ length: 7 }, (_, i) => `/img/umum${i + 1}.jpg`),
  },
  {
    tier: "Langka",
    rate: 30,
    images: Array.from({ length: 5 }, (_, i) => `/img/langka${i + 1}.jpg`),
  },
  {
    tier: "Epic",
    rate: 7,
    images: Array.from({ length: 3 }, (_, i) => `/img/epic${i + 1}.jpg`),
  },
  {
    tier: "Legenda",
    rate: 2.5,
    images: Array.from({ length: 3 }, (_, i) => `/img/legenda${i + 1}.jpg`),
  },
  {
    tier: "Ancient",
    rate: 0.5,
    images: Array.from({ length: 2 }, (_, i) => `/img/ancient${i + 1}.jpg`),
  },
];

const getRandomTier = (): Pool => {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const pool of pools) {
    acc += pool.rate;
    if (roll <= acc) return pool;
  }
  return pools[0];
};

const GachaWallpaper: React.FC = () => {
  const [result, setResult] = useState<{ tier: Tier; img: string } | null>(null);
  const [pullCount, setPullCount] = useState(0);
  const [sinceAncient, setSinceAncient] = useState(0);

  const handleGacha = () => {
    let tierPool: Pool;

    if (sinceAncient >= 99) {
      tierPool = pools.find((p) => p.tier === "Ancient")!;
      setSinceAncient(0);
    } else {
      tierPool = getRandomTier();
      if (tierPool.tier === "Ancient") {
        setSinceAncient(0);
      } else {
        setSinceAncient((prev) => prev + 1);
      }
    }

    const img =
      tierPool.images[Math.floor(Math.random() * tierPool.images.length)];
    setResult({ tier: tierPool.tier, img });
    setPullCount((prev) => prev + 1);
  };

  return (
  <div className="flex min-h-screen bg-slate-100 text-white">
    <Sidebar />

    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">🎉 Gacha Wallpaper 🎉</h1>

      <button
        onClick={handleGacha}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md transition"
      >
        Gacha Sekarang
      </button>

      <p className="mt-4 text-sm text-gray-500">
        Total Pull: <span className="font-semibold">{pullCount}</span> | Sejak
        Ancient terakhir: <span className="font-semibold">{sinceAncient}</span>
      </p>

      {result && (
        <div className="mt-8 text-center">
          <p className="text-xl font-semibold mb-4">
            Kamu mendapat:{" "}
            <span
              className={
                result.tier === "Ancient"
                  ? "text-purple-400"
                  : result.tier === "Legenda"
                  ? "text-yellow-400"
                  : result.tier === "Epic"
                  ? "text-pink-400"
                  : result.tier === "Langka"
                  ? "text-blue-400"
                  : "text-gray-300"
              }
            >
              {result.tier}
            </span>
          </p>
          <img
            src={result.img}
            alt={result.tier}
            className="w-64 h-64 object-cover rounded-xl shadow-lg border-4 border-white"
          />
        </div>
      )}
    </main>
  </div>
);

};

export default GachaWallpaper;