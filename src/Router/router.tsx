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

function AppRouter() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

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
