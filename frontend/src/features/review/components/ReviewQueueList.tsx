import type { ReactNode } from "react";
import type { MemoraItem } from "../types/reviewTypes";

type Props = {
  title: string;
  description: string;
  items: MemoraItem[];
  selectedItemId: string | null;
  onSelect: (itemId: string) => void;
  toolbar?: ReactNode;
};

export function ReviewQueueList({
  title,
  description,
  items,
  selectedItemId,
  onSelect,
  toolbar
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
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white/80 p-8 text-center text-sm leading-6 text-stone-500">
            No items match the current backend state and filters.
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
                    <div>
                      <p
                        className={
                          "text-xs font-semibold uppercase tracking-[0.2em] " +
                          (selected ? "text-stone-300" : "text-stone-500")
                        }
                      >
                        {item.sourceType.replace(/_/g, " ")}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                    </div>
                    <span
                      className={
                        "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] " +
                        (selected
                          ? "bg-white/15 text-white"
                          : "bg-stone-100 text-stone-700")
                      }
                    >
                      {item.status.replace(/_/g, " ")}
                    </span>
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
                    <span>{item.id}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.priority}</span>
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
