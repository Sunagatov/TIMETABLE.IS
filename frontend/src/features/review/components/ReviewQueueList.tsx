import { useState } from "react";
import type { ReactNode } from "react";
import { REVIEW_VIEW_META, type ReviewView } from "../reviewViewMeta";
import type { MemoraItem } from "../types/reviewTypes";

type Props = {
  title: string;
  description: string;
  items: MemoraItem[];
  selectedItemId: string | null;
  onSelect: (itemId: string) => void;
  toolbar?: ReactNode;
  view?: ReviewView;
  isLoading: boolean;
  errorMessage: string | null;
};

export function ReviewQueueList({
  title,
  description,
  items,
  selectedItemId,
  onSelect,
  toolbar,
  view,
  isLoading,
  errorMessage
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const viewMeta = view ? REVIEW_VIEW_META[view] : null;
  const countClass = items.length > 0 && viewMeta ? viewMeta.countClass : "bg-stone-100 text-stone-500";

  return (
    <section className="flex h-full flex-col border-r border-stone-200 bg-[#faf8f4]">
      <header className="border-b border-stone-200 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {viewMeta && <span className={`h-2 w-2 shrink-0 rounded-full ${viewMeta.accentDotClass}`} />}
            <h1 className="truncate text-sm font-semibold text-stone-900">{title}</h1>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${countClass}`}>
              {items.length}
            </span>
          </div>
          {toolbar ? (
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className={`shrink-0 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                filtersOpen
                  ? "border-stone-400 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50"
              }`}
            >
              <FilterIcon />
              <span>Filters</span>
            </button>
          ) : null}
        </div>
        <p className="mt-1 text-xs leading-5 text-stone-400">{description}</p>
      </header>

      {filtersOpen && toolbar ? (
        <div className="border-b border-stone-200 bg-white px-5 py-4">
          {toolbar}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-3">
        <QueueListState
          isLoading={isLoading}
          errorMessage={errorMessage}
          hasItems={items.length > 0}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <ReviewQueueItemCard
                key={item.id}
                item={item}
                selected={item.id === selectedItemId}
                view={view}
                accentBorderClass={viewMeta?.accentBorderClass}
                onSelect={onSelect}
              />
            ))}
          </div>
        </QueueListState>
      </div>
    </section>
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

function ReviewQueueItemCard(props: {
  item: MemoraItem;
  selected: boolean;
  view?: ReviewView;
  accentBorderClass?: string;
  onSelect: (itemId: string) => void;
}) {
  const preview = props.item.cleanedText || props.item.rawTranscript || props.item.rawInputText || "No content";

  return (
    <button
      type="button"
      onClick={() => props.onSelect(props.item.id)}
      className={`block w-full rounded-2xl border border-stone-200 border-l-[3px] p-4 text-left transition ${
        props.accentBorderClass ?? ""
      } ${
        props.selected
          ? "border-stone-900 border-l-current bg-stone-900 shadow-sm"
          : "bg-white hover:border-stone-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
          {props.item.sourceType.replace(/_/g, " ")}
        </p>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          <StatusBadge status={props.item.status} selected={props.selected} />
          {props.view === "failures" && props.item.failureStage ? (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${failureBadgeClass(props.selected)}`}>
              {props.item.failureStage.replace(/_/g, " ")}
            </span>
          ) : null}
          {isQuestion(props.item) ? (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${questionBadgeClass(props.selected)}`}>
              Q
            </span>
          ) : null}
          {props.item.proposedCategoryStatus === "PENDING_REVIEW" ? (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryBadgeClass(props.selected)}`}>
              Cat
            </span>
          ) : null}
        </div>
      </div>

      <h2 className={`mt-2 line-clamp-2 text-sm font-semibold leading-snug ${props.selected ? "text-white" : "text-stone-900"}`}>
        {props.item.title || "Untitled"}
      </h2>

      <p className={`mt-1.5 line-clamp-2 text-xs leading-5 ${props.selected ? "text-stone-300" : "text-stone-500"}`}>
        {preview}
      </p>

      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-stone-400">
        <span className="max-w-[100px] truncate">{props.item.categoryPath.category || "—"}</span>
        <span className="text-stone-500">·</span>
        <span>{props.item.priority === "NOT_APPLICABLE" ? "—" : priorityShort(props.item.priority)}</span>
        <span className="text-stone-500">·</span>
        <span className="ml-auto shrink-0">{formatRelativeDate(props.item.createdAt)}</span>
      </div>
    </button>
  );
}

function StatusBadge({ status, selected }: { status: string; selected: boolean }) {
  const colorClass = selected
    ? "bg-white/15 text-stone-200"
    : status.includes("APPROVED")
      ? "bg-emerald-50 text-emerald-700"
      : status.includes("FAILED")
        ? "bg-red-50 text-red-700"
        : status.includes("PENDING")
          ? "bg-amber-50 text-amber-700"
          : "bg-stone-100 text-stone-600";

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${colorClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
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
          className="h-1.5 w-1.5 rounded-full bg-stone-300 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1.5 2.5h10M3.5 6.5h6M5.5 10.5h2" />
    </svg>
  );
}

function priorityShort(priority: string): string {
  if (priority === "URGENT_IMPORTANT") return "Urgent";
  if (priority === "URGENT_NOT_IMPORTANT") return "U/NI";
  if (priority === "NOT_URGENT_IMPORTANT") return "Imp.";
  if (priority === "NOT_URGENT_NOT_IMPORTANT") return "Low";
  return priority;
}

function formatRelativeDate(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(iso));
}

function isQuestion(item: MemoraItem): boolean {
  return item.type === "QUESTION" || item.aiType === "QUESTION";
}

function failureBadgeClass(selected: boolean): string {
  return selected ? "bg-red-400/30 text-red-200" : "bg-red-50 text-red-600";
}

function questionBadgeClass(selected: boolean): string {
  return selected ? "bg-amber-400/20 text-amber-200" : "bg-amber-50 text-amber-700";
}

function categoryBadgeClass(selected: boolean): string {
  return selected ? "bg-indigo-400/20 text-indigo-200" : "bg-indigo-50 text-indigo-600";
}
