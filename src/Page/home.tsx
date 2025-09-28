import { useNavigate } from "react-router-dom";
import { subjects } from "../Data/Subject";
import Sidebar from "../Components/sidebar";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Pilih Pelajaran
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {Object.keys(subjects).map((key) => (
            <div
              key={key}
              onClick={() => navigate(`/materi/${key}`)}
              className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform text-center"
            >
              <h2 className="text-xl font-bold capitalize">
                {key === "mtk"
                  ? "Matematika"
                  : key === "indo"
                  ? "Bahasa Indonesia"
                  : key === "inggris"
                  ? "Bahasa Inggris"
                  : key === "ipa"
                  ? "IPA"
                  : key === "ips"
                  ? "IPS"
                  : "Pendidikan Pancasila"}
              </h2>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
