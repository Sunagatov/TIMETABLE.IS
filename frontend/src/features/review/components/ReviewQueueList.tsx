import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { REVIEW_VIEW_ORDER, type ReviewView } from "../reviewViewMeta";
import { REVIEW_LIST_SORT_OPTIONS } from "../reviewConstants";
import type { ItemType, MemoraItem } from "../types/reviewTypes";

type Props = {
  items: MemoraItem[];
  selectedItemId: string | null;
  onSelect: (itemId: string) => void;
  view: ReviewView;
  counts: {
    needsReview: number;
    failures: number;
    approved: number;
  };
  onViewChange: (next: ReviewView) => void;
  onLoggedOut?: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  searchValue: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  sortValue: string;
  onSortChange: (v: string) => void;
  categoryValue: string;
  onCategoryChange: (v: string) => void;
  categoryOptions: string[];
  renderDetail?: ReactNode;
  renderDesktopDetail?: ReactNode;
};

export function ReviewQueueList({
  items,
  selectedItemId,
  onSelect,
  view,
  counts,
  onViewChange,
  onLoggedOut,
  isLoading,
  errorMessage,
  searchValue,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  sortValue,
  onSortChange,
  categoryValue,
  onCategoryChange,
  categoryOptions,
  renderDetail,
  renderDesktopDetail,
}: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (expandedCardRef.current) {
      expandedCardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedItemId]);

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/92 backdrop-blur-sm">
        <div className="mx-auto max-w-[1480px] px-4 py-3 lg:px-6">

          {/* Title row */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold tracking-[-0.02em] text-stone-950">Memora</p>
              <p className="text-[11px] leading-none text-stone-400 mt-0.5">Private review workspace</p>
            </div>
            {onLoggedOut && (
              <button
                type="button"
                aria-label="Logout"
                onClick={onLoggedOut}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:border-stone-300 hover:text-stone-700"
              >
                <LogoutIcon />
              </button>
            )}
          </div>

          {/* View tabs */}
          <div className="mt-3 flex gap-1.5">
            {REVIEW_VIEW_ORDER.map((rv) => (
              <button
                key={rv}
                type="button"
                onClick={() => onViewChange(rv)}
                className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition ${
                  view === rv
                    ? "bg-stone-900 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
                }`}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${viewDotColor(rv)}`} />
                {shortViewLabel(rv)}
                <span className="tabular-nums text-xs opacity-60">
                  {countForView(rv, counts)}
                </span>
              </button>
            ))}
          </div>

          {/* Filter bar */}
          <div className="mt-3 rounded-[1.5rem] border border-stone-200 bg-white p-3 shadow-[0_1px_4px_rgba(28,25,23,0.04)]">
            <div className={`items-center gap-2 ${searchOpen ? "flex" : "hidden"} lg:flex`}>
              <label className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <SearchIcon />
                </span>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
                />
              </label>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => { setSearchOpen(false); onSearchChange(""); }}
                className="shrink-0 text-stone-400 transition hover:text-stone-700 lg:hidden"
              >
                <XIcon />
              </button>
            </div>

            <div className={`mt-2 grid gap-2 grid-cols-2 lg:grid-cols-3 ${searchOpen ? "border-t border-stone-100 pt-2" : ""}`}>
              {/* Mobile-only search toggle */}
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen((o) => !o)}
                className={`flex h-10 items-center justify-center rounded-xl border text-sm transition lg:hidden ${
                  searchOpen || searchValue
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-white"
                }`}
              >
                <SearchIcon />
              </button>
              <ToolbarSelect
                value={typeFilter}
                onChange={onTypeFilterChange}
                options={[
                  { value: "ALL", label: "All types" },
                  { value: "IDEA", label: "Idea" },
                  { value: "THOUGHT", label: "Thought" },
                  { value: "QUESTION", label: "Question" },
                  { value: "REMINDER", label: "Reminder" },
                  { value: "OTHER", label: "Other" }
                ]}
              />
              <ToolbarSelect
                value={categoryValue}
                onChange={onCategoryChange}
                options={[
                  { value: "", label: "All categories" },
                  ...categoryOptions.map((option) => ({ value: option, label: option }))
                ]}
              />
              <ToolbarSelect
                value={sortValue}
                onChange={onSortChange}
                options={REVIEW_LIST_SORT_OPTIONS}
              />
            </div>
          </div>

        </div>
      </header>

      <div className="mx-auto max-w-[1480px] px-3 pb-20 pt-5 lg:px-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,760px)_minmax(360px,1fr)] lg:gap-6 xl:grid-cols-[minmax(0,800px)_minmax(420px,560px)]">
          <div>
            <QueueListState isLoading={isLoading} errorMessage={errorMessage} hasItems={items.length > 0}>
              <div className="space-y-3">
                {items.map((item) => {
                  if (item.id === selectedItemId) {
                    return (
                      <div key={item.id}>
                        <div className="lg:hidden">
                          <div
                            ref={expandedCardRef}
                            className={`overflow-hidden rounded-[1.4rem] border border-stone-200 border-l-[3px] bg-white shadow-[0_4px_24px_rgba(28,25,23,0.10)] ${typeAccentBorder(item.type)}`}
                          >
                            {renderDetail}
                          </div>
                        </div>
                        <div className="hidden lg:block">
                          <ReviewQueueItemCard
                            item={item}
                            view={view}
                            selected
                            onSelect={onSelect}
                          />
                        </div>
                      </div>
                    );
                  }
                  return (
                    <ReviewQueueItemCard
                      key={item.id}
                      item={item}
                      view={view}
                      selected={false}
                      onSelect={onSelect}
                    />
                  );
                })}
              </div>
            </QueueListState>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[13.5rem] h-[calc(100vh-15rem)] overflow-hidden rounded-[1.8rem] border border-stone-200 bg-white shadow-[0_14px_36px_rgba(28,25,23,0.08)]">
              {renderDesktopDetail}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ToolbarSelect(props: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="relative">
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 pr-9 text-sm text-stone-700 outline-none transition focus:border-stone-400 focus:bg-white"
      >
        {props.options.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
        <ChevronDownIcon />
      </span>
    </div>
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

function viewDotColor(view: ReviewView): string {
  if (view === "needs-review") return "bg-amber-400";
  if (view === "failures") return "bg-red-500";
  return "bg-emerald-500";
}

function ReviewQueueItemCard(props: {
  item: MemoraItem;
  view: ReviewView;
  selected: boolean;
  onSelect: (itemId: string) => void;
}) {
  const preview = props.item.cleanedText || props.item.rawTranscript || props.item.rawInputText || "No content";

  return (
    <button
      type="button"
      onClick={() => props.onSelect(props.item.id)}
      className={`block w-full rounded-[1.4rem] border border-l-[3px] bg-white p-4 text-left transition ${typeAccentBorder(props.item.type)} ${
        props.selected
          ? "border-stone-900 shadow-[0_8px_24px_rgba(28,25,23,0.10)] ring-1 ring-stone-900/5"
          : "border-stone-200 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:border-stone-300 hover:shadow-[0_4px_16px_rgba(28,25,23,0.08)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${typeColorClass(props.item.type)}`}>
            {humanType(props.item.type)}
          </p>
          <h2 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug text-stone-950">
            {props.item.title || "Untitled"}
          </h2>
        </div>
        <span className="shrink-0 text-[11px] font-medium text-stone-400">
          {formatRelativeDate(props.item.createdAt)}
        </span>
      </div>

      <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-stone-500">
        {preview}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <InfoPill>{props.item.categoryPath.category || "No category"}</InfoPill>
        {props.item.categoryPath.subcategory ? (
          <InfoPill>{props.item.categoryPath.subcategory}</InfoPill>
        ) : null}
        {props.view === "failures" && props.item.failureStage ? (
          <InfoPill>{props.item.failureStage.replace(/_/g, " ")}</InfoPill>
        ) : null}
      </div>
    </button>
  );
}

function InfoPill(props: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
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
  if (view === "needs-review") return "Review";
  if (view === "failures") return "Failed";
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

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2.5H13a1 1 0 011 1v9a1 1 0 01-1 1H10" />
      <polyline points="7 11 10 8 7 5" />
      <line x1="10" y1="8" x2="2" y2="8" />
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
