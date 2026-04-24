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
};

export function CategoryTree({ categories, loading, errorMessage, filter, onSelect, onClearFilter }: Props) {
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

  const activeLabel = [filter.category, filter.subcategory, filter.subsubcategory]
    .filter(Boolean)
    .join(" / ");

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Categories
        </p>
        {activeLabel ? (
          <button
            type="button"
            onClick={onClearFilter}
            className="text-xs font-medium text-stone-500 hover:text-stone-900"
          >
            Clear
          </button>
        ) : null}
      </div>

      {activeLabel ? (
        <p className="mb-3 truncate text-xs text-stone-600">{activeLabel}</p>
      ) : (
        <p className="mb-3 text-xs text-stone-400">All categories</p>
      )}

      {loading ? (
        <p className="text-sm text-stone-400">Loading categories...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : !tree.size ? (
        <p className="text-sm text-stone-400">No categories yet.</p>
      ) : (
        <div className="space-y-0.5">
          {[...tree.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, subMap]) => {
              const catKey = `cat:${category}`;
              const catOpen = expandedKeys.has(catKey);
              const catActive = filter.category === category;

              return (
                <div key={category}>
                  <button
                    type="button"
                    onClick={() => toggle(catKey)}
                    className={`flex w-full items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-left text-sm font-semibold transition ${
                      catActive
                        ? "bg-stone-200 text-stone-900"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="w-3 shrink-0 text-xs text-stone-400">
                      {catOpen ? "▼" : "▶"}
                    </span>
                    <span className="truncate">{category}</span>
                  </button>

                  {catOpen && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-stone-200 pl-2">
                      {[...subMap.entries()]
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([subcategory, leaves]) => {
                          const subKey = `sub:${category}/${subcategory}`;
                          const subOpen = expandedKeys.has(subKey);
                          const subActive = catActive && filter.subcategory === subcategory;

                          return (
                            <div key={subcategory}>
                              <button
                                type="button"
                                onClick={() => toggle(subKey)}
                                className={`flex w-full items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-left text-sm transition ${
                                  subActive
                                    ? "font-medium text-stone-900"
                                    : "text-stone-600 hover:bg-stone-100"
                                }`}
                              >
                                <span className="w-3 shrink-0 text-xs text-stone-400">
                                  {subOpen ? "▼" : "▶"}
                                </span>
                                <span className="truncate">{subcategory}</span>
                              </button>

                              {subOpen && (
                                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-stone-200 pl-2">
                                  {leaves
                                    .sort((a, b) =>
                                      a.path.subsubcategory.localeCompare(b.path.subsubcategory)
                                    )
                                    .map((cat) => {
                                      const leafActive =
                                        subActive &&
                                        filter.subsubcategory === cat.path.subsubcategory;

                                      return (
                                        <button
                                          key={cat.id}
                                          type="button"
                                          onClick={() =>
                                            onSelect({
                                              category,
                                              subcategory,
                                              subsubcategory: cat.path.subsubcategory
                                            })
                                          }
                                          className={`w-full truncate rounded-xl px-2.5 py-1.5 text-left text-sm transition ${
                                            leafActive
                                              ? "bg-stone-900 font-medium text-white"
                                              : "text-stone-600 hover:bg-stone-100"
                                          }`}
                                        >
                                          {cat.path.subsubcategory}
                                        </button>
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
