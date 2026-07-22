import { AuthUser } from "../auth/auth.types";
import { ESTABLISHMENTS } from "../data/establishments";

// Simple mock for now
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

  async login(identifier: string): Promise<AuthUser> {
    // In a real app, this would call an API (e.g., Supabase)
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

    const normalizedIdentifier = identifier.trim().toUpperCase();

    // Admin backdoor for demo purposes
    if (normalizedIdentifier === "ADMIN") {
      this.saveSession(ADMIN_USER);
      return ADMIN_USER;
    }

    const est = ESTABLISHMENTS.find((e) => e.code.toUpperCase() === normalizedIdentifier);
    
    if (est) {
      // Simulate checking if the establishment is suspended (mock)
      if ((est.code as string) === "SUSPENDU") {
        throw new Error("L’accès de cet établissement est actuellement suspendu. Contactez l’administrateur.");
      }

      const user: AuthUser = {
        id: `user_${est.code}`,
        role: "establishment",
        establishmentId: est.code, // using code as ID for now
        establishmentCode: est.code,
        establishmentName: est.label,
        displayName: est.label,
      };
      this.saveSession(user);
      return user;
    }

    throw new Error("Identifiant incorrect ou non reconnu.");
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem(this.SESSION_KEY);
  }

  async getSession(): Promise<AuthUser | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const data = localStorage.getItem(this.SESSION_KEY);
    if (data) {
      try {
        return JSON.parse(data) as AuthUser;
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
