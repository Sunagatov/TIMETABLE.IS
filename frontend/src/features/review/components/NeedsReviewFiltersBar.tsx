import { CategoryCascade, DateField, FilterSelect, ResetButton } from "./FilterControls";
import type { ListSort, MemoraCategory, NeedsReviewFilters } from "../types/reviewTypes";

const TYPE_OPTIONS = ["ALL", "IDEA", "THOUGHT", "REMINDER", "OTHER"];
const PRIORITY_OPTIONS = [
  "ALL",
  "URGENT_IMPORTANT",
  "URGENT_NOT_IMPORTANT",
  "NOT_URGENT_IMPORTANT",
  "NOT_URGENT_NOT_IMPORTANT",
  "NOT_APPLICABLE"
];
const SORT_OPTIONS: ListSort[] = [
  "createdAt-desc",
  "createdAt-asc",
  "title-asc",
  "title-desc",
  "category-asc",
  "category-desc"
];

type Props = {
  filters: NeedsReviewFilters;
  categories: MemoraCategory[];
  onChange: (next: NeedsReviewFilters) => void;
  onReset: () => void;
};

export function NeedsReviewFiltersBar({ filters, categories, onChange, onReset }: Props) {
  const set = (partial: Partial<NeedsReviewFilters>) => onChange({ ...filters, ...partial });

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={filters.keyword}
        onChange={(e) => set({ keyword: e.target.value })}
        placeholder="Search title, cleaned text, raw input..."
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900"
      />
      <CategoryCascade
        category={filters.category}
        subcategory={filters.subcategory}
        subsubcategory={filters.subsubcategory}
        categories={categories}
        onCategoryChange={(v) => set({ category: v, subcategory: "", subsubcategory: "" })}
        onSubcategoryChange={(v) => set({ subcategory: v, subsubcategory: "" })}
        onSubsubcategoryChange={(v) => set({ subsubcategory: v })}
      />
      <div className="grid gap-3 md:grid-cols-3">
        <FilterSelect
          label="Type"
          value={filters.type}
          options={TYPE_OPTIONS}
          onChange={(v) => set({ type: v })}
        />
        <FilterSelect
          label="Priority"
          value={filters.priority}
          options={PRIORITY_OPTIONS}
          onChange={(v) => set({ priority: v })}
        />
        <FilterSelect
          label="Sort"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(v) => set({ sort: v as ListSort })}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <DateField
          label="Created from"
          value={filters.dateFrom}
          onChange={(v) => set({ dateFrom: v })}
        />
        <DateField
          label="Created to"
          value={filters.dateTo}
          onChange={(v) => set({ dateTo: v })}
        />
      </div>
      <ResetButton onClick={onReset} />
    </div>
  );
}
