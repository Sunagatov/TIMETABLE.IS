import type { ApprovedSort } from "../types/reviewTypes";

type Props = {
  keyword: string;
  type: string;
  priority: string;
  sort: ApprovedSort;
  onKeywordChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSortChange: (value: ApprovedSort) => void;
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

export function ApprovedFiltersBar({
  keyword,
  type,
  priority,
  sort,
  onKeywordChange,
  onTypeChange,
  onPriorityChange,
  onSortChange
}: Props) {
  return (
    <div className="space-y-3">
      <input
        type="search"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        placeholder="Search title, cleaned text, raw transcript, or raw input"
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900"
      />

      <div className="grid gap-3 md:grid-cols-3">
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
    </div>
  );
}

function FilterSelect(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
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
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
