import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: number;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "yatrasathi_auth";

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { accessToken: null, refreshToken: null, user: null };
}

function saveAuth(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadAuth);

  const login = useCallback(async (email: string, password: string) => {
    const body = new URLSearchParams({ username: email, password });
    const response = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const detail = err.detail;
      const message =
        typeof detail === "string" ? detail
        : Array.isArray(detail) ? detail.map((d: { msg?: string }) => d.msg).join(", ")
        : "Invalid credentials";
      throw new Error(message);
    }

    const data = await response.json();
    const next: AuthState = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      user: data.user,
    };
    saveAuth(next);
    setAuth(next);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth({ accessToken: null, refreshToken: null, user: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        isLoggedIn: !!auth.accessToken,
        isAdmin: auth.user?.is_admin === 1,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
