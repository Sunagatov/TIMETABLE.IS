import { LoginPage } from "../features/auth/pages/LoginPage";
import { useSessionBootstrap } from "../features/auth/hooks/useSessionBootstrap";
import { ReviewWorkspacePage } from "../features/review/pages/ReviewWorkspacePage";

export default function App() {
  const { authenticated, loading, onLoggedIn, onLoggedOut } = useSessionBootstrap();

  if (loading) {
    return <div className="p-6 text-slate-700">Loading...</div>;
  }

  if (!authenticated) {
    return <LoginPage onLoggedIn={onLoggedIn} />;
  }

  return <ReviewWorkspacePage onLoggedOut={onLoggedOut} />;
}
