import { AuthUser } from "../auth/auth.types";
import { supabase } from "../lib/supabase";

// Simple mock for admin since we still need it
const ADMIN_USER: AuthUser = {
  id: "admin_1",
  role: "admin",
  establishmentId: null,
  establishmentCode: null,
  establishmentName: null,
  displayName: "Administrateur Général",
};

export async function loginEstablishment(
  rawIdentifier: string,
): Promise<AuthUser> {
  const identifier = rawIdentifier.trim().toUpperCase();

  if (!/^[A-Z0-9]{7}$/.test(identifier)) {
    throw new Error("L’identifiant doit contenir exactement 7 caractères.");
  }

  const { data, error } = await supabase.functions.invoke("establishment-login", {
    body: {
      identifier,
    },
  });

  if (error) {
    console.error("Erreur Edge Function :", error);
    throw new Error("La connexion n’a pas pu être établie.");
  }

  if (!data?.access_token || !data?.refresh_token) {
    throw new Error(data?.error || "Identifiant incorrect ou non reconnu.");
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  if (sessionError) {
    console.error("Erreur setSession :", sessionError);
    throw new Error("Impossible d’ouvrir la session sécurisée.");
  }

  const { data: contextRows, error: contextError } = await supabase.rpc("get_current_user_context");

  if (contextError) {
    await supabase.auth.signOut();
    console.error("Erreur contexte utilisateur :", contextError);
    throw new Error("Impossible de vérifier les autorisations.");
  }

  const context = Array.isArray(contextRows) ? contextRows[0] : contextRows;

  if (
    !context ||
    context.role !== "establishment" ||
    context.access_status !== "active" ||
    !context.establishment_id
  ) {
    await supabase.auth.signOut();
    throw new Error("Cet établissement n’est pas autorisé.");
  }

  return {
    id: context.user_id,
    role: "establishment" as const,
    accessStatus: context.access_status,
    establishmentId: context.establishment_id,
    establishmentCode: context.establishment_code,
    establishmentName: context.establishment_name,
    displayName: context.display_name || context.establishment_name,
  };
}

class AuthService {
  private readonly SESSION_KEY = "ddestfp_auth_session";

  async loginEstablishment(rawIdentifier: string): Promise<AuthUser> {
    return loginEstablishment(rawIdentifier);
  }

  async loginAdmin(email: string, password: string): Promise<AuthUser> {
    // In a real app, this would also use Supabase Auth with email/password
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay

    if (email === "admin@ddestfp.bj" && password === "admin") {
      this.saveSession(ADMIN_USER);
      return ADMIN_USER;
    }

    throw new Error("Identifiants administrateur incorrects.");
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.removeItem(this.SESSION_KEY);
  }

  async getSession(): Promise<AuthUser | null> {
    // Try to get Supabase session first (for establishment)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      try {
        const { data: contextRows } = await supabase.rpc("get_current_user_context");
        const context = Array.isArray(contextRows) ? contextRows[0] : contextRows;
        
        if (context && context.role === "establishment" && context.access_status === "active") {
          return {
            id: context.user_id,
            role: "establishment",
            accessStatus: context.access_status,
            establishmentId: context.establishment_id,
            establishmentCode: context.establishment_code,
            establishmentName: context.establishment_name,
            displayName: context.display_name || context.establishment_name,
          };
        } else {
          await supabase.auth.signOut();
        }
      } catch (e) {
        console.error("Failed to restore supabase session context", e);
      }
    }

    // Fallback to local storage (for admin mock only)
    const data = localStorage.getItem(this.SESSION_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data) as AuthUser;
        if (parsed.role === "admin") {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private saveSession(user: AuthUser) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  }
}

export const authService = new AuthService();

