import { useState } from "react";
import type { MemoraItem } from "../../types/reviewTypes";

export function OriginalCaptureSection({ item }: { item: MemoraItem }) {
  const [open, setOpen] = useState(false);

  if (!item.rawInputText && !item.rawTranscript) return null;
  return (
    <section className="mt-7">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 text-left text-sm font-medium text-stone-500 transition hover:text-stone-800"
      >
        <span>{open ? "Hide original raw text" : "Show original raw text"}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={open ? "rotate-180 transition" : "transition"}
        >
          <polyline points="3 5.5 7 9 11 5.5" />
        </svg>
      </button>

      {open ? (
        <div className="mt-3 space-y-4 rounded-2xl border border-stone-200 bg-stone-50/70 px-5 py-5">
          {item.rawInputText && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Original raw text</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-700">{item.rawInputText}</p>
            </div>
          )}
          {item.rawTranscript && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Original raw text</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-700">{item.rawTranscript}</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
