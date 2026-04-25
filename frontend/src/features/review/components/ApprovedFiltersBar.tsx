import { CategoryCascade, DateField, FilterSelect, ResetButton, updateCascadeFilter } from "./FilterControls";
import {
  APPROVED_STATUS_FILTER_OPTIONS,
  ITEM_TYPE_FILTER_OPTIONS,
  PRIORITY_FILTER_OPTIONS,
  REVIEW_LIST_SORT_OPTIONS
} from "../reviewConstants";
import type { ApprovedFilters, ItemStatus, ItemType, ListSort, MemoraCategory, Priority } from "../types/reviewTypes";

type Props = {
  filters: ApprovedFilters;
  categories: MemoraCategory[];
  onChange: (next: ApprovedFilters) => void;
  onReset: () => void;
};

export function ApprovedFiltersBar({ filters, categories, onChange, onReset }: Props) {
  const set = (partial: Partial<ApprovedFilters>) => onChange({ ...filters, ...partial });

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={filters.keyword}
        onChange={(e) => set({ keyword: e.target.value })}
        placeholder="Search title, cleaned text, raw transcript, raw input, answer..."
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900"
      />
      <CategoryCascade
        category={filters.category}
        subcategory={filters.subcategory}
        categories={categories}
        onCategoryChange={(v) => onChange(updateCascadeFilter(filters, "category", v))}
        onSubcategoryChange={(v) => onChange(updateCascadeFilter(filters, "subcategory", v))}
      />
      <div className="grid gap-3 md:grid-cols-4">
        <FilterSelect
          label="Type"
          value={filters.type}
          options={ITEM_TYPE_FILTER_OPTIONS}
          onChange={(v) => set({ type: v as ItemType | "ALL" })}
        />
        <FilterSelect
          label="Priority"
          value={filters.priority}
          options={PRIORITY_FILTER_OPTIONS}
          onChange={(v) => set({ priority: v as Priority | "ALL" })}
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          options={APPROVED_STATUS_FILTER_OPTIONS}
          onChange={(v) => set({ status: v as Extract<ItemStatus, "HUMAN_APPROVED" | "HUMAN_EDITED_APPROVED"> | "ALL" })}
        />
        <FilterSelect
          label="Sort"
          value={filters.sort}
          options={REVIEW_LIST_SORT_OPTIONS}
          onChange={(v) => set({ sort: v as ListSort })}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <DateField
          label="Created from"
          value={filters.createdFrom}
          onChange={(v) => set({ createdFrom: v })}
        />
        <DateField
          label="Created to"
          value={filters.createdTo}
          onChange={(v) => set({ createdTo: v })}
        />
      </div>
      <ResetButton onClick={onReset} />
    </div>
  );
}
