import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../API/firebase";

function TambahMateri() {
  const [judul, setJudul] = useState("");
  const [kelas, setKelas] = useState(1);
  const [gambar, setGambar] = useState("");

  const handleTambah = async () => {
    try {
      // Referensi dokumen pelajaran/Matematika
      const docRef = doc(db, "pelajaran", "Matematika");

      // bikin field name unik, misalnya materi3
      const fieldName = `materi${Date.now()}`; // pakai timestamp biar unik

      await updateDoc(docRef, {
        [fieldName]: {
          materi: judul,
          kelas: kelas,
          gambar: gambar || "https://via.placeholder.com/200",
        },
      });

      alert("Materi berhasil ditambahkan ✅");
      setJudul("");
      setKelas(1);
      setGambar("");
    } catch (err) {
      console.error("Gagal menambahkan:", err);
      alert("Error menambahkan data!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">Tambah Materi Matematika</h2>

      <input
        type="text"
        placeholder="Judul Materi"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        className="w-full border rounded-lg p-2 mb-3"
      />

      <input
        type="number"
        placeholder="Kelas"
        value={kelas}
        onChange={(e) => setKelas(Number(e.target.value))}
        className="w-full border rounded-lg p-2 mb-3"
      />

      <input
        type="text"
        placeholder="URL Gambar"
        value={gambar}
        onChange={(e) => setGambar(e.target.value)}
        className="w-full border rounded-lg p-2 mb-3"
      />

      <button
        onClick={handleTambah}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
      >
        Tambah Materi
      </button>
    </div>
  );
}

export default TambahMateri;
