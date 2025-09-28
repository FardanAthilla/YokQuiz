import React from "react";
import { Navigate } from "react-router-dom";
import type { User } from "firebase/auth";

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
