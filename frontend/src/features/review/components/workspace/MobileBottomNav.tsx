import type { MobilePanel } from "../../hooks/useReviewWorkspaceState";

type Props = {
  panel: MobilePanel;
  title: string;
  activeCount: number;
  hasSelectedItem: boolean;
  onChange: (panel: MobilePanel) => void;
};

export function MobileBottomNav({ panel, title, activeCount, hasSelectedItem, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch border-t border-stone-200/80 bg-white/96 shadow-[0_-1px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm lg:hidden">
      <MobileNavTab active={panel === "sidebar"} onClick={() => onChange("sidebar")}>
        <MenuIcon />
        <span>Tools</span>
      </MobileNavTab>
      <MobileNavTab active={panel === "list"} onClick={() => onChange("list")}>
        <ListIcon />
        <span>{title}{activeCount > 0 ? ` · ${activeCount}` : ""}</span>
      </MobileNavTab>
      <MobileNavTab active={panel === "detail"} onClick={() => { if (hasSelectedItem) onChange("detail"); }} disabled={!hasSelectedItem}>
        <DetailIcon />
        <span>Detail</span>
      </MobileNavTab>
    </nav>
  );
}

function MobileNavTab(props: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-medium transition ${
        props.active
          ? "text-amber-600"
          : props.disabled
            ? "cursor-default text-stone-300"
            : "text-stone-500 hover:text-stone-800"
      }`}
    >
      {props.children}
    </button>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="3" y1="5" x2="17" y2="5" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="15" x2="17" y2="15" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="4" width="14" height="3" rx="1" />
      <rect x="3" y="9" width="14" height="3" rx="1" />
      <rect x="3" y="14" width="14" height="3" rx="1" />
    </svg>
  );
}

function DetailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <line x1="7" y1="8" x2="13" y2="8" />
      <line x1="7" y1="11" x2="13" y2="11" />
      <line x1="7" y1="14" x2="10" y2="14" />
    </svg>
  );
}
