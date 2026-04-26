import { CategoryCascade, DateField, FilterSection, FilterSelect, ResetButton, updateCascadeFilter } from "./FilterControls";
import { PRIORITY_FILTER_OPTIONS } from "../reviewConstants";
import type { MemoraCategory, NeedsReviewFilters, Priority } from "../types/reviewTypes";

type Props = {
  filters: NeedsReviewFilters;
  categories: MemoraCategory[];
  onChange: (next: NeedsReviewFilters) => void;
  onReset: () => void;
};

export function NeedsReviewFiltersBar({ filters, categories, onChange, onReset }: Props) {
  const set = (partial: Partial<NeedsReviewFilters>) => onChange({ ...filters, ...partial });

  return (
    <div className="space-y-3.5">
      <FilterSection title="Category" columns="one">
        <CategoryCascade
          category={filters.category}
          subcategory={filters.subcategory}
          categories={categories}
          onCategoryChange={(v) => onChange(updateCascadeFilter(filters, "category", v))}
          onSubcategoryChange={(v) => onChange(updateCascadeFilter(filters, "subcategory", v))}
        />
      </FilterSection>
      <FilterSection title="Refine">
        <FilterSelect
          label="Priority"
          value={filters.priority}
          options={PRIORITY_FILTER_OPTIONS}
          onChange={(v) => set({ priority: v as Priority | "ALL" })}
        />
      </FilterSection>
      <FilterSection title="Created">
        <DateField
          label="From"
          value={filters.createdFrom}
          onChange={(v) => set({ createdFrom: v })}
        />
        <DateField
          label="To"
          value={filters.createdTo}
          onChange={(v) => set({ createdTo: v })}
        />
      </FilterSection>
      <ResetButton onClick={onReset} />
    </div>
  );
}
