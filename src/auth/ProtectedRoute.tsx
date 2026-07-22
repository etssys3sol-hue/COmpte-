import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p>Vérification de votre accès...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Handled by parent ProtectedRoute if nested, or just return null

  if (user && user.role !== "admin") {
    return <Navigate to="/acces-refuse" replace />;
  }

  return <Outlet />;
}

export function EstablishmentRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user && user.role !== "establishment") {
    return <Navigate to="/acces-refuse" replace />;
  }

  return <Outlet />;
}
