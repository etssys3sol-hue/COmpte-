import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { LayoutDashboard, Building2, Users, Database, LogOut, ShieldCheck, GraduationCap, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

import { ThemeToggle } from "../../components/ThemeToggle";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    return saved === 'true';
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('admin_sidebar_collapsed', String(newState));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/connexion");
  };

  const navItems = [
    { to: "/admin/tableau-de-bord", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/admin/etablissements", icon: Building2, label: "Établissements" },
    { to: "/admin/acces", icon: ShieldCheck, label: "Gestion des accès" },
    { to: "/admin/collectes", icon: Database, label: "Collectes" },
    { to: "/admin/referentiels", icon: Users, label: "Référentiels" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm leading-tight">DDESTFP Admin</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-500 dark:text-slate-400 p-2 -mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col z-50 fixed md:sticky top-0 h-screen transition-all duration-300 ease-in-out",
          // Mobile classes
          "w-72 md:w-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop classes
          isSidebarCollapsed ? "md:w-20" : "md:w-64"
        )}
      >
        <div className="p-4 md:p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 h-20 md:h-auto">
          <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-900/20 flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className={clsx("min-w-0 flex-1 transition-opacity duration-300", isSidebarCollapsed ? "md:opacity-0 md:hidden" : "opacity-100")}>
            <h1 className="font-bold tracking-tight leading-tight">DDESTFP</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-0.5 truncate">Administration</p>
          </div>
          {/* Mobile close button */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-1">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent",
                    isSidebarCollapsed ? "md:justify-center" : "justify-start"
                  )
                }
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={clsx(
                  "whitespace-nowrap transition-opacity duration-300",
                  isSidebarCollapsed ? "md:hidden" : "block"
                )}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Desktop Toggle & Theme */}
          <div className={clsx(
            "hidden md:flex mb-2",
            isSidebarCollapsed ? "flex-col items-center gap-2" : "justify-between items-center"
          )}>
            <ThemeToggle />
            <button 
              onClick={toggleSidebar}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex justify-center"
              title={isSidebarCollapsed ? "Agrandir le menu" : "Réduire le menu"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          <div className={clsx(
            "bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 transition-all overflow-hidden",
            isSidebarCollapsed ? "md:p-0 md:h-0 md:border-transparent" : "p-3"
          )}>
            <div className={clsx("transition-opacity duration-300", isSidebarCollapsed ? "md:opacity-0 md:hidden" : "opacity-100")}>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={user?.displayName || ""}>{user?.displayName}</p>
              <p className="text-[10px] text-slate-500 uppercase mt-0.5">Admin Général</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group",
              isSidebarCollapsed ? "md:justify-center" : "justify-center"
            )}
            title={isSidebarCollapsed ? "Déconnexion" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={clsx(
              "whitespace-nowrap transition-opacity duration-300",
              isSidebarCollapsed ? "md:hidden" : "block"
            )}>
              Déconnexion
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
