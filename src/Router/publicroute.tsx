import React from "react";
import { Navigate } from "react-router-dom";
import type { User } from "firebase/auth";

interface PublicRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ user, children }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default PublicRoute;
