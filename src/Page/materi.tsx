import { useNavigate, useParams, Navigate } from "react-router-dom";
import { subjects } from "../Data/Subject";
import Sidebar from "../Components/sidebar";

function Materi() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();

  if (!subject || !subjects[subject]) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Pilih Materi{" "}
          {subject === "mtk"
            ? "Matematika"
            : subject === "indo"
            ? "Bahasa Indonesia"
            : subject === "inggris"
            ? "Bahasa Inggris"
            : subject === "ipa"
            ? "IPA"
            : subject === "ips"
            ? "IPS"
            : "Pendidikan Pancasila"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {subjects[subject].map((topic) => (
            <div
              key={topic}
              onClick={() =>
                navigate(`/quiz/${subject}/${topic.toLowerCase()}`)
              }
              className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform text-center"
            >
              <h2 className="text-lg font-semibold">{topic}</h2>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Materi;
