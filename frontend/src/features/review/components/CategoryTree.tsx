import { useMemo, useState } from "react";
import type { CategoryPathFilter, MemoraCategory } from "../types/reviewTypes";

type TreeData = Map<string, Map<string, MemoraCategory[]>>;

type Props = {
  categories: MemoraCategory[];
  loading: boolean;
  errorMessage: string | null;
  filter: CategoryPathFilter;
  onSelect: (filter: CategoryPathFilter) => void;
  onClearFilter: () => void;
  dark?: boolean;
};

export function CategoryTree({ categories, loading, errorMessage, filter, onSelect, onClearFilter, dark }: Props) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const tree = useMemo(() => buildTree(categories), [categories]);

  function toggle(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const activeLabel = [filter.category, filter.subcategory]
    .filter(Boolean)
    .join(" / ");

  const labelClass = dark ? "text-stone-500" : "text-stone-500";
  const activeLabelClass = dark ? "text-stone-300" : "text-stone-600";
  const emptyClass = dark ? "text-stone-600" : "text-stone-400";
  const loadingClass = dark ? "text-stone-500" : "text-stone-400";
  const errorClass = dark ? "text-red-400" : "text-red-600";
  const clearBtnClass = dark
    ? "text-stone-500 hover:text-stone-300"
    : "text-stone-500 hover:text-stone-900";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${labelClass}`}>
          Categories
        </p>
        {activeLabel ? (
          <button
            type="button"
            onClick={onClearFilter}
            className={`text-[11px] font-medium transition ${clearBtnClass}`}
          >
            Clear
          </button>
        ) : null}
      </div>

      {activeLabel ? (
        <p className={`mb-2 truncate text-xs ${activeLabelClass}`}>{activeLabel}</p>
      ) : (
        <p className={`mb-2 text-xs ${emptyClass}`}>All categories</p>
      )}

      {loading ? (
        <p className={`text-xs ${loadingClass}`}>Loading…</p>
      ) : errorMessage ? (
        <p className={`text-xs ${errorClass}`}>{errorMessage}</p>
      ) : !tree.size ? (
        <p className={`text-xs ${emptyClass}`}>No categories yet.</p>
      ) : (
        <div className="space-y-0.5">
          {[...tree.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, subMap]) => {
              const catKey = `cat:${category}`;
              const catOpen = expandedKeys.has(catKey);
              const catActive = filter.category === category;

              const catBtnClass = dark
                ? catActive
                  ? "bg-amber-500/15 text-amber-300"
                  : "text-stone-400 hover:bg-white/6 hover:text-stone-200"
                : catActive
                  ? "bg-stone-200 text-stone-900"
                  : "text-stone-700 hover:bg-stone-100";

              return (
                <div key={category}>
                  <button
                    type="button"
                    onClick={() => {
                      toggle(catKey);
                      onSelect({ category, subcategory: "" });
                    }}
                    className={`flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition ${catBtnClass}`}
                  >
                    <span className={`w-3 shrink-0 text-[10px] ${dark ? "text-stone-600" : "text-stone-400"}`}>
                      {catOpen ? "▼" : "▶"}
                    </span>
                    <span className="truncate">{category}</span>
                  </button>

                  {catOpen && (
                    <div className={`ml-3 mt-0.5 space-y-0.5 border-l pl-2 ${dark ? "border-white/8" : "border-stone-200"}`}>
                      {[...subMap.entries()]
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([subcategory]) => {
                          const subActive = catActive && filter.subcategory === subcategory;

                          const subBtnClass = dark
                            ? subActive
                              ? "text-amber-300 font-semibold"
                              : "text-stone-500 hover:bg-white/6 hover:text-stone-300"
                            : subActive
                              ? "font-medium text-stone-900"
                              : "text-stone-600 hover:bg-stone-100";

                          return (
                            <div key={subcategory}>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelect({ category, subcategory });
                                }}
                                className={`flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition ${subBtnClass}`}
                              >
                                <span className={`w-3 shrink-0 text-[10px] ${dark ? "text-stone-600" : "text-stone-400"}`}>
                                  •
                                </span>
                                <span className="truncate">{subcategory}</span>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

function buildTree(categories: MemoraCategory[]): TreeData {
  const tree: TreeData = new Map();
  for (const cat of categories) {
    const { category, subcategory } = cat.path;
    if (!tree.has(category)) tree.set(category, new Map());
    const subMap = tree.get(category)!;
    if (!subMap.has(subcategory)) subMap.set(subcategory, []);
    subMap.get(subcategory)!.push(cat);
  }
  return tree;
}
