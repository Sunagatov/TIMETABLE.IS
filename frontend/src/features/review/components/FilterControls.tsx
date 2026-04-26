import { useMemo } from "react";
import type { MemoraCategory } from "../types/reviewTypes";

export type FilterOption = {
  value: string;
  label: string;
};

export type CascadeFilterState = {
  category: string;
  subcategory: string;
};

export function FilterSelect(props: {
  label: string;
  value: string;
  options: Array<string | FilterOption>;
  onChange: (value: string) => void;
  emptyLabel?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
        {props.label}
      </span>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-stone-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-stone-50"
      >
        {props.options.map((opt) => {
          const option = typeof opt === "string"
            ? { value: opt, label: opt || props.emptyLabel || "All" }
            : opt;

          return (
            <option key={option.value || props.emptyLabel || "all"} value={option.value}>
              {option.label || props.emptyLabel || "All"}
            </option>
          );
        })}
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
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
        {props.label}
      </span>
      <input
        type="date"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-stone-50"
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
        className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-600 transition hover:border-stone-400 hover:text-stone-900"
      >
        Reset filters
      </button>
    </div>
  );
}

export function SearchField(props: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
        Search
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-stone-50"
        />
      </div>
    </label>
  );
}

export function FilterSection(props: {
  title: string;
  children: React.ReactNode;
  columns?: "one" | "two";
}) {
  const columnsClass = props.columns === "one"
    ? "grid gap-3"
    : "grid gap-3 grid-cols-2";

  return (
    <section className="rounded-[1.35rem] border border-stone-200/80 bg-stone-50/70 p-3.5">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
        {props.title}
      </div>
      <div className={columnsClass}>{props.children}</div>
    </section>
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
    <div className="grid gap-3">
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

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6.25" cy="6.25" r="4.25" />
      <path d="m9.5 9.5 2.75 2.75" />
    </svg>
  );
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
