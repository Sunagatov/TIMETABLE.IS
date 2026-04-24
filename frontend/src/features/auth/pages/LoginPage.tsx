import { LoginForm } from "../components/LoginForm";

type Props = {
  onLoggedIn: () => void;
};

export function LoginPage({ onLoggedIn }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f0e8] p-5 text-stone-900">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-stone-200/60 bg-white shadow-[0_24px_64px_rgba(28,25,23,0.12)] lg:grid-cols-[1fr_0.9fr]">
        <section className="bg-[#111110] px-8 py-10 text-stone-100 lg:px-12 lg:py-14">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-base font-bold text-stone-950">
              M
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-200">Memora</p>
              <p className="text-xs text-stone-600">V1</p>
            </div>
          </div>

          <h1 className="mt-8 text-3xl font-semibold leading-snug text-stone-100">
            Review captured knowledge<br />before it becomes trusted.
          </h1>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            The backend remains the source of truth. This UI is the review, search, and edit shell
            for approved and unapproved items.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <FeatureCard
              color="amber"
              title="Needs Review"
              body="Default landing queue for human approval."
            />
            <FeatureCard
              color="red"
              title="Failures"
              body="Retryable processing issues with stage visibility."
            />
            <FeatureCard
              color="emerald"
              title="Approved"
              body="Search and edit only human-approved knowledge."
            />
          </div>
        </section>

        <section className="flex items-center px-8 py-10 lg:px-10 lg:py-14">
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-stone-950">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Use the backend-managed password to open the review workspace.
            </p>
            <LoginForm onLoggedIn={onLoggedIn} />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard(props: { color: "amber" | "red" | "emerald"; title: string; body: string }) {
  const dotClass =
    props.color === "amber"
      ? "bg-amber-500"
      : props.color === "red"
        ? "bg-red-500"
        : "bg-emerald-500";

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
        <p className="text-sm font-semibold text-stone-200">{props.title}</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-stone-500">{props.body}</p>
    </div>
  );
}
