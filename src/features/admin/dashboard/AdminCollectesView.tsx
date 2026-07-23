import React from "react";
import { SharedWorkspace } from "../../shared/SharedWorkspace";

export function AdminCollectesView() {
  return (
    <div className="p-4 h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Collectes des données</h1>
        <p className="text-slate-500 dark:text-slate-400">Consultez et modifiez les données de n'importe quel établissement.</p>
      </div>
      <SharedWorkspace viewMode="grid" />
    </div>
  );
}
