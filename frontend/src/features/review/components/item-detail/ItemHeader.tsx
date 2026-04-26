import type { ReactNode } from "react";
import type { MemoraItem } from "../../types/reviewTypes";
import { formatDate } from "./itemDetailUtils";
import { StatusMeta } from "./DetailPrimitives";

type Props = {
  item: MemoraItem;
  isQuestion: boolean;
  actions?: ReactNode;
};

export function ItemHeader({ item, isQuestion, actions }: Props) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusMeta status={item.status} />
          {item.proposedCategoryStatus === "PENDING_REVIEW" && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
              Category proposal pending
            </span>
          )}
          <span className="text-xs text-stone-400">{formatDate(item.createdAt)}</span>
          {isQuestion && (
            <span className="text-xs text-stone-400">Question item</span>
          )}
        </div>
        {actions}
      </div>
      <h1 className="mt-4 text-3xl font-semibold leading-tight text-stone-950">
        {item.title || <span className="text-stone-300">Untitled</span>}
      </h1>
    </>
  );
}
