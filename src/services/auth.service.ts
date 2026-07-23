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

export interface EstablishmentSession extends AuthUser {
  userId: string;
  role: "establishment";
  establishmentId: string;
  establishmentCode: string;
  establishmentName: string;
  displayName: string;
}

export async function loginEstablishment(
  rawIdentifier: string,
): Promise<EstablishmentSession> {
  const identifier = rawIdentifier
    .trim()
    .toUpperCase();

  if (!/^[A-Z0-9]{7}$/.test(identifier)) {
    throw new Error(
      "L’identifiant doit contenir exactement 7 caractères.",
    );
  }

  const {
    data,
    error,
  } = await supabase.functions.invoke(
    "establishment-login",
    {
      body: {
        identifier,
      },
    },
  );

  if (error) {
    let message =
      "Identifiant incorrect ou non reconnu.";

    const response = (
      error as {
        context?: unknown;
      }
    ).context;

    if (response instanceof Response) {
      try {
        const payload =
          await response.clone().json();

        if (
          typeof payload?.error === "string"
        ) {
          message = payload.error;
        }
      } catch {
        // Conserver le message par défaut.
      }
    }

    throw new Error(message);
  }

  const tokenHash = data?.token_hash;

  if (
    typeof tokenHash !== "string" ||
    !tokenHash
  ) {
    throw new Error(
      "Le serveur n’a pas retourné de jeton de connexion.",
    );
  }

  /*
   * Création directe de la session dans
   * le navigateur.
   *
   * Ne plus utiliser setSession().
   */
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });

  if (
    authError ||
    !authData.session ||
    !authData.user
  ) {
    console.error(
      "Erreur verifyOtp établissement :",
      authError,
    );

    throw new Error(
      "Impossible d’ouvrir la session sécurisée.",
    );
  }

  const {
    data: contextResult,
    error: contextError,
  } = await supabase.rpc(
    "get_current_user_context",
  );

  if (contextError) {
    await supabase.auth.signOut({
      scope: "local",
    });

    throw new Error(
      "Impossible de vérifier l’établissement connecté.",
    );
  }

  const context =
    Array.isArray(contextResult)
      ? contextResult[0]
      : contextResult;

  if (
    !context ||
    context.role !== "establishment" ||
    context.access_status !== "active" ||
    !context.establishment_id ||
    !context.establishment_code ||
    !context.establishment_name
  ) {
    await supabase.auth.signOut({
      scope: "local",
    });

    throw new Error(
      "Cet établissement n’est pas autorisé.",
    );
  }

  return {
    id: context.user_id,
    userId: context.user_id,
    role: "establishment",
    establishmentId:
      context.establishment_id,
    establishmentCode:
      context.establishment_code,
    establishmentName:
      context.establishment_name,
    displayName:
      context.display_name ||
      context.establishment_name,
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
    await supabase.auth.signOut({ scope: "local" });
    localStorage.removeItem(this.SESSION_KEY);
  }

  async getSession(): Promise<AuthUser | null> {
    // Try to get Supabase session first (for establishment)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      try {
        const { data: contextRows } = await supabase.rpc("get_current_user_context");
        const context = Array.isArray(contextRows) ? contextRows[0] : contextRows;
        
        if (
          context &&
          context.role === "establishment" &&
          context.access_status === "active" &&
          context.establishment_id &&
          context.establishment_code &&
          context.establishment_name
        ) {
          return {
            id: context.user_id,
            userId: context.user_id,
            role: "establishment",
            establishmentId: context.establishment_id,
            establishmentCode: context.establishment_code,
            establishmentName: context.establishment_name,
            displayName: context.display_name || context.establishment_name,
          };
        } else {
          await supabase.auth.signOut({ scope: "local" });
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

