import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./API/firebase";
import AppRouter from "./Router/router";

const App: React.FC = () => {
  const [,setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("user");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
