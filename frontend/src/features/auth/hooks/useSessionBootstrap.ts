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

  useEffect(() => {
    const handleUnauthorized = () => setAuthenticated(false);

    window.addEventListener("memora:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("memora:unauthorized", handleUnauthorized);
  }, []);

  return {
    authenticated,
    loading,
    onLoggedIn: () => setAuthenticated(true),
    onLoggedOut: async () => {
      try {
        await logout();
      } catch {
        // A failed logout request should not trap the user in the workspace.
      } finally {
        setAuthenticated(false);
      }
    }
  };
}
