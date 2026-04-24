import { LoginPage } from "../features/auth/pages/LoginPage";
import { useSessionBootstrap } from "../features/auth/hooks/useSessionBootstrap";
import { ReviewWorkspacePage } from "../features/review/pages/ReviewWorkspacePage";

export default function App() {
  const { authenticated, loading, onLoggedIn, onLoggedOut } = useSessionBootstrap();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4efe6] p-6 text-stone-700">
        Loading Memora...
      </div>
    );
  }

  if (!authenticated) {
    return <LoginPage onLoggedIn={onLoggedIn} />;
  }

  return <ReviewWorkspacePage onLoggedOut={onLoggedOut} />;
}
