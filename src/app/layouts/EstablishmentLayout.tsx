import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { LayoutDashboard, Users, FileSpreadsheet, HelpCircle, LogOut, GraduationCap, Menu, X, BookOpen } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export function EstablishmentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Optional: confirm if there are unsaved changes
    await logout();
    navigate("/connexion");
  };

  const navItems = [
    { to: "/espace/tableau-de-bord", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/espace/grand-tableau", icon: FileSpreadsheet, label: "Grand tableau" },
    { to: "/espace/enseignants", icon: Users, label: "Enseignants" },
    { to: "/espace/referentiels", icon: BookOpen, label: "Référentiels" },
    { to: "/espace/aide", icon: HelpCircle, label: "Aide" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm truncate max-w-[200px]">{user?.establishmentName}</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400 p-1">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={clsx(
          "bg-slate-900 border-r border-slate-800 w-full md:w-64 flex-shrink-0 md:flex flex-col z-40 fixed md:sticky top-0 h-screen transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold tracking-tight leading-tight truncate" title={user?.establishmentName || ""}>
              {user?.establishmentName}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
              Code: {user?.establishmentCode}
            </p>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="px-3 py-2 bg-slate-950 rounded-lg border border-slate-800">
            <p className="text-xs font-medium text-slate-300 truncate">{user?.displayName}</p>
            <p className="text-[10px] text-slate-500 uppercase mt-0.5">Espace Établissement</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
