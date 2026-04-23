import { useEffect, useState } from "react";
import { fetchSession, logout } from "../api/authApi";

export function useSessionBootstrap() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession()
      .then((state) => setAuthenticated(state.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  return {
    authenticated,
    loading,
    onLoggedIn: () => setAuthenticated(true),
    onLoggedOut: async () => {
      await logout();
      setAuthenticated(false);
    }
  };
}
