import React from "react";
import { useAuth } from "../../../auth/AuthProvider";
import { ReferentialsView } from "../../../components/ReferentialsView";
import { EstablishmentCode } from "../../../types";

export function EstablishmentReferentialsView() {
  const { user } = useAuth();

  if (!user || !user.establishmentCode) return <div>Accès non configuré</div>;

  return (
    <div className="p-6 max-w-[1700px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">Référentiels</h1>
      <ReferentialsView forcedEstablishmentCode={user.establishmentCode as EstablishmentCode} />
    </div>
  );
}
