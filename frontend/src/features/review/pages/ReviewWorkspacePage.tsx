import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  fetchApproved,
  fetchCategories,
  fetchFailures,
  fetchItem,
  fetchNeedsReview,
  renameCategory
} from "../api/reviewApi";
import { ApprovedFiltersBar } from "../components/ApprovedFiltersBar";
import { FailuresFiltersBar } from "../components/FailuresFiltersBar";
import { ItemDetailPanel } from "../components/ItemDetailPanel";
import { NeedsReviewFiltersBar } from "../components/NeedsReviewFiltersBar";
import { ReviewQueueList } from "../components/ReviewQueueList";
import { ReviewSidebar } from "../components/ReviewSidebar";
import { useReviewActions } from "../hooks/useReviewActions";
import type {
  ApprovedFilters,
  CategoryPathFilter,
  CreateCategoryRequest,
  FailuresFilters,
  ListParams,
  NeedsReviewFilters,
  RenameCategoryRequest
} from "../types/reviewTypes";

type View = "needs-review" | "failures" | "approved";

type Props = {
  onLoggedOut: () => void | Promise<void>;
};

const DEFAULT_NR_FILTERS: NeedsReviewFilters = {
  keyword: "",
  type: "ALL",
  priority: "ALL",
  category: "",
  subcategory: "",
  subsubcategory: "",
  createdFrom: "",
  createdTo: "",
  sort: "createdAt-desc"
};

const DEFAULT_FAIL_FILTERS: FailuresFilters = {
  keyword: "",
  category: "",
  subcategory: "",
  subsubcategory: "",
  createdFrom: "",
  createdTo: ""
};

const DEFAULT_APPROVED_FILTERS: ApprovedFilters = {
  keyword: "",
  type: "ALL",
  priority: "ALL",
  status: "ALL",
  category: "",
  subcategory: "",
  subsubcategory: "",
  createdFrom: "",
  createdTo: "",
  sort: "createdAt-desc"
};

const EMPTY_CATEGORY_FILTER: CategoryPathFilter = { category: "", subcategory: "", subsubcategory: "" };

export function ReviewWorkspacePage({ onLoggedOut }: Props) {
  const [view, setView] = useState<View>("needs-review");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [nrFilters, setNrFilters] = useState<NeedsReviewFilters>(DEFAULT_NR_FILTERS);
  const [failFilters, setFailFilters] = useState<FailuresFilters>(DEFAULT_FAIL_FILTERS);
  const [approvedFilters, setApprovedFilters] = useState<ApprovedFilters>(DEFAULT_APPROVED_FILTERS);
  const [categoryFilter, setCategoryFilter] = useState<CategoryPathFilter>(EMPTY_CATEGORY_FILTER);
  const queryClient = useQueryClient();

  const nrParams = toListParams(nrFilters);
  const failParams = toListParams(failFilters);
  const approvedParams = toListParams(approvedFilters);

  const needsReview = useQuery({
    queryKey: ["review", "needs-review", nrParams],
    queryFn: () => fetchNeedsReview(nrParams)
  });

  const failures = useQuery({
    queryKey: ["review", "failures", failParams],
    queryFn: () => fetchFailures(failParams)
  });

  const approved = useQuery({
    queryKey: ["review", "approved", approvedParams],
    queryFn: () => fetchApproved(approvedParams)
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  const items =
    view === "needs-review"
      ? needsReview.data ?? []
      : view === "failures"
        ? failures.data ?? []
        : approved.data ?? [];

  useEffect(() => {
    if (!items.length) {
      setSelectedItemId(null);
      return;
    }
    if (!selectedItemId || !items.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  const selectedItem = useQuery({
    queryKey: ["item", selectedItemId],
    queryFn: () => fetchItem(selectedItemId!),
    enabled: Boolean(selectedItemId)
  });

  const { handleApprove, handleEditAndApprove, handleSave, handleReject, handleDelete, handleRetry} =
    useReviewActions({ setBusyAction, setSelectedItemId });

  async function runCategoryAction(action: string, handler: () => Promise<unknown>) {
    setBusyAction(action);
    try {
      await handler();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["review"] }),
        queryClient.invalidateQueries({ queryKey: ["item"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] })
      ]);
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCreateCategory(request: CreateCategoryRequest) {
    await runCategoryAction("category-create", () => createCategory(request));
  }

  async function handleRenameCategory(categoryId: string, request: RenameCategoryRequest) {
    const original = categories.data?.find((c) => c.id === categoryId)?.path ?? null;
    await runCategoryAction("category-rename", async () => {
      await renameCategory(categoryId, request);
      if (
        original &&
        categoryFilter.category === original.category &&
        categoryFilter.subcategory === original.subcategory &&
        categoryFilter.subsubcategory === original.subsubcategory
      ) {
        setCategoryFilter(request.path);
      }
    });
  }

  async function handleDeleteCategory(categoryId: string) {
    await runCategoryAction("category-delete", () => deleteCategory(categoryId));
  }

  function handleCategoryFilterChange(next: CategoryPathFilter) {
    setCategoryFilter(next);
    if (view === "needs-review") {
      setNrFilters((f) => ({ ...f, category: next.category, subcategory: next.subcategory, subsubcategory: next.subsubcategory }));
    } else if (view === "failures") {
      setFailFilters((f) => ({ ...f, category: next.category, subcategory: next.subcategory, subsubcategory: next.subsubcategory }));
    } else {
      setApprovedFilters((f) => ({ ...f, category: next.category, subcategory: next.subcategory, subsubcategory: next.subsubcategory }));
    }
  }

  const title =
    view === "needs-review" ? "Needs Review" : view === "failures" ? "Failures" : "Approved";

  const description =
    view === "needs-review"
      ? "Unapproved items waiting for human review."
      : view === "failures"
        ? "Items that failed at a processing stage and remain retryable."
        : "Human-approved items only.";

  const toolbar =
    view === "needs-review" ? (
      <NeedsReviewFiltersBar
        filters={nrFilters}
        categories={categories.data ?? []}
        onChange={setNrFilters}
        onReset={() => setNrFilters(DEFAULT_NR_FILTERS)}
      />
    ) : view === "failures" ? (
      <FailuresFiltersBar
        filters={failFilters}
        categories={categories.data ?? []}
        onChange={setFailFilters}
        onReset={() => setFailFilters(DEFAULT_FAIL_FILTERS)}
      />
    ) : (
      <ApprovedFiltersBar
        filters={approvedFilters}
        categories={categories.data ?? []}
        onChange={setApprovedFilters}
        onReset={() => setApprovedFilters(DEFAULT_APPROVED_FILTERS)}
      />
    );

  return (
    <main className="min-h-screen bg-[#f4efe6] text-stone-900">
      <div className="grid min-h-screen xl:grid-cols-[300px_420px_minmax(0,1fr)]">
        <ReviewSidebar
          view={view}
          onChange={setView}
          onLoggedOut={() => void onLoggedOut()}
          categories={categories.data ?? []}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
          busyAction={busyAction}
          onCreateCategory={handleCreateCategory}
          onRenameCategory={handleRenameCategory}
          onDeleteCategory={handleDeleteCategory}
        />
        <ReviewQueueList
          title={title}
          description={description}
          items={items}
          selectedItemId={selectedItemId}
          onSelect={setSelectedItemId}
          toolbar={toolbar}
          view={view}
        />
        <ItemDetailPanel
          view={view}
          item={selectedItem.data}
          categories={categories.data ?? []}
          busyAction={busyAction}
          onApprove={handleApprove}
          onEditAndApprove={handleEditAndApprove}
          onSave={handleSave}
          onReject={handleReject}
          onDelete={handleDelete}
          onRetry={handleRetry}
        />
      </div>
    </main>
  );
}

function toListParams(filters: Record<string, string>): ListParams {
  const params: ListParams = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== "ALL") {
      (params as Record<string, string>)[key] = value;
    }
  }
  return params;
}
