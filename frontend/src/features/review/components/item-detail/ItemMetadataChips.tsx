import type { MemoraItem } from "../../types/reviewTypes";
import { Chip, TypeChip } from "./DetailPrimitives";
import { priorityLabel } from "./itemDetailUtils";

export function ItemMetadataChips({ item }: { item: MemoraItem }) {
  const categoryLabel = [
    item.categoryPath.category,
    item.categoryPath.subcategory
  ].filter(Boolean).join(" › ");

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <TypeChip type={item.type} />
      {item.priority !== "NOT_APPLICABLE" && (
        <Chip value={priorityLabel(item.priority)} />
      )}
      {categoryLabel && <Chip value={categoryLabel} />}
    </div>
  );
}
