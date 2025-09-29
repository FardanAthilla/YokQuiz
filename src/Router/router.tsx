import { Routes, Route } from "react-router-dom";
import Home from "../Page/home";
import Materi from "../Page/materi";
import Quiz from "../Page/quiz";
import NotFound from "../error/error";
import Login from "../Page/login";
import ProtectedRoute from "./protectedroute";
import PublicRoute from "./publicroute";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../API/firebase";
import Account from "../Page/account";
import GachaWallpaper from "../Page/gacha";
import Hasil from "../Page/hasil";
import TambahMateri from "../Page/nambahmateri";

function AppRouter() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <img
          className="w-20 h-20 animate-spin"
          src="https://www.svgrepo.com/show/173880/loading-arrows.svg"
          alt="Loading icon"
        />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute user={user}>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/p"
        element={
          <ProtectedRoute user={user}>
            <TambahMateri />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hasil"
        element={
          <ProtectedRoute user={user}>
            <Hasil />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gacha"
        element={
          <ProtectedRoute user={user}>
            <GachaWallpaper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute user={user}>
            <Account />
          </ProtectedRoute>
        }
      />

      <Route
        path="/materi/:subject"
        element={
          <ProtectedRoute user={user}>
            <Materi />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:subject/:topic"
        element={
          <ProtectedRoute user={user}>
            <Quiz />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
