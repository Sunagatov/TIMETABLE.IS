import { useState } from "react";
import type { FormEvent } from "react";
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
    const nextPath = {
      category: draft.category.trim(),
      subcategory: draft.subcategory.trim(),
      subsubcategory: draft.subsubcategory.trim()
    };

    try {
      if (isEditing && editingCategoryId) {
        await onRenameCategory(editingCategoryId, { path: nextPath });
        const target = categories.find((c) => c.id === editingCategoryId);
        if (
          target &&
          categoryFilter.category === target.path.category &&
          categoryFilter.subcategory === target.path.subcategory &&
          categoryFilter.subsubcategory === target.path.subsubcategory
        ) {
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
      if (
        categoryFilter.category === target.path.category &&
        categoryFilter.subcategory === target.path.subcategory &&
        categoryFilter.subsubcategory === target.path.subsubcategory
      ) {
        onCategoryFilterChange({ category: "", subcategory: "", subsubcategory: "" });
      }
      if (editingCategoryId === categoryId) clearDraft();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed");
    }
  }

  return (
    <aside className="flex h-full flex-col bg-[#111110]">
      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-stone-950">
          M
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-stone-100">Memora</p>
          <p className="text-[11px] leading-tight text-stone-500">Review workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-0.5">
        <NavItem
          active={view === "needs-review"}
          onClick={() => onChange("needs-review")}
          icon={<InboxIcon />}
          label="Needs Review"
          count={counts.needsReview}
          countColor="amber"
        />
        <NavItem
          active={view === "failures"}
          onClick={() => onChange("failures")}
          icon={<AlertIcon />}
          label="Failures"
          count={counts.failures}
          countColor="red"
        />
        <NavItem
          active={view === "approved"}
          onClick={() => onChange("approved")}
          icon={<CheckIcon />}
          label="Approved"
          count={counts.approved}
          countColor="emerald"
        />
      </nav>

      <div className="mx-3 mt-4 border-t border-white/8" />

      {/* Category tree */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <CategoryTree
          categories={categories}
          loading={categoriesLoading}
          errorMessage={categoriesError}
          filter={categoryFilter}
          onSelect={onCategoryFilterChange}
          onClearFilter={() => onCategoryFilterChange({ category: "", subcategory: "", subsubcategory: "" })}
          dark
        />

        {/* Manage categories */}
        <div className="mt-3">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 hover:bg-white/5 transition"
            onClick={() => setManageOpen((o) => !o)}
          >
            <span>Manage categories</span>
            <span className="text-stone-600">{manageOpen ? "▲" : "▼"}</span>
          </button>

          {manageOpen && (
            <div className="mt-2 rounded-xl border border-white/8 bg-white/5 p-3 space-y-3">
              <form className="space-y-2.5" onSubmit={handleSubmit}>
                <DarkDraftField
                  label="Category"
                  value={draft.category}
                  onChange={(v) => setDraft((d) => ({ ...d, category: v }))}
                />
                <DarkDraftField
                  label="Subcategory"
                  value={draft.subcategory}
                  onChange={(v) => setDraft((d) => ({ ...d, subcategory: v }))}
                />
                <DarkDraftField
                  label="Subsubcategory"
                  value={draft.subsubcategory}
                  onChange={(v) => setDraft((d) => ({ ...d, subsubcategory: v }))}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60"
                  >
                    {busyAction === "category-create" || busyAction === "category-rename"
                      ? "Saving…"
                      : isEditing
                        ? "Rename"
                        : "Create"}
                  </button>
                  {isEditing ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-stone-400 transition hover:bg-white/10 disabled:opacity-60"
                      onClick={clearDraft}
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
                {message ? <p className="text-xs text-red-400">{message}</p> : null}
              </form>

              {categories.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                    All paths
                  </p>
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="rounded-lg border border-white/8 bg-white/4 px-3 py-2"
                    >
                      <p className="truncate text-xs text-stone-400">
                        {cat.path.category} / {cat.path.subcategory} / {cat.path.subsubcategory}
                      </p>
                      <div className="mt-1.5 flex gap-3">
                        <button
                          type="button"
                          className="text-[11px] font-medium text-stone-500 hover:text-stone-200 transition"
                          onClick={() => loadDraft(cat.path, cat.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          className="text-[11px] font-medium text-red-500/70 hover:text-red-400 transition disabled:opacity-50"
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

      {/* Footer */}
      <div className="px-3 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 transition hover:bg-white/5 hover:text-stone-300"
          onClick={onLoggedOut}
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  active,
  onClick,
  icon,
  label,
  count,
  countColor
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  countColor: "amber" | "red" | "emerald";
}) {
  const countClass =
    countColor === "amber"
      ? "bg-amber-500/20 text-amber-400"
      : countColor === "red"
        ? "bg-red-500/20 text-red-400"
        : "bg-emerald-500/20 text-emerald-400";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
        active
          ? "bg-white/10 text-stone-100"
          : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
      }`}
    >
      <span className={active ? "text-stone-200" : "text-stone-600"}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {count > 0 ? (
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${countClass}`}>
          {count}
        </span>
      ) : null}
    </button>
  );
}

function DarkDraftField(props: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs text-stone-500">
      <span className="mb-1 block font-medium text-stone-400">{props.label}</span>
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-stone-200 placeholder-stone-600 outline-none transition focus:border-amber-500/50 focus:bg-white/10"
      />
    </label>
  );
}

function InboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10H6L7 12H9L10 10H14" />
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5L1.5 13.5H14.5L8 1.5Z" />
      <line x1="8" y1="6.5" x2="8" y2="9.5" />
      <circle cx="8" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <polyline points="5 8 7.5 10.5 11.5 6.5" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2.5H13a1 1 0 011 1v9a1 1 0 01-1 1H10" />
      <polyline points="7 11 10 8 7 5" />
      <line x1="10" y1="8" x2="2" y2="8" />
    </svg>
  );
}
