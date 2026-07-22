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

class AuthService {
  private readonly SESSION_KEY = "ddestfp_auth_session";

  async loginEstablishment(rawIdentifier: string): Promise<AuthUser> {
    const identifier = rawIdentifier.trim().toUpperCase();

    if (!identifier) {
      throw new Error("L’identifiant de connexion est obligatoire.");
    }

    const { data, error } = await supabase.functions.invoke("establishment-login", {
      body: { identifier },
    });

    if (error || !data?.access_token || !data?.refresh_token) {
      throw new Error("Identifiant incorrect ou non reconnu.");
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    if (sessionError) {
      throw new Error("Impossible d’ouvrir la session de l’établissement.");
    }

    const { data: contextRows, error: contextError } = await supabase.rpc("get_current_user_context");

    const context = contextRows?.[0];

    if (
      contextError ||
      !context ||
      context.role !== "establishment" ||
      context.access_status !== "active" ||
      !context.establishment_id
    ) {
      await supabase.auth.signOut();
      
      if (context && context.access_status === "suspended") {
        throw new Error("L’accès de cet établissement est actuellement suspendu. Contactez l’administrateur.");
      }
      
      throw new Error("Cet établissement n’est pas autorisé à accéder à la plateforme.");
    }

    const user: AuthUser = {
      id: context.user_id,
      role: "establishment",
      establishmentId: context.establishment_id,
      establishmentCode: context.establishment_code,
      establishmentName: context.establishment_name,
      displayName: context.display_name || context.establishment_name,
    };
    
    // We only use the local session fallback for admin, but we keep this aligned if needed 
    // Wait, the prompt said: "Le frontend doit seulement conserver la session sécurisée retournée par Supabase."
    // So we don't save the establishment user to local storage.
    
    return user;
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
        const context = contextRows?.[0];
        
        if (context && context.role === "establishment" && context.access_status === "active") {
          return {
            id: context.user_id,
            role: "establishment",
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
