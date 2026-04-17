import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("guessit-token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/api/profile/me")
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("guessit-token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      async login(credentials) {
        const data = await api.post("/api/auth/login", credentials);
        localStorage.setItem("guessit-token", data.token);
        setUser(data.user);
        return data;
      },
      async signup(payload) {
        const data = await api.post("/api/auth/signup", payload);
        localStorage.setItem("guessit-token", data.token);
        setUser(data.user);
        return data;
      },
      logout() {
        localStorage.removeItem("guessit-token");
        setUser(null);
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
