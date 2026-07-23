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

  // FORCE set session just in case there's an issue with verifyOtp updating the global client
  await supabase.auth.setSession({
    access_token: authData.session.access_token,
    refresh_token: authData.session.refresh_token,
  });

  let contextResult = null;
  let contextError = null;
  let context = null;

  // Retry logic for fetching context
  for (let i = 0; i < 4; i++) {
    const { data, error } = await supabase.rpc(
      "get_current_user_context",
      {},
      {
        headers: {
          Authorization: `Bearer ${authData.session.access_token}`
        }
      } as any // Force headers if supported
    );
    
    if (error) {
      contextError = error;
      break; 
    }

    const ctx = Array.isArray(data) ? data[0] : data;
    if (ctx) {
      contextResult = data;
      context = ctx;
      break;
    }

    if (i < 3) {
      console.log(`[DEBUG] Context not found on attempt ${i + 1}, retrying in 1s...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Fallback to user metadata if RPC fails
  if (!context && authData?.user?.user_metadata?.role === 'establishment') {
    const meta = authData.user.user_metadata;
    context = {
      user_id: authData.user.id,
      role: meta.role,
      access_status: meta.access_status || 'active', // Default to active if missing in meta
      establishment_id: meta.establishment_id,
      establishment_code: meta.establishment_code || meta.establishmentCode,
      establishment_name: meta.establishment_name || meta.establishmentName,
      display_name: meta.display_name || meta.displayName || meta.establishment_name || meta.establishmentName,
    };
    console.log("[DEBUG] Using user_metadata as context fallback:", context);
  }

  if (contextError && !context) {
    await supabase.auth.signOut({
      scope: "local",
    });

    throw new Error(
      "Impossible de vérifier l’établissement connecté.",
    );
  }

  if (
    !context ||
    context.role !== "establishment" ||
    (context.access_status && context.access_status !== "active") ||
    !context.establishment_id
  ) {
    console.log("[DEBUG] Auth check failed. Context:", context, "Result:", contextResult, "UserID:", authData.user.id);
    await supabase.auth.signOut({
      scope: "local",
    });

    throw new Error(
      "Cet établissement n’est pas autorisé."
    );
  }

  return {
    id: context.user_id,
    userId: context.user_id,
    role: "establishment",
    establishmentId:
      context.establishment_id,
    establishmentCode:
      context.establishment_code || context.establishmentCode || "",
    establishmentName:
      context.establishment_name || context.establishmentName || "Établissement",
    displayName:
      context.display_name ||
      context.displayName ||
      context.establishment_name ||
      context.establishmentName ||
      "Établissement",
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
        let contextRows = null;
        for (let i = 0; i < 3; i++) {
          const { data } = await supabase.rpc(
            "get_current_user_context",
            {},
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            } as any
          );
          if (data && (Array.isArray(data) ? data.length > 0 : data)) {
            contextRows = data;
            break;
          }
          if (i < 2) await new Promise(resolve => setTimeout(resolve, 800));
        }

        let context = Array.isArray(contextRows) ? contextRows[0] : contextRows;
        
        // Fallback to user metadata
        if (!context && session.user?.user_metadata?.role === 'establishment') {
          const meta = session.user.user_metadata;
          context = {
            user_id: session.user.id,
            role: meta.role,
            access_status: meta.access_status || 'active',
            establishment_id: meta.establishment_id,
            establishment_code: meta.establishment_code || meta.establishmentCode,
            establishment_name: meta.establishment_name || meta.establishmentName,
            display_name: meta.display_name || meta.displayName || meta.establishment_name || meta.establishmentName,
          };
          console.log("[DEBUG] getSession: Using user_metadata as context fallback:", context);
        }

        if (
          context &&
          context.role === "establishment" &&
          (!context.access_status || context.access_status === "active") &&
          context.establishment_id
        ) {
          return {
            id: context.user_id,
            userId: context.user_id,
            role: "establishment",
            establishmentId: context.establishment_id,
            establishmentCode: context.establishment_code || context.establishmentCode || "",
            establishmentName: context.establishment_name || context.establishmentName || "Établissement",
            displayName: context.display_name || context.displayName || context.establishment_name || context.establishmentName || "Établissement",
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

