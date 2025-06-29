import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthUser } from "../../features/Auth/auth.service";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const data = localStorage.getItem("dinex:user-data");
    return data ? JSON.parse(data) : null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("dinex:user-data");
      setUser(data ? JSON.parse(data) : null);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = (user: AuthUser) => {
    localStorage.setItem("dinex:user-data", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("dinex:user-data");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
