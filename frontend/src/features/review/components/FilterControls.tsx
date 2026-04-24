import { useMemo } from "react";
import type { MemoraCategory } from "../types/reviewTypes";

export function FilterSelect(props: {
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
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
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
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block font-medium text-stone-700">{props.label}</span>
      <input
        type="date"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
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
        className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
      >
        Reset
      </button>
    </div>
  );
}

export function CategoryCascade(props: {
  category: string;
  subcategory: string;
  subsubcategory: string;
  categories: MemoraCategory[];
  onCategoryChange: (v: string) => void;
  onSubcategoryChange: (v: string) => void;
  onSubsubcategoryChange: (v: string) => void;
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
  const subsubcategoryOptions = useMemo(
    () =>
      uniqueSorted(
        props.categories
          .filter((c) => {
            if (props.category && c.path.category !== props.category) return false;
            return !(props.subcategory && c.path.subcategory !== props.subcategory);

          })
          .map((c) => c.path.subsubcategory)
      ),
    [props.categories, props.category, props.subcategory]
  );

  return (
    <div className="grid gap-3 md:grid-cols-3">
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
      <FilterSelect
        label="Subsubcategory"
        value={props.subsubcategory}
        options={["", ...subsubcategoryOptions]}
        onChange={props.onSubsubcategoryChange}
        emptyLabel="All"
      />
    </div>
  );
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
