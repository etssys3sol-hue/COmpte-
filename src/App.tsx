import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute, AdminRoute, EstablishmentRoute } from "./auth/ProtectedRoute";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "./components/ThemeProvider";

// Lazy-loaded page components
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));

const AdminLayout = lazy(() => import("./app/layouts/AdminLayout").then(m => ({ default: m.AdminLayout })));
const EstablishmentLayout = lazy(() => import("./app/layouts/EstablishmentLayout").then(m => ({ default: m.EstablishmentLayout })));
const AdminDashboard = lazy(() => import("./features/admin/dashboard/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminCollectesView = lazy(() => import("./features/admin/dashboard/AdminCollectesView").then(m => ({ default: m.AdminCollectesView })));
const AdminEstablishmentsList = lazy(() => import("./features/admin/establishments/AdminEstablishmentsList").then(m => ({ default: m.AdminEstablishmentsList })));
const AdminAccessManagement = lazy(() => import("./features/admin/access-management/AdminAccessManagement").then(m => ({ default: m.AdminAccessManagement })));
const EstablishmentDashboard = lazy(() => import("./features/establishment-space/dashboard/EstablishmentDashboard").then(m => ({ default: m.EstablishmentDashboard })));
const CollectionView = lazy(() => import("./features/establishment-space/collection/CollectionView").then(m => ({ default: m.CollectionView })));
const TeachersView = lazy(() => import("./features/establishment-space/teachers/TeachersView").then(m => ({ default: m.TeachersView })));
const EstablishmentReferentialsView = lazy(() => import("./features/establishment-space/referentials/EstablishmentReferentialsView").then(m => ({ default: m.EstablishmentReferentialsView })));
const ReferentialsView = lazy(() => import("./components/ReferentialsView").then(m => ({ default: m.ReferentialsView })));

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
      <p className="text-sm">Chargement en cours...</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </AuthProvider>
    </ThemeProvider>
  );
}
