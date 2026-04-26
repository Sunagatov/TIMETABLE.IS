import { useState } from "react";
import type { ReactNode } from "react";
import { REVIEW_VIEW_META, REVIEW_VIEW_ORDER, type ReviewView } from "../reviewViewMeta";
import type { ItemType, MemoraItem } from "../types/reviewTypes";

type Props = {
  items: MemoraItem[];
  selectedItemId: string | null;
  onSelect: (itemId: string) => void;
  toolbar?: ReactNode;
  view: ReviewView;
  counts: {
    needsReview: number;
    failures: number;
    approved: number;
  };
  onViewChange: (next: ReviewView) => void;
  isLoading: boolean;
  errorMessage: string | null;
};

export function ReviewQueueList({
  items,
  selectedItemId,
  onSelect,
  toolbar,
  view,
  counts,
  onViewChange,
  isLoading,
  errorMessage
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const viewMeta = REVIEW_VIEW_META[view];

  return (
    <section className="flex h-full flex-col border-r border-stone-200 bg-[#faf8f4]">
      <header className="border-b border-stone-200 bg-white/88 px-4 py-4 backdrop-blur-sm lg:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xl font-semibold tracking-[-0.02em] text-stone-950">Memora</p>
            <p className="mt-1 text-sm text-stone-500">Private review workspace</p>
          </div>
          {toolbar ? (
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                filtersOpen
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50"
              }`}
            >
              <FilterIcon />
              <span>{filtersOpen ? "Hide filters" : "Filters"}</span>
            </button>
          ) : null}
        </div>
        <div className="mt-4 rounded-[1.35rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,239,232,0.96))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          <div className="grid grid-cols-3 gap-1.5">
            {REVIEW_VIEW_ORDER.map((reviewView) => (
              <ViewTab
                key={reviewView}
                view={reviewView}
                active={reviewView === view}
                count={countForView(reviewView, counts)}
                onClick={() => onViewChange(reviewView)}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${viewMeta.accentDotClass}`} />
          <p className="text-sm text-stone-500">{viewMeta.description}</p>
        </div>
      </header>

      {filtersOpen && toolbar ? (
        <div className="border-b border-stone-200 bg-white px-4 py-4 lg:px-5">
          {toolbar}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-3 lg:p-4">
        <QueueListState
          isLoading={isLoading}
          errorMessage={errorMessage}
          hasItems={items.length > 0}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <ReviewQueueItemCard
                key={item.id}
                item={item}
                selected={item.id === selectedItemId}
                view={view}
                onSelect={onSelect}
              />
            ))}
          </div>
        </QueueListState>
      </div>
      <footer className="border-t border-stone-200 bg-white/70 px-4 py-3 text-xs text-stone-400 lg:px-5">
        Memora
      </footer>
    </section>
  );
}

function ViewTab(props: {
  view: ReviewView;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  const meta = REVIEW_VIEW_META[props.view];

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`group relative flex min-h-[58px] flex-col justify-between overflow-hidden rounded-[1rem] border px-3 py-2.5 text-left transition ${
        props.active
          ? "border-white/90 bg-white text-stone-950 shadow-[0_12px_28px_rgba(28,25,23,0.10)]"
          : "border-transparent bg-transparent text-stone-600 hover:border-white/70 hover:bg-white/72 hover:text-stone-900"
      }`}
    >
      <span
        className={`absolute inset-x-3 top-0 h-[3px] rounded-full transition ${
          props.active ? meta.accentDotClass : "bg-transparent group-hover:bg-stone-200"
        }`}
      />
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold leading-tight">{shortViewLabel(props.view)}</p>
        </div>
        <span className={`h-2 w-2 rounded-full ${meta.accentDotClass}`} />
      </div>
      <div className="mt-2 flex items-center justify-end gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${props.active ? "bg-stone-100 text-stone-700" : meta.countClass}`}>
          {props.count}
        </span>
      </div>
    </button>
  );
}

function QueueListState(props: {
  isLoading: boolean;
  errorMessage: string | null;
  hasItems: boolean;
  children: ReactNode;
}) {
  if (props.isLoading) {
    return (
      <EmptyState>
        <LoadingDots />
        <p className="mt-3 text-sm text-stone-400">Loading items…</p>
      </EmptyState>
    );
  }

  if (props.errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {props.errorMessage}
      </div>
    );
  }

  if (!props.hasItems) {
    return (
      <EmptyState>
        <div className="text-2xl text-stone-300">∅</div>
        <p className="mt-2 text-sm text-stone-400">No items match the current filters.</p>
      </EmptyState>
    );
  }

  return props.children;
}

function typeAccentBorder(type: ItemType): string {
  switch (type) {
    case "IDEA": return "border-l-indigo-400";
    case "THOUGHT": return "border-l-amber-400";
    case "QUESTION": return "border-l-violet-500";
    case "REMINDER": return "border-l-sky-400";
    default: return "border-l-stone-300";
  }
}

function typeColorClass(type: ItemType): string {
  switch (type) {
    case "IDEA": return "text-indigo-500";
    case "THOUGHT": return "text-amber-500";
    case "QUESTION": return "text-violet-500";
    case "REMINDER": return "text-sky-500";
    default: return "text-stone-400";
  }
}

function humanType(type: ItemType): string {
  switch (type) {
    case "IDEA": return "Idea";
    case "THOUGHT": return "Thought";
    case "QUESTION": return "Question";
    case "REMINDER": return "Reminder";
    default: return type.replace(/_/g, " ");
  }
}

function ReviewQueueItemCard(props: {
  item: MemoraItem;
  selected: boolean;
  view: ReviewView;
  onSelect: (itemId: string) => void;
}) {
  const preview = props.item.cleanedText || props.item.rawTranscript || props.item.rawInputText || "No content";

  return (
    <button
      type="button"
      onClick={() => props.onSelect(props.item.id)}
      className={`block w-full rounded-[1.4rem] border border-stone-200 border-l-[3px] p-4 text-left transition ${
        typeAccentBorder(props.item.type)
      } ${
        props.selected
          ? "border-stone-900 border-l-current bg-stone-900 shadow-[0_14px_34px_rgba(28,25,23,0.18)]"
          : "bg-white shadow-[0_8px_24px_rgba(28,25,23,0.04)] hover:border-stone-300 hover:shadow-[0_12px_28px_rgba(28,25,23,0.08)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${props.selected ? "text-stone-500" : typeColorClass(props.item.type)}`}>
            {humanType(props.item.type)}
          </p>
          <h2 className={`mt-2 line-clamp-2 text-base font-semibold leading-snug ${props.selected ? "text-white" : "text-stone-950"}`}>
            {props.item.title || "Untitled"}
          </h2>
        </div>
        <span className={`shrink-0 text-[11px] font-medium ${props.selected ? "text-stone-400" : "text-stone-400"}`}>
          {formatRelativeDate(props.item.createdAt)}
        </span>
      </div>

      <p className={`mt-3 line-clamp-2 text-sm leading-6 ${props.selected ? "text-stone-300" : "text-stone-600"}`}>
        {preview}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <InfoPill selected={props.selected}>{props.item.categoryPath.category || "No category"}</InfoPill>
        {props.item.categoryPath.subcategory ? (
          <InfoPill selected={props.selected}>{props.item.categoryPath.subcategory}</InfoPill>
        ) : null}
        {props.view === "failures" && props.item.failureStage ? (
          <InfoPill selected={props.selected}>{props.item.failureStage.replace(/_/g, " ")}</InfoPill>
        ) : null}
      </div>
    </button>
  );
}

function InfoPill(props: { children: ReactNode; selected: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
      props.selected
        ? "bg-white/10 text-stone-200"
        : "bg-stone-100 text-stone-600"
    }`}>
      {props.children}
    </span>
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

function shortViewLabel(view: ReviewView): string {
  if (view === "needs-review") return "Needs Review";
  if (view === "failures") return "Failures";
  return "Approved";
}
function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white/60 p-10 text-center">
      {children}
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2.5 w-2.5 animate-pulse rounded-full bg-stone-300"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3.25H12" />
      <path d="M4.5 7H9.5" />
      <path d="M6 10.75H8" />
    </svg>
  );
}

function formatRelativeDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${Math.max(diffHours, 0)}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
