import { LoginForm } from "../components/LoginForm";

type Props = {
  onLoggedIn: () => void;
};

export function LoginPage({ onLoggedIn }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Memora</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to review and manage your captured items.
        </p>

        <LoginForm onLoggedIn={onLoggedIn} />
      </div>
    </main>
  );
}
