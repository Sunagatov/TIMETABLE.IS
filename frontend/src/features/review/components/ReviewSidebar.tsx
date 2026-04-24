import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { ReactNode } from "react";
import type {
  CategoryPathFilter,
  CategoryPathRequest,
  CreateCategoryRequest,
  MemoraCategory,
  RenameCategoryRequest
} from "../types/reviewTypes";

type View = "needs-review" | "failures" | "approved";

type CategoryDraft = {
  category: string;
  subcategory: string;
  subsubcategory: string;
};

type Props = {
  view: View;
  onChange: (next: View) => void;
  onLoggedOut: () => void;
  categories: MemoraCategory[];
  categoryFilter: CategoryPathFilter;
  onCategoryFilterChange: (next: CategoryPathFilter) => void;
  busyAction: string | null;
  onCreateCategory: (request: CreateCategoryRequest) => Promise<void>;
  onRenameCategory: (categoryId: string, request: RenameCategoryRequest) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
};

export function ReviewSidebar({
  view,
  onChange,
  onLoggedOut,
  categories,
  categoryFilter,
  onCategoryFilterChange,
  busyAction,
  onCreateCategory,
  onRenameCategory,
  onDeleteCategory
}: Props) {
  const [draft, setDraft] = useState<CategoryDraft>({
    category: "",
    subcategory: "",
    subsubcategory: ""
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isEditing = editingCategoryId !== null;
  const activeCategory = useMemo(
    () =>
      categories.find(
        (entry) =>
          entry.path.category === categoryFilter.category &&
          entry.path.subcategory === categoryFilter.subcategory &&
          entry.path.subsubcategory === categoryFilter.subsubcategory
      ) ?? null,
    [categories, categoryFilter]
  );

  const isBusy = busyAction !== null;
  const submitLabel = isEditing ? "Rename category" : "Create category";

  function loadDraft(path: CategoryPathRequest, categoryId: string) {
    setEditingCategoryId(categoryId);
    setDraft({
      category: path.category,
      subcategory: path.subcategory,
      subsubcategory: path.subsubcategory
    });
    setMessage(null);
  }

  function clearDraft() {
    setEditingCategoryId(null);
    setDraft({
      category: "",
      subcategory: "",
      subsubcategory: ""
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const nextPath = normalizeDraft(draft);
    const request = { path: nextPath };

    try {
      if (isEditing && editingCategoryId) {
        await onRenameCategory(editingCategoryId, request);

        if (activeCategory && activeCategory.id === editingCategoryId) {
          onCategoryFilterChange(nextPath);
        }
      } else {
        await onCreateCategory(request);
      }

      clearDraft();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Category action failed");
    }
  }

  async function handleDelete(categoryId: string) {
    const target = categories.find((entry) => entry.id === categoryId);
    if (!target) {
      return;
    }

    setMessage(null);

    try {
      await onDeleteCategory(categoryId);

      if (
        categoryFilter.category === target.path.category &&
        categoryFilter.subcategory === target.path.subcategory &&
        categoryFilter.subsubcategory === target.path.subsubcategory
      ) {
        onCategoryFilterChange({ category: "", subcategory: "", subsubcategory: "" });
      }

      if (editingCategoryId === categoryId) {
        clearDraft();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Category delete failed");
    }
  }

  return (
    <aside className="flex h-screen flex-col border-r border-stone-200 bg-[#f6f1e8] p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Memora</p>
        <h2 className="mt-3 text-2xl font-semibold text-stone-900">Review-first workspace</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Backend-approved state drives what appears here. Default landing stays on Needs Review.
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        <SidebarButton active={view === "needs-review"} onClick={() => onChange("needs-review")}>
          Needs Review
        </SidebarButton>
        <SidebarButton active={view === "failures"} onClick={() => onChange("failures")}>
          Failures
        </SidebarButton>
        <SidebarButton active={view === "approved"} onClick={() => onChange("approved")}>
          Approved
        </SidebarButton>
      </nav>

      <div className="mt-8 flex-1 overflow-y-auto rounded-3xl border border-stone-200 bg-white/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Categories
          </h3>
          <button
            type="button"
            className="text-xs font-medium text-stone-600 hover:text-stone-900"
            onClick={() => onCategoryFilterChange({ category: "", subcategory: "", subsubcategory: "" })}
          >
            Clear
          </button>
        </div>

        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone-400">
          {formatCategoryFilter(categoryFilter)}
        </p>

        <form className="mt-4 space-y-3 rounded-3xl border border-stone-200 bg-stone-50 p-4" onSubmit={handleSubmit}>
          <div className="grid gap-3">
            <TextField
              label="Category"
              value={draft.category}
              onChange={(value) => setDraft((current) => ({ ...current, category: value }))}
            />
            <TextField
              label="Subcategory"
              value={draft.subcategory}
              onChange={(value) => setDraft((current) => ({ ...current, subcategory: value }))}
            />
            <TextField
              label="Subsubcategory"
              value={draft.subsubcategory}
              onChange={(value) => setDraft((current) => ({ ...current, subsubcategory: value }))}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-2xl bg-stone-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-stone-700 disabled:opacity-60"
            >
              {busyAction === "category-create" || busyAction === "category-rename"
                ? "Saving..."
                : submitLabel}
            </button>
            {isEditing ? (
              <button
                type="button"
                disabled={isBusy}
                className="rounded-2xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-stone-100 disabled:opacity-60"
                onClick={clearDraft}
              >
                Cancel
              </button>
            ) : null}
          </div>

          {message ? <p className="text-sm text-red-600">{message}</p> : null}
        </form>

        {categories.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">No categories returned by backend yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {categories.map((category) => {
              const active =
                categoryFilter.category === category.path.category &&
                categoryFilter.subcategory === category.path.subcategory &&
                categoryFilter.subsubcategory === category.path.subsubcategory;

              return (
                <div
                  key={category.id}
                  className={
                    "rounded-3xl border p-4 transition " +
                    (active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-900")
                  }
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => onCategoryFilterChange(category.path)}
                  >
                    <p className="text-sm font-semibold">{category.path.category}</p>
                    <p className="mt-1 text-sm opacity-80">{category.path.subcategory}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-70">
                      {category.path.subsubcategory}
                    </p>
                  </button>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition " +
                        (active
                          ? "bg-white/15 text-white hover:bg-white/20"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200")
                      }
                      onClick={() => onCategoryFilterChange(category.path)}
                    >
                      Use
                    </button>
                    <button
                      type="button"
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition " +
                        (active
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200")
                      }
                      onClick={() => loadDraft(category.path, category.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition " +
                        (active
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "bg-red-50 text-red-700 hover:bg-red-100")
                      }
                      disabled={isBusy}
                      onClick={() => void handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 rounded-3xl border border-dashed border-stone-300 bg-white/80 p-4 text-xs leading-6 text-stone-500">
          Item moves between categories happen from the item detail panel by changing the category
          path and saving or approving.
        </div>
      </div>

      <button
        type="button"
        className="mt-6 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 hover:bg-stone-100"
        onClick={onLoggedOut}
      >
        Logout
      </button>
    </aside>
  );
}

function SidebarButton(props: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={
        "w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition " +
        (props.active
          ? "bg-stone-900 text-white"
          : "border border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-100")
      }
    >
      {props.children}
    </button>
  );
}

function TextField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block font-medium text-stone-700">{props.label}</span>
      <input
        type="text"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
      />
    </label>
  );
}

function normalizeDraft(draft: CategoryDraft): CategoryPathRequest {
  return {
    category: draft.category.trim(),
    subcategory: draft.subcategory.trim(),
    subsubcategory: draft.subsubcategory.trim()
  };
}
function formatCategoryFilter(filter: CategoryPathFilter) {
  const parts = [filter.category, filter.subcategory, filter.subsubcategory].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "All categories";
}
