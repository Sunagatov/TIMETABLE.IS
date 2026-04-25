import { REVIEW_VIEW_META, REVIEW_VIEW_ORDER, type ReviewView } from "../../reviewViewMeta";

type Props = {
  view: ReviewView;
  counts: {
    needsReview: number;
    failures: number;
    approved: number;
  };
  onChange: (next: ReviewView) => void;
};

export function ReviewNavigation({ view, counts, onChange }: Props) {
  const icons: Record<ReviewView, React.ReactNode> = {
    "needs-review": <InboxIcon />,
    failures: <AlertIcon />,
    approved: <CheckIcon />
  };

  return (
    <nav className="space-y-0.5 px-3">
      {REVIEW_VIEW_ORDER.map((reviewView) => (
        <NavItem
          key={reviewView}
          active={view === reviewView}
          onClick={() => onChange(reviewView)}
          icon={icons[reviewView]}
          label={REVIEW_VIEW_META[reviewView].title}
          count={countForView(reviewView, counts)}
          countClass={REVIEW_VIEW_META[reviewView].navCountClass}
        />
      ))}
    </nav>
  );
}

function NavItem(props: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  countClass: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
        props.active ? "bg-white/10 text-stone-100" : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
      }`}
    >
      <span className={props.active ? "text-stone-200" : "text-stone-600"}>{props.icon}</span>
      <span className="flex-1 truncate">{props.label}</span>
      {props.count > 0 && (
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${props.countClass}`}>
          {props.count}
        </span>
      )}
    </button>
  );
}

function countForView(
  view: ReviewView,
  counts: { needsReview: number; failures: number; approved: number }
): number {
  if (view === "needs-review") return counts.needsReview;
  if (view === "failures") return counts.failures;
  return counts.approved;
}

function InboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10H6L7 12H9L10 10H14" />
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5L1.5 13.5H14.5L8 1.5Z" />
      <line x1="8" y1="6.5" x2="8" y2="9.5" />
      <circle cx="8" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <polyline points="5 8 7.5 10.5 11.5 6.5" />
    </svg>
  );
}
