import type { MemoraItem } from "../../types/reviewTypes";
import { formatCategoryPath } from "./itemDetailUtils";

type Props = {
  item: MemoraItem;
  isQuestion: boolean;
};

export function AiOutputComparison({ item, isQuestion }: Props) {
  return (
    <section className="mt-5 rounded-xl border border-stone-200 bg-white">
      <div className="grid gap-px overflow-hidden rounded-xl bg-stone-200 md:grid-cols-2">
        <ComparisonColumn
          title="Current human-facing values"
          rows={[
            ["Title", item.title],
            ["Cleaned text", item.cleanedText],
            ["Type", item.type],
            ["Priority", item.priority],
            ["Category", formatCategoryPath(item.categoryPath)],
            ...(isQuestion ? [["Answer", item.answer ?? ""] as [string, string]] : [])
          ]}
        />
        <ComparisonColumn
          title="Original AI values"
          rows={[
            ["Title", item.aiTitle],
            ["Cleaned text", item.aiCleanedText],
            ["Type", item.aiType],
            ["Priority", item.aiPriority],
            ["Category", formatCategoryPath(item.aiCategoryPath)],
            ...(isQuestion ? [["Answer", item.aiAnswer ?? ""] as [string, string]] : [])
          ]}
        />
      </div>
    </section>
  );
}

function ComparisonColumn({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="bg-stone-50 p-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-stone-500">{title}</p>
      <div className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{label}</p>
            <p className="mt-0.5 whitespace-pre-wrap text-sm leading-6 text-stone-700">
              {value || <span className="text-stone-300">Empty</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
