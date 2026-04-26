import { CategoryCascade, DateField, FilterSection, FilterSelect, ResetButton, updateCascadeFilter } from "./FilterControls";
import { FAILURE_STATUS_FILTER_OPTIONS, PRIORITY_FILTER_OPTIONS } from "../reviewConstants";
import type { FailuresFilters, ItemStatus, MemoraCategory, Priority } from "../types/reviewTypes";

type Props = {
  filters: FailuresFilters;
  categories: MemoraCategory[];
  onChange: (next: FailuresFilters) => void;
  onReset: () => void;
};

export function FailuresFiltersBar({ filters, categories, onChange, onReset }: Props) {
  const set = (partial: Partial<FailuresFilters>) => onChange({ ...filters, ...partial });

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
        <FilterSelect
          label="Status"
          value={filters.status}
          options={FAILURE_STATUS_FILTER_OPTIONS}
          onChange={(v) => set({ status: v as Extract<ItemStatus, "TRANSCRIPTION_FAILED" | "AI_PROCESSING_FAILED"> | "ALL" })}
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
