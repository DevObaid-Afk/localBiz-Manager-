import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);
const STORAGE_KEY = "localbiz-auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { token: "", user: null };
  });
  const [loading, setLoading] = useState(Boolean(auth.token));

  useEffect(() => {
    if (auth.token) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth.token) {
      setLoading(false);
      return;
    }

    authService
      .me(auth.token)
      .then(({ user }) => {
        setAuth((current) => ({ ...current, user }));
      })
      .catch(() => {
        setAuth({ token: "", user: null });
      })
      .finally(() => setLoading(false));
  }, [auth.token]);

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      loading,
      saveAuth: (payload) => setAuth(payload),
      logout: () => setAuth({ token: "", user: null }),
    }),
    [auth, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
