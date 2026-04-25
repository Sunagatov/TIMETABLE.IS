import type { MemoraItem } from "../../types/reviewTypes";
import { Chip } from "./DetailPrimitives";
import { priorityLabel } from "./itemDetailUtils";

export function ItemMetadataChips({ item }: { item: MemoraItem }) {
  const categoryLabel = [
    item.categoryPath.category,
    item.categoryPath.subcategory,
    item.categoryPath.subsubcategory
  ].filter(Boolean).join(" > ");

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Chip label="Type" value={item.type} />
      {item.priority !== "NOT_APPLICABLE" && <Chip label="Priority" value={priorityLabel(item.priority)} />}
      {categoryLabel && <Chip label="Category" value={categoryLabel} />}
    </div>
  );
}
