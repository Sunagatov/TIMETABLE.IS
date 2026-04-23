type View = "needs-review" | "failures" | "approved";

type Props = {
  view: View;
  onChange: (next: View) => void;
  onLoggedOut: () => void;
};

export function ReviewSidebar({ view, onChange, onLoggedOut }: Props) {
  return (
    <aside className="border-r border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Memora</h2>
      <p className="mt-1 text-sm text-slate-600">Review-first workspace</p>

      <nav className="mt-6 space-y-2">
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

      <div className="mt-8 rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold">Categories</h3>
        <p className="mt-2 text-sm text-slate-600">
          Feature-based sidebar placeholder. Real category tree and counts come in a later slice.
        </p>
      </div>

      <button
        type="button"
        className="mt-6 rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
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
  children: React.ReactNode;
}) {
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
