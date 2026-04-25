import type { MemoraItem } from "../../types/reviewTypes";

export function OriginalCaptureSection({ item }: { item: MemoraItem }) {
  if (!item.rawInputText && !item.rawTranscript) return null;
  return (
    <section className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Raw input / transcript</p>
      {item.rawInputText && (
        <div>
          <p className="text-[11px] font-medium text-stone-400">Original text</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-600">{item.rawInputText}</p>
        </div>
      )}
      {item.rawTranscript && (
        <div className={item.rawInputText ? "mt-4" : ""}>
          <p className="text-[11px] font-medium text-stone-400">Transcript</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-600">{item.rawTranscript}</p>
        </div>
      )}
    </section>
  );
}
