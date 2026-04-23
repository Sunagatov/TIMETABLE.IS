import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApprovedItems, fetchFailures, fetchNeedsReview, logout } from "../lib/api";

type View = "needs-review" | "failures" | "approved";

export function MainPage() {
  const [view, setView] = useState<View>("needs-review");

  const needsReview = useQuery({
    queryKey: ["needs-review"],
    queryFn: fetchNeedsReview
  });

  const failures = useQuery({
    queryKey: ["failures"],
    queryFn: fetchFailures
  });

  const approved = useQuery({
    queryKey: ["approved"],
    queryFn: fetchApprovedItems
  });

  const currentItems =
    view === "needs-review"
      ? needsReview.data ?? []
      : view === "failures"
        ? failures.data ?? []
        : approved.data ?? [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Memora</h2>
          <p className="mt-1 text-sm text-slate-600">Review-first workspace</p>

          <nav className="mt-6 space-y-2">
            <NavButton active={view === "needs-review"} onClick={() => setView("needs-review")}>
              Needs Review
            </NavButton>
            <NavButton active={view === "failures"} onClick={() => setView("failures")}>
              Failures
            </NavButton>
            <NavButton active={view === "approved"} onClick={() => setView("approved")}>
              Approved
            </NavButton>
          </nav>

          <div className="mt-8 rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold">Categories</h3>
            <p className="mt-2 text-sm text-slate-600">
              Collapsible category tree with counts belongs here in the next slice.
            </p>
          </div>

          <button
            type="button"
            className="mt-6 rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
            onClick={() => logout().then(() => window.location.reload())}
          >
            Logout
          </button>
        </aside>

        <section className="p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">
              {view === "needs-review" ? "Needs Review" : view === "failures" ? "Failures" : "Approved"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              This starter UI is intentionally simple and aligned with the current requirements.
            </p>
          </header>

          <div className="mb-4 flex gap-3">
            <input
              type="text"
              placeholder="Search (UI placeholder)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <button className="rounded-xl border border-slate-300 px-4 py-2">Filters</button>
            <button className="rounded-xl border border-slate-300 px-4 py-2">Sort</button>
          </div>

          <div className="space-y-3">
            {currentItems.length === 0 ? (
              <EmptyState />
            ) : (
              currentItems.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-700">{item.cleanedText}</p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div>
                      <dt className="font-medium text-slate-800">Type</dt>
                      <dd>{item.type}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-800">Category</dt>
                      <dd>{item.category} / {item.subcategory} / {item.subsubcategory}</dd>
                    </div>
                  </dl>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function NavButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={
        "w-full rounded-xl px-4 py-2 text-left text-sm " +
        (props.active
          ? "bg-slate-900 text-white"
          : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100")
      }
    >
      {props.children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
      No items yet.
    </div>
  );
}
