import type { MemoraItem } from "../../types/reviewTypes";
import { formatDate } from "./itemDetailUtils";
import { StatusPill } from "./DetailPrimitives";

type Props = {
  item: MemoraItem;
  isQuestion: boolean;
};

export function ItemHeader({ item, isQuestion }: Props) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-stone-500">
          {item.sourceType.replace(/_/g, " ")}
        </span>
        <StatusPill status={item.status} />
        {isQuestion && (
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Question</span>
        )}
        {item.proposedCategoryStatus === "PENDING_REVIEW" && (
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">Category proposal pending</span>
        )}
        <span className="ml-auto text-xs text-stone-400">{formatDate(item.createdAt)}</span>
      </div>
      <h1 className="mt-4 text-2xl font-semibold leading-snug text-stone-950">
        {item.title || <span className="text-stone-300">Untitled</span>}
      </h1>
    </>
  );
}
