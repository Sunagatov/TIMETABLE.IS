import { useState } from "react";
import type { FormEvent } from "react";
import type {
  CategoryPathFilter,
  CategoryPathRequest,
  CreateCategoryRequest,
  MemoraCategory,
  RenameCategoryRequest
} from "../../types/reviewTypes";
import { readableErrorMessage } from "../../../../shared/api/httpClient";

type CategoryDraft = {
  category: string;
  subcategory: string;
  subsubcategory: string;
};

type Props = {
  categories: MemoraCategory[];
  categoryFilter: CategoryPathFilter;
  onCategoryFilterChange: (next: CategoryPathFilter) => void;
  busyAction: string | null;
  onCreateCategory: (request: CreateCategoryRequest) => Promise<void>;
  onRenameCategory: (categoryId: string, request: RenameCategoryRequest) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
};

export function CategoryManager(props: Props) {
  const [manageOpen, setManageOpen] = useState(false);
  const [draft, setDraft] = useState<CategoryDraft>({ category: "", subcategory: "", subsubcategory: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const isEditing = editingCategoryId !== null;
  const isBusy = props.busyAction !== null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const nextPath = trimDraft(draft);
    const validationError = validatePath(nextPath);
    if (validationError) {
      setMessage(validationError);
      return;
    }
    try {
      if (isEditing && editingCategoryId) {
        await props.onRenameCategory(editingCategoryId, { path: nextPath });
      } else {
        await props.onCreateCategory({ path: nextPath });
      }
      clearDraft();
    } catch (error) {
      setMessage(readableErrorMessage(error, "Failed"));
    }
  }

  async function handleDelete(categoryId: string) {
    const target = props.categories.find((category) => category.id === categoryId);
    if (!target || !window.confirm("Delete this category path?")) return;
    setMessage(null);
    try {
      await props.onDeleteCategory(categoryId);
      if (sameFilter(props.categoryFilter, target.path)) {
        props.onCategoryFilterChange({ category: "", subcategory: "", subsubcategory: "" });
      }
      if (editingCategoryId === categoryId) clearDraft();
    } catch (error) {
      setMessage(readableErrorMessage(error, "Delete failed"));
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 transition hover:bg-white/5"
        onClick={() => setManageOpen((open) => !open)}
      >
        <span>Manage categories</span>
        <span className="text-stone-600">{manageOpen ? "▲" : "▼"}</span>
      </button>
      {manageOpen && (
        <div className="mt-2 space-y-3 rounded-xl border border-white/8 bg-white/5 p-3">
          <CategoryForm
            draft={draft}
            setDraft={setDraft}
            isBusy={isBusy}
            isEditing={isEditing}
            busyAction={props.busyAction}
            message={message}
            onSubmit={handleSubmit}
            onCancel={clearDraft}
          />
          <CategoryPathList
            categories={props.categories}
            isBusy={isBusy}
            onEdit={(category) => loadDraft(category.path, category.id)}
            onDelete={(categoryId) => void handleDelete(categoryId)}
          />
        </div>
      )}
    </div>
  );

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
}

function CategoryForm(props: {
  draft: CategoryDraft;
  setDraft: React.Dispatch<React.SetStateAction<CategoryDraft>>;
  isBusy: boolean;
  isEditing: boolean;
  busyAction: string | null;
  message: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form className="space-y-2.5" onSubmit={props.onSubmit}>
      <DarkDraftField label="Category" value={props.draft.category} onChange={(category) => props.setDraft((draft) => ({ ...draft, category }))} />
      <DarkDraftField label="Subcategory" value={props.draft.subcategory} onChange={(subcategory) => props.setDraft((draft) => ({ ...draft, subcategory }))} />
      <DarkDraftField label="Subsubcategory" value={props.draft.subsubcategory} onChange={(subsubcategory) => props.setDraft((draft) => ({ ...draft, subsubcategory }))} />
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" disabled={props.isBusy} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60">
          {props.busyAction === "category-create" || props.busyAction === "category-rename" ? "Saving..." : props.isEditing ? "Rename" : "Create"}
        </button>
        {props.isEditing && (
          <button type="button" disabled={props.isBusy} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-stone-400 transition hover:bg-white/10 disabled:opacity-60" onClick={props.onCancel}>
            Cancel
          </button>
        )}
      </div>
      {props.message && <p className="text-xs text-red-400">{props.message}</p>}
    </form>
  );
}

function CategoryPathList(props: {
  categories: MemoraCategory[];
  isBusy: boolean;
  onEdit: (category: MemoraCategory) => void;
  onDelete: (categoryId: string) => void;
}) {
  if (!props.categories.length) return null;
  return (
    <div className="space-y-1.5 pt-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-600">All paths</p>
      {props.categories.map((category) => (
        <div key={category.id} className="rounded-lg border border-white/8 bg-white/4 px-3 py-2">
          <p className="truncate text-xs text-stone-400">{category.path.category} / {category.path.subcategory} / {category.path.subsubcategory}</p>
          <div className="mt-1.5 flex gap-3">
            <button type="button" className="text-[11px] font-medium text-stone-500 transition hover:text-stone-200" onClick={() => props.onEdit(category)}>Edit</button>
            <button type="button" disabled={props.isBusy} className="text-[11px] font-medium text-red-500/70 transition hover:text-red-400 disabled:opacity-50" onClick={() => props.onDelete(category.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DarkDraftField(props: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs text-stone-500">
      <span className="mb-1 block font-medium text-stone-400">{props.label}</span>
      <input type="text" value={props.value} onChange={(event) => props.onChange(event.target.value)} className="w-full rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-stone-200 outline-none transition focus:border-amber-500/50 focus:bg-white/10" />
    </label>
  );
}

function trimDraft(draft: CategoryDraft): CategoryPathRequest {
  return {
    category: draft.category.trim(),
    subcategory: draft.subcategory.trim(),
    subsubcategory: draft.subsubcategory.trim()
  };
}

function validatePath(path: CategoryPathRequest): string | null {
  if (!path.category || !path.subcategory || !path.subsubcategory) {
    return "Category, subcategory, and subsubcategory are all required.";
  }
  return null;
}

function sameFilter(left: CategoryPathFilter, right: CategoryPathRequest): boolean {
  return left.category === right.category &&
    left.subcategory === right.subcategory &&
    left.subsubcategory === right.subsubcategory;
}
