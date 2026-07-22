import React from "react";
import { useAuth } from "../../../auth/AuthProvider";
import { SharedWorkspace } from "../../shared/SharedWorkspace";
import { EstablishmentCode } from "../../../types";

export function CollectionView() {
  const { user } = useAuth();
  
  if (!user || !user.establishmentCode) {
    return <div>Accès non configuré.</div>;
  }
  
  return (
    <div className="p-4 h-full">
      <SharedWorkspace 
        forcedEstablishmentCode={user.establishmentCode as EstablishmentCode} 
        viewMode="grid" 
      />
    </div>
  );
}
