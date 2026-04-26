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
};

type Props = {
  categories: MemoraCategory[];
  categoryFilter: CategoryPathFilter;
  onCategoryFilterChange: (next: CategoryPathFilter) => void;
  busyAction: string | null;
  onCreateCategory: (request: CreateCategoryRequest) => Promise<void>;
  onRenameCategory: (categoryId: string, request: RenameCategoryRequest) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  tone?: "dark" | "light";
};

export function CategoryManager(props: Props) {
  const [draft, setDraft] = useState<CategoryDraft>({ category: "", subcategory: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const isEditing = editingCategoryId !== null;
  const isBusy = props.busyAction !== null;
  const tone = props.tone ?? "light";

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
        props.onCategoryFilterChange({ category: "", subcategory: "" });
      }
      if (editingCategoryId === categoryId) clearDraft();
    } catch (error) {
      setMessage(readableErrorMessage(error, "Delete failed"));
    }
  }

  return (
    <div className="space-y-3">
      <CategoryForm
        draft={draft}
        setDraft={setDraft}
        isBusy={isBusy}
        isEditing={isEditing}
        busyAction={props.busyAction}
        message={message}
        tone={tone}
        onSubmit={handleSubmit}
        onCancel={clearDraft}
      />
      <CategoryPathList
        categories={props.categories}
        isBusy={isBusy}
        tone={tone}
        onEdit={(category) => loadDraft(category.path, category.id)}
        onDelete={(categoryId) => void handleDelete(categoryId)}
      />
    </div>
  );

  function loadDraft(path: CategoryPathRequest, categoryId: string) {
    setEditingCategoryId(categoryId);
    setDraft({ category: path.category, subcategory: path.subcategory });
    setMessage(null);
  }

  function clearDraft() {
    setEditingCategoryId(null);
    setDraft({ category: "", subcategory: "" });
  }
}

function CategoryForm(props: {
  draft: CategoryDraft;
  setDraft: React.Dispatch<React.SetStateAction<CategoryDraft>>;
  isBusy: boolean;
  isEditing: boolean;
  busyAction: string | null;
  message: string | null;
  tone: "dark" | "light";
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  const primaryButtonClass = props.tone === "dark"
    ? "rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60"
    : "rounded-xl bg-stone-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60";
  const secondaryButtonClass = props.tone === "dark"
    ? "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-stone-400 transition hover:bg-white/10 disabled:opacity-60"
    : "rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-600 transition hover:border-stone-300 hover:text-stone-900 disabled:opacity-60";

  return (
    <form className="space-y-2.5" onSubmit={props.onSubmit}>
      <DraftField tone={props.tone} label="Category" value={props.draft.category} onChange={(category) => props.setDraft((draft) => ({ ...draft, category }))} />
      <DraftField tone={props.tone} label="Subcategory" value={props.draft.subcategory} onChange={(subcategory) => props.setDraft((draft) => ({ ...draft, subcategory }))} />
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" disabled={props.isBusy} className={primaryButtonClass}>
          {props.busyAction === "category-create" || props.busyAction === "category-rename" ? "Saving..." : props.isEditing ? "Rename" : "Create"}
        </button>
        {props.isEditing && (
          <button type="button" disabled={props.isBusy} className={secondaryButtonClass} onClick={props.onCancel}>
            Cancel
          </button>
        )}
      </div>
      {props.message && <p className={`text-xs ${props.tone === "dark" ? "text-red-400" : "text-red-600"}`}>{props.message}</p>}
    </form>
  );
}

function CategoryPathList(props: {
  categories: MemoraCategory[];
  isBusy: boolean;
  tone: "dark" | "light";
  onEdit: (category: MemoraCategory) => void;
  onDelete: (categoryId: string) => void;
}) {
  if (!props.categories.length) return null;
  const labelClass = props.tone === "dark"
    ? "text-stone-600"
    : "text-stone-500";
  const rowClass = props.tone === "dark"
    ? "rounded-lg border border-white/8 bg-white/4 px-3 py-2"
    : "rounded-xl border border-stone-200 bg-white px-3 py-2.5";
  const textClass = props.tone === "dark"
    ? "truncate text-xs text-stone-400"
    : "truncate text-xs text-stone-700";
  const editClass = props.tone === "dark"
    ? "text-[11px] font-medium text-stone-500 transition hover:text-stone-200"
    : "text-[11px] font-medium text-stone-600 transition hover:text-stone-900";

  return (
    <div className="space-y-1.5 pt-1">
      <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${labelClass}`}>All paths</p>
      {props.categories.map((category) => (
        <div key={category.id} className={rowClass}>
          <p className={textClass}>{category.path.category} / {category.path.subcategory}</p>
          <div className="mt-1.5 flex gap-3">
            <button type="button" className={editClass} onClick={() => props.onEdit(category)}>Edit</button>
            <button type="button" disabled={props.isBusy} className="text-[11px] font-medium text-red-500/70 transition hover:text-red-400 disabled:opacity-50" onClick={() => props.onDelete(category.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DraftField(props: { label: string; value: string; onChange: (value: string) => void; tone: "dark" | "light" }) {
  const labelClass = props.tone === "dark"
    ? "block text-xs text-stone-500"
    : "block text-xs text-stone-500";
  const inputClass = props.tone === "dark"
    ? "w-full rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-stone-200 outline-none transition focus:border-amber-500/50 focus:bg-white/10"
    : "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none transition focus:border-stone-400 focus:bg-stone-50";

  return (
    <label className={labelClass}>
      <span className="mb-1 block font-medium uppercase tracking-[0.14em] text-stone-500">{props.label}</span>
      <input type="text" value={props.value} onChange={(event) => props.onChange(event.target.value)} className={inputClass} />
    </label>
  );
}

function trimDraft(draft: CategoryDraft): CategoryPathRequest {
  return {
    category: draft.category.trim(),
    subcategory: draft.subcategory.trim()
  };
}

function validatePath(path: CategoryPathRequest): string | null {
  if (!path.category || !path.subcategory) {
    return "Category and subcategory are required.";
  }
  return null;
}

function sameFilter(left: CategoryPathFilter, right: CategoryPathRequest): boolean {
  return left.category === right.category &&
    left.subcategory === right.subcategory;
}
