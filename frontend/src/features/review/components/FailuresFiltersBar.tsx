import { CategoryCascade, DateField, ResetButton } from "./FilterControls";
import type { FailuresFilters, MemoraCategory } from "../types/reviewTypes";

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
        onCategoryChange={(v) => set({ category: v, subcategory: "", subsubcategory: "" })}
        onSubcategoryChange={(v) => set({ subcategory: v, subsubcategory: "" })}
        onSubsubcategoryChange={(v) => set({ subsubcategory: v })}
      />
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
