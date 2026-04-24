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
  return (
    <section className="flex h-screen flex-col border-r border-stone-200 bg-[#fbf8f2]">
      <header className="border-b border-stone-200 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
          Workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        {toolbar ? <div className="mt-5">{toolbar}</div> : null}
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white/80 p-8 text-center text-sm leading-6 text-stone-500">
            Loading items...
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm leading-6 text-red-700">
            {errorMessage}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white/80 p-8 text-center text-sm leading-6 text-stone-500">
            No items match the current filters.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const selected = item.id === selectedItemId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={
                    "block w-full rounded-3xl border p-4 text-left transition " +
                    (selected
                      ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                      : "border-stone-200 bg-white text-stone-900 hover:border-stone-400 hover:bg-stone-50")
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={
                          "text-xs font-semibold uppercase tracking-[0.2em] " +
                          (selected ? "text-stone-300" : "text-stone-500")
                        }
                      >
                        {item.sourceType.replace(/_/g, " ")}
                      </p>
                      <h2 className="mt-2 truncate text-lg font-semibold">{item.title}</h2>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span
                        className={
                          "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] " +
                          (selected ? "bg-white/15 text-white" : "bg-stone-100 text-stone-700")
                        }
                      >
                        {item.status.replace(/_/g, " ")}
                      </span>
                      {view === "failures" && item.failureStage ? (
                        <span
                          className={
                            "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] " +
                            (selected
                              ? "bg-red-400/30 text-red-100"
                              : "bg-red-50 text-red-700")
                          }
                          >
                          {item.failureStage.replace(/_/g, " ")}
                        </span>
                      ) : null}
                      {item.type === "QUESTION" || item.aiType === "QUESTION" ? (
                        <span
                          className={
                            "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] " +
                            (selected
                              ? "bg-amber-400/20 text-amber-100"
                              : "bg-amber-50 text-amber-700")
                          }
                        >
                          Question
                        </span>
                      ) : null}
                      {item.proposedCategoryStatus === "PENDING_REVIEW" ? (
                        <span
                          className={
                            "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] " +
                            (selected
                              ? "bg-blue-400/20 text-blue-100"
                              : "bg-blue-50 text-blue-700")
                          }
                        >
                          Category proposal
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <p
                    className={
                      "mt-3 line-clamp-3 text-sm leading-6 " +
                      (selected ? "text-stone-100" : "text-stone-600")
                    }
                  >
                    {item.cleanedText || item.rawTranscript || item.rawInputText || "No content"}
                  </p>

                  <div
                    className={
                      "mt-4 flex flex-wrap gap-2 text-xs font-medium " +
                      (selected ? "text-stone-200" : "text-stone-500")
                    }
                  >
                    <span className="truncate max-w-[160px]">{item.id}</span>
                    <span>·</span>
                    <span>{item.type}</span>
                    <span>·</span>
                    <span>{item.priority}</span>
                    <span>·</span>
                    <span>{item.categoryPath.category}</span>
                    {item.answerStatus === "FAILED" ? (
                      <>
                        <span>·</span>
                        <span>answer failed</span>
                      </>
                    ) : null}
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
