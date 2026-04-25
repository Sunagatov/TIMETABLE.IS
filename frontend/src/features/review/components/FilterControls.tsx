import { useMemo } from "react";
import type { MemoraCategory } from "../types/reviewTypes";

export type CascadeFilterState = {
  category: string;
  subcategory: string;
};

export function FilterSelect(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  emptyLabel?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-stone-500">{props.label}</span>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-400"
      >
        {props.options.map((opt) => (
          <option key={opt || props.emptyLabel || "all"} value={opt}>
            {opt || props.emptyLabel || "All"}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DateField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-stone-500">{props.label}</span>
      <input
        type="date"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-400"
      />
    </label>
  );
}

export function ResetButton(props: { onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={props.onClick}
        className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-stone-400 hover:text-stone-900"
      >
        Reset filters
      </button>
    </div>
  );
}

export function CategoryCascade(props: {
  category: string;
  subcategory: string;
  categories: MemoraCategory[];
  onCategoryChange: (v: string) => void;
  onSubcategoryChange: (v: string) => void;
}) {
  const categoryOptions = useMemo(
    () => uniqueSorted(props.categories.map((c) => c.path.category)),
    [props.categories]
  );
  const subcategoryOptions = useMemo(
    () =>
      uniqueSorted(
        props.categories
          .filter((c) => !props.category || c.path.category === props.category)
          .map((c) => c.path.subcategory)
      ),
    [props.categories, props.category]
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FilterSelect
        label="Category"
        value={props.category}
        options={["", ...categoryOptions]}
        onChange={props.onCategoryChange}
        emptyLabel="All categories"
      />
      <FilterSelect
        label="Subcategory"
        value={props.subcategory}
        options={["", ...subcategoryOptions]}
        onChange={props.onSubcategoryChange}
        emptyLabel="All subcategories"
      />
    </div>
  );
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function updateCascadeFilter<T extends CascadeFilterState>(
  filters: T,
  level: "category" | "subcategory",
  value: string
): T {
  if (level === "category") {
    return { ...filters, category: value, subcategory: "" };
  }
  return { ...filters, subcategory: value };
}
