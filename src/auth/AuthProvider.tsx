import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from "./auth.types";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (identifier: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    authService.getSession().then((session) => {
      if (isMounted) {
        setUser(session);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (identifier: string) => {
    const session = await authService.login(identifier);
    setUser(session);
    return session;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
