import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { REVIEW_VIEW_META, REVIEW_VIEW_ORDER, type ReviewView } from "../reviewViewMeta";
import { REVIEW_LIST_SORT_OPTIONS } from "../reviewConstants";
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
  searchValue: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  sortValue: string;
  onSortChange: (v: string) => void;
  hasSecondaryFilters: boolean;
};

const TYPE_CHIP_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "IDEA", label: "Idea" },
  { value: "THOUGHT", label: "Thought" },
  { value: "QUESTION", label: "Question" },
  { value: "REMINDER", label: "Reminder" },
  { value: "OTHER", label: "Other" },
] as const;

export function ReviewQueueList({
  items,
  selectedItemId,
  onSelect,
  toolbar,
  view,
  counts,
  onViewChange,
  isLoading,
  errorMessage,
  searchValue,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  sortValue,
  onSortChange,
  hasSecondaryFilters,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const viewMeta = REVIEW_VIEW_META[view];

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  return (
    <section className="flex h-full flex-col border-r border-stone-200 bg-[#faf8f4]">
      <header className="border-b border-stone-200 bg-white/88 px-4 py-4 backdrop-blur-sm lg:px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xl font-semibold tracking-[-0.02em] text-stone-950">Memora</p>
            <p className="mt-1 text-sm text-stone-500">Private review workspace</p>
          </div>
          {toolbar ? (
            <button
              type="button"
              aria-label={filtersOpen ? "Hide filters" : "More filters"}
              onClick={() => setFiltersOpen((o) => !o)}
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                filtersOpen
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50"
              }`}
            >
              <MenuIcon />
              {hasSecondaryFilters && !filtersOpen && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>
          ) : null}
        </div>

        <div className="mt-3 rounded-xl border border-stone-200 bg-stone-100/80 p-1">
          <div className="grid grid-cols-3 gap-0.5">
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

        <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_1px_4px_rgba(28,25,23,0.04)]">
          {/* Search row: always on desktop; on mobile only when searchOpen */}
          <div className={`items-center gap-2 px-3.5 py-2.5 ${searchOpen ? "flex" : "hidden"} lg:flex`}>
            <span className="shrink-0 text-stone-400"><SearchIcon /></span>
            <input
              ref={searchInputRef}
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
            />
            {/* Close button — mobile only */}
            <button
              type="button"
              aria-label="Close search"
              onClick={() => { setSearchOpen(false); onSearchChange(""); }}
              className="shrink-0 text-stone-400 transition hover:text-stone-700 lg:hidden"
            >
              <XIcon />
            </button>
            {/* Sort — desktop only (on mobile it lives in the chips row) */}
            <div className="relative hidden shrink-0 lg:block">
              <select
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none cursor-pointer rounded-lg border border-stone-200 bg-stone-50 py-1 pl-2 pr-5 text-[11px] font-semibold text-stone-600 outline-none transition hover:bg-stone-100"
              >
                {REVIEW_LIST_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Chips row — always visible */}
          <div className={`flex items-center gap-2 px-3 pb-3 pt-2.5 ${searchOpen ? "border-t border-stone-100" : "lg:border-t lg:border-stone-100"}`}>
            {/* Search toggle — mobile only */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((o) => !o)}
              className={`shrink-0 rounded-full border p-1.5 transition lg:hidden ${
                searchOpen || searchValue
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <SearchIcon />
            </button>
            <div
              className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {TYPE_CHIP_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => onTypeFilterChange(opt.value)}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                    typeFilter === opt.value
                      ? typeChipActiveClass(opt.value)
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Sort — mobile only (on desktop it lives in the search row) */}
            <div className="relative shrink-0 lg:hidden">
              <select
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none cursor-pointer rounded-lg border border-stone-200 bg-stone-50 py-1 pl-2 pr-5 text-[11px] font-semibold text-stone-600 outline-none transition hover:bg-stone-100"
              >
                {REVIEW_LIST_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${viewMeta.accentDotClass}`} />
          <p className="text-xs text-stone-400">{viewMeta.description}</p>
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

function typeChipActiveClass(value: string): string {
  switch (value) {
    case "IDEA": return "bg-indigo-500 text-white border-indigo-500";
    case "THOUGHT": return "bg-amber-500 text-stone-950 border-amber-500";
    case "QUESTION": return "bg-violet-500 text-white border-violet-500";
    case "REMINDER": return "bg-sky-500 text-white border-sky-500";
    case "OTHER": return "bg-stone-500 text-white border-stone-500";
    default: return "bg-stone-900 text-white border-stone-900";
  }
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
      className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
        props.active
          ? "bg-white text-stone-900 shadow-sm"
          : "text-stone-500 hover:text-stone-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.accentDotClass}`} />
      <span className="truncate">{shortViewLabel(props.view)}</span>
      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
        props.active ? "bg-stone-100 text-stone-600" : "bg-stone-200/70 text-stone-500"
      }`}>
        {props.count}
      </span>
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

function MenuIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 4h11M2 7.5h11M2 11h11" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6.25" cy="6.25" r="4.25" />
      <path d="m9.5 9.5 2.75 2.75" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 2l10 10M12 2 2 12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 3.5 5 6.5 8 3.5" />
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
