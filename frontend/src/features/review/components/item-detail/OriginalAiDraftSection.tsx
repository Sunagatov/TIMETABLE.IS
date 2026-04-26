import { useState } from "react";
import type { MemoraItem } from "../../types/reviewTypes";
import { formatCategoryPath, samePath } from "./itemDetailUtils";

type Props = {
  item: MemoraItem;
  isQuestion: boolean;
};

export function OriginalAiDraftSection({ item, isQuestion }: Props) {
  const [open, setOpen] = useState(false);

  if (!hasVisibleAiDraftDiff(item, isQuestion)) return null;

  return (
    <section className="mt-5 rounded-2xl border border-stone-200 bg-stone-50/70">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-stone-900">Original AI draft</p>
          <p className="mt-1 text-xs text-stone-500">See the first AI-generated version before any edits.</p>
        </div>
        <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-600">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open ? (
        <div className="border-t border-stone-200 px-5 py-5">
          <div className="space-y-4">
            <DetailRow label="Title" value={item.aiTitle} />
            <DetailRow label="Cleaned text" value={item.aiCleanedText} multiline />
            <DetailRow label="Type" value={item.aiType} />
            <DetailRow label="Priority" value={item.aiPriority} />
            <DetailRow label="Category" value={formatCategoryPath(item.aiCategoryPath)} />
            {isQuestion ? <DetailRow label="Answer" value={item.aiAnswer ?? ""} multiline /> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function hasVisibleAiDraftDiff(item: MemoraItem, isQuestion: boolean): boolean {
  if (item.aiTitle !== item.title) return true;
  if (item.aiCleanedText !== item.cleanedText) return true;
  if (item.aiType !== item.type) return true;
  if (item.aiPriority !== item.priority) return true;
  if (!samePath(item.aiCategoryPath, item.categoryPath)) return true;
  if (isQuestion && (item.aiAnswer ?? "") !== (item.answer ?? "")) return true;
  return false;
}

function DetailRow(props: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">{props.label}</p>
      <p className={`mt-1 text-sm text-stone-700 ${props.multiline ? "whitespace-pre-wrap leading-6" : ""}`}>
        {props.value || <span className="text-stone-300">Empty</span>}
      </p>
    </div>
  );
}
