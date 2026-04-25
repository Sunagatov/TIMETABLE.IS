import type { MemoraItem } from "../../types/reviewTypes";

export function ItemFailureNotice({ item }: { item: MemoraItem }) {
  if (!item.failureStage && !item.failureReason) return null;
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-semibold text-red-800">
        {item.failureStage ? `Failed at: ${item.failureStage.replace(/_/g, " ")}` : "Processing failure"}
      </p>
      {item.failureReason && <p className="mt-1 text-sm text-red-700">{item.failureReason}</p>}
    </div>
  );
}
