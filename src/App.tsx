import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute, AdminRoute, EstablishmentRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { AdminLayout } from "./app/layouts/AdminLayout";
import { EstablishmentLayout } from "./app/layouts/EstablishmentLayout";
import { AdminDashboard } from "./features/admin/dashboard/AdminDashboard";
import { AdminCollectesView } from "./features/admin/dashboard/AdminCollectesView";
import { AdminEstablishmentsList } from "./features/admin/establishments/AdminEstablishmentsList";
import { AdminAccessManagement } from "./features/admin/access-management/AdminAccessManagement";
import { EstablishmentDashboard } from "./features/establishment-space/dashboard/EstablishmentDashboard";
import { CollectionView } from "./features/establishment-space/collection/CollectionView";
import { TeachersView } from "./features/establishment-space/teachers/TeachersView";
import { EstablishmentReferentialsView } from "./features/establishment-space/referentials/EstablishmentReferentialsView";
import { ReferentialsView } from "./components/ReferentialsView";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/connexion" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="tableau-de-bord" element={<AdminDashboard />} />
              <Route path="etablissements" element={<AdminEstablishmentsList />} />
              <Route path="acces" element={<AdminAccessManagement />} />
              <Route path="collectes" element={<AdminCollectesView />} />
              <Route path="referentiels" element={
                <div className="p-6 max-w-[1700px] mx-auto">
                  <h1 className="text-2xl font-bold mb-6">Référentiels (Global)</h1>
                  <ReferentialsView />
                </div>
              } />
              <Route index element={<Navigate to="tableau-de-bord" replace />} />
            </Route>
          </Route>

          {/* Establishment Routes */}
          <Route element={<EstablishmentRoute />}>
            <Route path="/espace" element={<EstablishmentLayout />}>
              <Route path="tableau-de-bord" element={<EstablishmentDashboard />} />
              <Route path="grand-tableau" element={<CollectionView />} />
              <Route path="enseignants" element={<TeachersView />} />
              <Route path="referentiels" element={<EstablishmentReferentialsView />} />
              <Route path="aide" element={<div className="p-6">Page d'aide</div>} />
              <Route index element={<Navigate to="tableau-de-bord" replace />} />
            </Route>
          </Route>
        </Route>

        <Route path="/acces-refuse" element={
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Accès Refusé</h1>
            <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
          </div>
        } />

        <Route path="/" element={<Navigate to="/connexion" replace />} />
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    </AuthProvider>
  );
}
