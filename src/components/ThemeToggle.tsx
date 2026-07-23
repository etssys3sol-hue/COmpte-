import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { clsx } from "clsx";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={clsx(
        "p-2 rounded-lg transition-colors flex items-center justify-center",
        "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
        "dark:text-slate-400 dark:hover:text-slate-800 dark:text-slate-200 dark:hover:bg-slate-100 dark:bg-slate-800",
        className
      )}
      title="Basculer le thème"
    >
      <Sun className="h-5 w-5 hidden dark:block" />
      <Moon className="h-5 w-5 block dark:hidden" />
      <span className="sr-only">Basculer le thème</span>
    </button>
  );
}
