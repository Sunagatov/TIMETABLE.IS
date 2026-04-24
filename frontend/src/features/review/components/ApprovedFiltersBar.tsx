import { useMemo } from "react";
import type { ApprovedSort, MemoraCategory } from "../types/reviewTypes";

type Props = {
  keyword: string;
  type: string;
  priority: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
  sort: ApprovedSort;
  categories: MemoraCategory[];
  onKeywordChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onSubsubcategoryChange: (value: string) => void;
  onSortChange: (value: ApprovedSort) => void;
  onResetFilters: () => void;
};

const typeOptions = ["ALL", "IDEA", "THOUGHT", "REMINDER", "OTHER"];
const priorityOptions = [
  "ALL",
  "URGENT_IMPORTANT",
  "URGENT_NOT_IMPORTANT",
  "NOT_URGENT_IMPORTANT",
  "NOT_URGENT_NOT_IMPORTANT",
  "NOT_APPLICABLE"
];
const statusOptions = [
  "ALL",
  "RECEIVED",
  "TRANSCRIPTION_FAILED",
  "TRANSCRIBED",
  "AI_PROCESSING_FAILED",
  "AI_PROCESSED_UNREVIEWED",
  "HUMAN_APPROVED",
  "HUMAN_EDITED_APPROVED",
  "REJECTED",
  "DELETED"
];

export function ApprovedFiltersBar({
  keyword,
  type,
  priority,
  status,
  dateFrom,
  dateTo,
  category,
  subcategory,
  subsubcategory,
  sort,
  categories,
  onKeywordChange,
  onTypeChange,
  onPriorityChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onCategoryChange,
  onSubcategoryChange,
  onSubsubcategoryChange,
  onSortChange,
  onResetFilters
}: Props) {
  const categoryOptions = useMemo(
    () => uniqueSorted(categories.map((entry) => entry.path.category)),
    [categories]
  );
  const subcategoryOptions = useMemo(() => {
    const next = categories
      .filter((entry) => !category || entry.path.category === category)
      .map((entry) => entry.path.subcategory);

    return uniqueSorted(next);
  }, [categories, category]);
  const subsubcategoryOptions = useMemo(() => {
    const next = categories
      .filter((entry) => {
        if (category && entry.path.category !== category) {
          return false;
        }

        return !(subcategory && entry.path.subcategory !== subcategory);


      })
      .map((entry) => entry.path.subsubcategory);

    return uniqueSorted(next);
  }, [categories, category, subcategory]);

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        placeholder="Search title, cleaned text, raw transcript, or raw input"
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900"
      />

      <div className="grid gap-3 md:grid-cols-3">
        <FilterSelect
          label="Category"
          value={category}
          options={["", ...categoryOptions]}
          onChange={onCategoryChange}
          emptyLabel="All categories"
        />
        <FilterSelect
          label="Subcategory"
          value={subcategory}
          options={["", ...subcategoryOptions]}
          onChange={onSubcategoryChange}
          emptyLabel="All subcategories"
        />
        <FilterSelect
          label="Subsubcategory"
          value={subsubcategory}
          options={["", ...subsubcategoryOptions]}
          onChange={onSubsubcategoryChange}
          emptyLabel="All subsubcategories"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <FilterSelect
          label="Type"
          value={type}
          options={typeOptions}
          onChange={onTypeChange}
        />
        <FilterSelect
          label="Priority"
          value={priority}
          options={priorityOptions}
          onChange={onPriorityChange}
        />
        <FilterSelect
          label="Status"
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
        />
        <FilterSelect
          label="Sort"
          value={sort}
          options={[
            "createdAt-desc",
            "createdAt-asc",
            "title-asc",
            "title-desc",
            "category-asc",
            "category-desc"
          ]}
          onChange={(value) => onSortChange(value as ApprovedSort)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <DateField label="Created from" value={dateFrom} onChange={onDateFromChange} />
        <DateField label="Created to" value={dateTo} onChange={onDateToChange} />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onResetFilters}
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}

function FilterSelect(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  emptyLabel?: string;
}) {
  return (
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block font-medium text-stone-700">{props.label}</span>
      <select
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
      >
        {props.options.map((option) => (
          <option key={option || props.emptyLabel || "ALL"} value={option}>
            {option || props.emptyLabel || "All"}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block font-medium text-stone-700">{props.label}</span>
      <input
        type="date"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
      />
    </label>
  );
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}
