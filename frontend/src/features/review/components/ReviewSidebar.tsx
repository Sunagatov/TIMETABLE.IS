import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { CategoryTree } from "./CategoryTree";
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
  categoriesLoading: boolean;
  categoriesError: string | null;
  categoryFilter: CategoryPathFilter;
  onCategoryFilterChange: (next: CategoryPathFilter) => void;
  busyAction: string | null;
  counts: {
    needsReview: number;
    failures: number;
    approved: number;
  };
  onCreateCategory: (request: CreateCategoryRequest) => Promise<void>;
  onRenameCategory: (categoryId: string, request: RenameCategoryRequest) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
};

export function ReviewSidebar({
  view,
  onChange,
  onLoggedOut,
  categories,
  categoriesLoading,
  categoriesError,
  categoryFilter,
  onCategoryFilterChange,
  busyAction,
  counts,
  onCreateCategory,
  onRenameCategory,
  onDeleteCategory
}: Props) {
  const [manageOpen, setManageOpen] = useState(false);
  const [draft, setDraft] = useState<CategoryDraft>({ category: "", subcategory: "", subsubcategory: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isEditing = editingCategoryId !== null;
  const isBusy = busyAction !== null;

  function loadDraft(path: CategoryPathRequest, categoryId: string) {
    setEditingCategoryId(categoryId);
    setDraft({ category: path.category, subcategory: path.subcategory, subsubcategory: path.subsubcategory });
    setMessage(null);
    setManageOpen(true);
  }

  function clearDraft() {
    setEditingCategoryId(null);
    setDraft({ category: "", subcategory: "", subsubcategory: "" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const nextPath = { category: draft.category.trim(), subcategory: draft.subcategory.trim(), subsubcategory: draft.subsubcategory.trim() };

    try {
      if (isEditing && editingCategoryId) {
        await onRenameCategory(editingCategoryId, { path: nextPath });
        const target = categories.find((c) => c.id === editingCategoryId);
        if (target && categoryFilter.category === target.path.category && categoryFilter.subcategory === target.path.subcategory && categoryFilter.subsubcategory === target.path.subsubcategory) {
          onCategoryFilterChange(nextPath);
        }
      } else {
        await onCreateCategory({ path: nextPath });
      }
      clearDraft();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed");
    }
  }

  async function handleDelete(categoryId: string) {
    const target = categories.find((c) => c.id === categoryId);
    if (!target) return;
    setMessage(null);
    try {
      await onDeleteCategory(categoryId);
      if (categoryFilter.category === target.path.category && categoryFilter.subcategory === target.path.subcategory && categoryFilter.subsubcategory === target.path.subsubcategory) {
        onCategoryFilterChange({ category: "", subcategory: "", subsubcategory: "" });
      }
      if (editingCategoryId === categoryId) clearDraft();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed");
    }
  }

  return (
    <aside className="flex h-screen flex-col border-r border-stone-200 bg-[#f6f1e8]">
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Memora</p>
        <h2 className="mt-3 text-xl font-semibold text-stone-900">Review workspace</h2>
      </div>

      <nav className="px-5 space-y-2">
        <SidebarButton active={view === "needs-review"} onClick={() => onChange("needs-review")}>
          <span>Needs Review</span>
          <span className="text-xs opacity-80">{counts.needsReview}</span>
        </SidebarButton>
        <SidebarButton active={view === "failures"} onClick={() => onChange("failures")}>
          <span>Failures</span>
          <span className="text-xs opacity-80">{counts.failures}</span>
        </SidebarButton>
        <SidebarButton active={view === "approved"} onClick={() => onChange("approved")}>
          <span>Approved</span>
          <span className="text-xs opacity-80">{counts.approved}</span>
        </SidebarButton>
      </nav>

      <div className="mt-5 flex-1 overflow-y-auto px-5">
        <div className="rounded-3xl border border-stone-200 bg-white/80 p-4">
          <CategoryTree
            categories={categories}
            loading={categoriesLoading}
            errorMessage={categoriesError}
            filter={categoryFilter}
            onSelect={onCategoryFilterChange}
            onClearFilter={() => onCategoryFilterChange({ category: "", subcategory: "", subsubcategory: "" })}
          />
        </div>

        <div className="mt-3 rounded-3xl border border-stone-200 bg-white/80">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-stone-700"
            onClick={() => setManageOpen((o) => !o)}
          >
            <span>Manage categories</span>
            <span className="text-xs text-stone-400">{manageOpen ? "▲" : "▼"}</span>
          </button>

          {manageOpen && (
            <div className="border-t border-stone-200 p-4 space-y-4">
              <form className="space-y-3" onSubmit={handleSubmit}>
                <DraftField label="Category" value={draft.category} onChange={(v) => setDraft((d) => ({ ...d, category: v }))} />
                <DraftField label="Subcategory" value={draft.subcategory} onChange={(v) => setDraft((d) => ({ ...d, subcategory: v }))} />
                <DraftField label="Subsubcategory" value={draft.subsubcategory} onChange={(v) => setDraft((d) => ({ ...d, subsubcategory: v }))} />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="rounded-2xl bg-stone-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-stone-700 disabled:opacity-60"
                  >
                    {busyAction === "category-create" || busyAction === "category-rename"
                      ? "Saving..."
                      : isEditing
                        ? "Rename"
                        : "Create"}
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

              {categories.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                    All paths
                  </p>
                  {categories.map((cat) => (
                    <div key={cat.id} className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2">
                      <p className="text-xs text-stone-700 truncate">
                        {cat.path.category} / {cat.path.subcategory} / {cat.path.subsubcategory}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          className="text-xs font-medium text-stone-600 hover:text-stone-900"
                          onClick={() => loadDraft(cat.path, cat.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                          onClick={() => void handleDelete(cat.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <button
          type="button"
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 hover:bg-stone-100"
          onClick={onLoggedOut}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarButton(props: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={
        "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition " +
        (props.active
          ? "bg-stone-900 text-white"
          : "border border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-100")
      }
    >
      {props.children}
    </button>
  );
}

function DraftField(props: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs text-stone-600">
      <span className="mb-1 block font-medium text-stone-700">{props.label}</span>
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none transition focus:border-stone-900"
      />
    </label>
  );
}
