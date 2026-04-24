import { useState } from "react";
import type { ReactNode } from "react";
import type { MemoraItem } from "../types/reviewTypes";

type View = "needs-review" | "failures" | "approved";

type Props = {
  title: string;
  description: string;
  items: MemoraItem[];
  selectedItemId: string | null;
  onSelect: (itemId: string) => void;
  toolbar?: ReactNode;
  view?: View;
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

  const accentBorder =
    view === "needs-review"
      ? "border-l-amber-400"
      : view === "failures"
        ? "border-l-red-400"
        : "border-l-emerald-400";

  const accentBg =
    view === "needs-review"
      ? "bg-amber-500"
      : view === "failures"
        ? "bg-red-500"
        : "bg-emerald-500";

  return (
    <section className="flex h-full flex-col border-r border-stone-200 bg-[#faf8f4]">
      {/* Header */}
      <header className="border-b border-stone-200 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`h-2 w-2 shrink-0 rounded-full ${accentBg}`} />
            <h1 className="truncate text-base font-semibold text-stone-900">{title}</h1>
            {items.length > 0 && (
              <span className="shrink-0 rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-600">
                {items.length}
              </span>
            )}
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
        <p className="mt-1 text-xs leading-5 text-stone-500">{description}</p>
      </header>

      {/* Collapsible filters */}
      {filtersOpen && toolbar ? (
        <div className="border-b border-stone-200 bg-white px-5 py-4">
          {toolbar}
        </div>
      ) : null}

      {/* Item list */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <EmptyState>
            <LoadingDots />
            <p className="mt-3 text-sm text-stone-400">Loading items…</p>
          </EmptyState>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            {errorMessage}
          </div>
        ) : items.length === 0 ? (
          <EmptyState>
            <div className="text-2xl text-stone-300">∅</div>
            <p className="mt-2 text-sm text-stone-400">No items match the current filters.</p>
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const selected = item.id === selectedItemId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`block w-full rounded-2xl border-l-[3px] border border-stone-200 p-4 text-left transition ${accentBorder} ${
                    selected
                      ? "bg-stone-900 border-stone-900 border-l-current shadow-sm"
                      : "bg-white hover:border-stone-300 hover:shadow-sm"
                  }`}
                >
                  {/* Top row: type label + badges */}
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        selected ? "text-stone-400" : "text-stone-400"
                      }`}
                    >
                      {item.sourceType.replace(/_/g, " ")}
                    </p>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                      <StatusBadge status={item.status} selected={selected} />
                      {view === "failures" && item.failureStage ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          selected ? "bg-red-400/30 text-red-200" : "bg-red-50 text-red-600"
                        }`}>
                          {item.failureStage.replace(/_/g, " ")}
                        </span>
                      ) : null}
                      {item.type === "QUESTION" || item.aiType === "QUESTION" ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          selected ? "bg-amber-400/20 text-amber-200" : "bg-amber-50 text-amber-700"
                        }`}>
                          Q
                        </span>
                      ) : null}
                      {item.proposedCategoryStatus === "PENDING_REVIEW" ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          selected ? "bg-indigo-400/20 text-indigo-200" : "bg-indigo-50 text-indigo-600"
                        }`}>
                          Cat
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className={`mt-2 text-sm font-semibold leading-snug line-clamp-2 ${
                    selected ? "text-white" : "text-stone-900"
                  }`}>
                    {item.title || "Untitled"}
                  </h2>

                  {/* Preview */}
                  <p className={`mt-1.5 line-clamp-2 text-xs leading-5 ${
                    selected ? "text-stone-300" : "text-stone-500"
                  }`}>
                    {item.cleanedText || item.rawTranscript || item.rawInputText || "No content"}
                  </p>

                  {/* Metadata row */}
                  <div className={`mt-3 flex items-center gap-2 text-[11px] font-medium ${
                    selected ? "text-stone-400" : "text-stone-400"
                  }`}>
                    <span className="truncate max-w-[100px]">{item.categoryPath.category || "—"}</span>
                    <span className="text-stone-500">·</span>
                    <span>{item.priority === "NOT_APPLICABLE" ? "—" : priorityShort(item.priority)}</span>
                    <span className="text-stone-500">·</span>
                    <span className="ml-auto shrink-0">{formatRelativeDate(item.createdAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
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
