import type { ReactNode } from "react";
import type { MemoraCategory } from "../types/reviewTypes";

type View = "needs-review" | "failures" | "approved";

type Props = {
  view: View;
  onChange: (next: View) => void;
  onLoggedOut: () => void;
  categories: MemoraCategory[];
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
};

export function ReviewSidebar({
  view,
  onChange,
  onLoggedOut,
  categories,
  selectedCategoryId,
  onCategoryChange
}: Props) {
  return (
    <aside className="flex h-screen flex-col border-r border-stone-200 bg-[#f6f1e8] p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Memora</p>
        <h2 className="mt-3 text-2xl font-semibold text-stone-900">Review-first workspace</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Backend-approved state drives what appears here. Default landing stays on Needs Review.
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        <SidebarButton active={view === "needs-review"} onClick={() => onChange("needs-review")}>
          Needs Review
        </SidebarButton>
        <SidebarButton active={view === "failures"} onClick={() => onChange("failures")}>
          Failures
        </SidebarButton>
        <SidebarButton active={view === "approved"} onClick={() => onChange("approved")}>
          Approved
        </SidebarButton>
      </nav>

      <div className="mt-8 flex-1 overflow-y-auto rounded-3xl border border-stone-200 bg-white/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Categories
          </h3>
          <button
            type="button"
            className="text-xs font-medium text-stone-600 hover:text-stone-900"
            onClick={() => onCategoryChange(null)}
          >
            Clear
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">No categories returned by backend yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {categories.map((category) => {
              const active = selectedCategoryId === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={
                    "block w-full rounded-2xl border px-4 py-3 text-left transition " +
                    (active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-400 hover:bg-white")
                  }
                  onClick={() => onCategoryChange(active ? null : category.id)}
                >
                  <p className="text-sm font-semibold">{category.path.category}</p>
                  <p className="mt-1 text-sm opacity-80">{category.path.subcategory}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-70">
                    {category.path.subsubcategory}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        className="mt-6 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 hover:bg-stone-100"
        onClick={onLoggedOut}
      >
        Logout
      </button>
    </aside>
  );
}

function SidebarButton(props: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={
        "w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition " +
        (props.active
          ? "bg-stone-900 text-white"
          : "border border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-100")
      }
    >
      {props.children}
    </button>
  );
}
