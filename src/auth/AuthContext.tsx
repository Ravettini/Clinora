import { createContext, useContext, useState, type ReactNode } from "react";
import {
  authenticate,
  clearSession,
  readSession,
  writeSession,
  type Session,
} from "./tenants";

interface AuthContextValue {
  session: Session | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession());

  const login = (username: string, password: string): boolean => {
    const user = authenticate(username, password);
    if (!user) return false;
    const next: Session = { username: user.username, tenant: user.tenant };
    writeSession(next);
    setSession(next);
    // Recargamos para que todos los módulos de datos resuelvan el tenant nuevo.
    window.location.assign("/");
    return true;
  };

  const logout = () => {
    clearSession();
    setSession(null);
    window.location.assign("/login");
  };

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
