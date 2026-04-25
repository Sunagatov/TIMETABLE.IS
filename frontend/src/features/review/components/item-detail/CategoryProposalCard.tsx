import type { MemoraItem } from "../../types/reviewTypes";
import { formatCategoryPath, proposalLabel } from "./itemDetailUtils";

type Props = {
  item: MemoraItem;
  busy: boolean;
  busyAction: string | null;
  onApproveCategoryProposal: (itemId: string) => Promise<void>;
  onRejectCategoryProposal: (itemId: string) => Promise<void>;
};

export function CategoryProposalCard({
  item,
  busy,
  busyAction,
  onApproveCategoryProposal,
  onRejectCategoryProposal
}: Props) {
  if (!item.proposedCategoryPath) return null;
  const hasPendingProposal = item.proposedCategoryStatus === "PENDING_REVIEW";

  return (
    <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">AI Category Proposal</p>
          <p className="mt-1 text-sm text-stone-700">
            {formatCategoryPath(item.proposedCategoryPath)}
            <span className="ml-2 text-xs text-stone-400">{proposalLabel(item.proposedCategoryStatus)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!hasPendingProposal || busy}
            onClick={() => void onApproveCategoryProposal(item.id)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {busyAction === "category-approve" ? "..." : "Accept"}
          </button>
          <button
            type="button"
            disabled={!item.proposedCategoryPath || busy}
            onClick={() => void onRejectCategoryProposal(item.id)}
            className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
          >
            {busyAction === "category-reject" ? "..." : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
}
