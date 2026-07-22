export interface AuthUser {
  id: string;
  role: "admin" | "establishment";
  establishmentId: string | null;
  establishmentCode: string | null;
  establishmentName: string | null;
  displayName: string;
}
