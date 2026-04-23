import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { MainPage } from "./pages/MainPage";
import { fetchSession } from "./lib/api";

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetchSession()
      .then((state) => setAuthenticated(state.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) {
    return <div className="p-6 text-slate-700">Loading...</div>;
  }

  if (!authenticated) {
    return <LoginPage onLoggedIn={() => setAuthenticated(true)} />;
  }

  return <MainPage />;
}
