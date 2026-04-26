import type { ReactNode } from "react";
import type { MemoraItem } from "../../types/reviewTypes";
import { formatDate } from "./itemDetailUtils";
import { StatusPill } from "./DetailPrimitives";

type Props = {
  item: MemoraItem;
  isQuestion: boolean;
  actions?: ReactNode;
};

export function ItemHeader({ item, isQuestion, actions }: Props) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {isQuestion && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Question</span>
          )}
          {item.proposedCategoryStatus === "PENDING_REVIEW" && (
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">Category proposal pending</span>
          )}
          <StatusPill status={item.status} />
          <span className="text-xs text-stone-400">{formatDate(item.createdAt)}</span>
        </div>
        {actions}
      </div>
      <h1 className="mt-5 text-3xl font-semibold leading-tight text-stone-950">
        {item.title || <span className="text-stone-300">Untitled</span>}
      </h1>
    </>
  );
}
