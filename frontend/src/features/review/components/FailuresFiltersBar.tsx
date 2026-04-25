import { CategoryCascade, DateField, FilterSelect, ResetButton, updateCascadeFilter } from "./FilterControls";
import type { FailuresFilters, ListSort, MemoraCategory } from "../types/reviewTypes";

const TYPE_OPTIONS = ["ALL", "IDEA", "THOUGHT", "QUESTION", "REMINDER", "OTHER"];
const PRIORITY_OPTIONS = [
  "ALL",
  "URGENT_IMPORTANT",
  "URGENT_NOT_IMPORTANT",
  "NOT_URGENT_IMPORTANT",
  "NOT_URGENT_NOT_IMPORTANT",
  "NOT_APPLICABLE"
];
const STATUS_OPTIONS = ["ALL", "TRANSCRIPTION_FAILED", "AI_PROCESSING_FAILED"];
const SORT_OPTIONS: ListSort[] = [
  "createdAt-desc",
  "createdAt-asc",
  "title-asc",
  "title-desc",
  "category-asc",
  "category-desc"
];

type Props = {
  filters: FailuresFilters;
  categories: MemoraCategory[];
  onChange: (next: FailuresFilters) => void;
  onReset: () => void;
};

export function FailuresFiltersBar({ filters, categories, onChange, onReset }: Props) {
  const set = (partial: Partial<FailuresFilters>) => onChange({ ...filters, ...partial });

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={filters.keyword}
        onChange={(e) => set({ keyword: e.target.value })}
        placeholder="Search failures by title, cleaned text, raw transcript, raw input, answer..."
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900"
      />
      <CategoryCascade
        category={filters.category}
        subcategory={filters.subcategory}
        subsubcategory={filters.subsubcategory}
        categories={categories}
        onCategoryChange={(v) => onChange(updateCascadeFilter(filters, "category", v))}
        onSubcategoryChange={(v) => onChange(updateCascadeFilter(filters, "subcategory", v))}
        onSubsubcategoryChange={(v) => onChange(updateCascadeFilter(filters, "subsubcategory", v))}
      />
      <div className="grid gap-3 md:grid-cols-4">
        <FilterSelect label="Type" value={filters.type} options={TYPE_OPTIONS} onChange={(v) => set({ type: v })} />
        <FilterSelect label="Priority" value={filters.priority} options={PRIORITY_OPTIONS} onChange={(v) => set({ priority: v })} />
        <FilterSelect label="Status" value={filters.status} options={STATUS_OPTIONS} onChange={(v) => set({ status: v })} />
        <FilterSelect label="Sort" value={filters.sort} options={SORT_OPTIONS} onChange={(v) => set({ sort: v as ListSort })} />
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
