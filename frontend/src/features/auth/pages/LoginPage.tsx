import { LoginForm } from "../components/LoginForm";

type Props = {
  onLoggedIn: () => void;
};

export function LoginPage({ onLoggedIn }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.18),_transparent_36%),linear-gradient(180deg,_#f7f2e8_0%,_#efe8dc_100%)] p-6 text-stone-900">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_30px_80px_rgba(68,64,60,0.14)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="bg-stone-900 px-8 py-10 text-stone-100 lg:px-12 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">
            Memora V1
          </p>
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
            Review captured knowledge before it becomes trusted.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-stone-300">
            The backend remains the source of truth. This UI is the review, search, and edit shell
            for approved and unapproved items.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <FeatureCard title="Needs Review" body="Default landing queue for human approval." />
            <FeatureCard title="Failures" body="Retryable processing issues with stage visibility." />
            <FeatureCard title="Approved" body="Search and edit only human-approved knowledge." />
          </div>
        </section>

        <section className="flex items-center px-8 py-10 lg:px-12 lg:py-14">
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-stone-950">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Use the backend-managed password to open the Memora review workspace.
            </p>

            <LoginForm onLoggedIn={onLoggedIn} />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard(props: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold">{props.title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-300">{props.body}</p>
    </div>
  );
}
