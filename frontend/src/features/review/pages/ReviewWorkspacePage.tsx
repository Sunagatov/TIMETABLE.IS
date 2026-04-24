import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveItem,
  createCategory,
  deleteCategory,
  editAndApproveItem,
  fetchApproved,
  fetchCategories,
  fetchFailures,
  fetchItem,
  fetchNeedsReview,
  renameCategory,
  rejectItem,
  retryItem,
  trashItem,
  updateItem
} from "../api/reviewApi";
import { ApprovedFiltersBar } from "../components/ApprovedFiltersBar";
import { ItemDetailPanel } from "../components/ItemDetailPanel";
import { ReviewQueueList } from "../components/ReviewQueueList";
import { ReviewSidebar } from "../components/ReviewSidebar";
import type {
  ApprovedSort,
  CategoryPathFilter,
  CreateCategoryRequest,
  MemoraItem,
  RenameCategoryRequest,
  UpdateItemRequest
} from "../types/reviewTypes";

type View = "needs-review" | "failures" | "approved";

type Props = {
  onLoggedOut: () => void | Promise<void>;
};

const EMPTY_CATEGORY_FILTER: CategoryPathFilter = {
  category: "",
  subcategory: "",
  subsubcategory: ""
};

export function ReviewWorkspacePage({ onLoggedOut }: Props) {
  const [view, setView] = useState<View>("needs-review");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [approvedKeyword, setApprovedKeyword] = useState("");
  const [approvedType, setApprovedType] = useState("ALL");
  const [approvedPriority, setApprovedPriority] = useState("ALL");
  const [approvedStatus, setApprovedStatus] = useState("ALL");
  const [approvedDateFrom, setApprovedDateFrom] = useState("");
  const [approvedDateTo, setApprovedDateTo] = useState("");
  const [approvedSort, setApprovedSort] = useState<ApprovedSort>("createdAt-desc");
  const [categoryFilter, setCategoryFilter] = useState<CategoryPathFilter>(EMPTY_CATEGORY_FILTER);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const needsReview = useQuery({
    queryKey: ["review", "needs-review"],
    queryFn: fetchNeedsReview
  });

  const failures = useQuery({
    queryKey: ["review", "failures"],
    queryFn: fetchFailures
  });

  const approved = useQuery({
    queryKey: ["review", "approved"],
    queryFn: fetchApproved
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  const baseItems =
    view === "needs-review"
      ? needsReview.data ?? []
      : view === "failures"
        ? failures.data ?? []
        : approved.data ?? [];

  const items = useMemo(() => {
    let nextItems = baseItems;

    if (view === "approved") {
      nextItems = nextItems.filter((item) => {
        if (approvedKeyword.trim()) {
          const keyword = approvedKeyword.trim().toLowerCase();
          const haystack = [
            item.title,
            item.cleanedText,
            item.rawTranscript ?? "",
            item.rawInputText ?? ""
          ]
            .join(" ")
            .toLowerCase();

          if (!haystack.includes(keyword)) {
            return false;
          }
        }

        if (approvedType !== "ALL" && item.type !== approvedType) {
          return false;
        }

        if (approvedPriority !== "ALL" && item.priority !== approvedPriority) {
          return false;
        }

        if (approvedStatus !== "ALL" && item.status !== approvedStatus) {
          return false;
        }

        if (!matchesCategoryFilter(item, categoryFilter)) {
          return false;
        }

        if (approvedDateFrom && new Date(item.createdAt) < startOfDay(approvedDateFrom)) {
          return false;
        }

        return !(approvedDateTo && new Date(item.createdAt) > endOfDay(approvedDateTo));


      });

      nextItems = [...nextItems].sort((left, right) => compareItems(left, right, approvedSort));
    }

    return nextItems;
  }, [
    approvedDateFrom,
    approvedDateTo,
    approvedKeyword,
    approvedPriority,
    approvedSort,
    approvedStatus,
    approvedType,
    baseItems,
    categoryFilter,
    view
  ]);

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

  const title =
    view === "needs-review" ? "Needs Review" : view === "failures" ? "Failures" : "Approved";

  const description =
    view === "needs-review"
      ? "Unapproved items waiting for human review."
      : view === "failures"
        ? "Items that failed at a processing stage and remain retryable."
        : "Human-approved items only. Search, filter, and sort stay within approved results.";

  const toolbar =
    view === "approved" ? (
      <ApprovedFiltersBar
        keyword={approvedKeyword}
        type={approvedType}
        priority={approvedPriority}
        status={approvedStatus}
        dateFrom={approvedDateFrom}
        dateTo={approvedDateTo}
        category={categoryFilter.category}
        subcategory={categoryFilter.subcategory}
        subsubcategory={categoryFilter.subsubcategory}
        sort={approvedSort}
        categories={categories.data ?? []}
        onKeywordChange={setApprovedKeyword}
        onTypeChange={setApprovedType}
        onPriorityChange={setApprovedPriority}
        onStatusChange={setApprovedStatus}
        onDateFromChange={setApprovedDateFrom}
        onDateToChange={setApprovedDateTo}
        onCategoryChange={handleCategoryChange}
        onSubcategoryChange={handleSubcategoryChange}
        onSubsubcategoryChange={handleSubsubcategoryChange}
        onSortChange={setApprovedSort}
        onResetFilters={resetApprovedFilters}
      />
    ) : null;

  async function refreshAll() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["review"] }),
      queryClient.invalidateQueries({ queryKey: ["item"] }),
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    ]);
  }

  async function runItemAction(
    action: string,
    itemId: string,
    handler: () => Promise<unknown>,
    clearSelection = true
  ) {
    setBusyAction(action);

    try {
      await handler();
      await refreshAll();
      if (clearSelection) {
        setSelectedItemId((current) => (current === itemId ? null : current));
      }
    } finally {
      setBusyAction(null);
    }
  }

  async function runCategoryAction(action: string, handler: () => Promise<unknown>) {
    setBusyAction(action);

    try {
      await handler();
      await refreshAll();
    } finally {
      setBusyAction(null);
    }
  }

  async function handleApprove(itemId: string) {
    await runItemAction("approve", itemId, () => approveItem(itemId));
  }

  async function handleEditAndApprove(itemId: string, request: UpdateItemRequest) {
    await runItemAction("edit-approve", itemId, () => editAndApproveItem(itemId, request));
  }

  async function handleSave(itemId: string, request: UpdateItemRequest) {
    await runItemAction("save", itemId, () => updateItem(itemId, request), false);
  }

  async function handleReject(itemId: string) {
    await runItemAction("reject", itemId, () => rejectItem(itemId));
  }

  async function handleDelete(itemId: string) {
    await runItemAction("delete", itemId, () => trashItem(itemId));
  }

  async function handleRetry(itemId: string) {
    await runItemAction("retry", itemId, () => retryItem(itemId));
  }

  async function handleCreateCategory(request: CreateCategoryRequest) {
    await runCategoryAction("category-create", () => createCategory(request));
  }

  async function handleRenameCategory(categoryId: string, request: RenameCategoryRequest) {
    const original = categories.data?.find((entry) => entry.id === categoryId)?.path ?? null;

    await runCategoryAction("category-rename", async () => {
      await renameCategory(categoryId, request);

      if (
        original &&
        categoryFilter.category === original.category &&
        categoryFilter.subcategory === original.subcategory &&
        categoryFilter.subsubcategory === original.subsubcategory
      ) {
        setCategoryFilter({
          category: request.path.category,
          subcategory: request.path.subcategory,
          subsubcategory: request.path.subsubcategory
        });
      }
    });
  }

  async function handleDeleteCategory(categoryId: string) {
    await runCategoryAction("category-delete", () => deleteCategory(categoryId));
  }

  function handleCategoryChange(category: string) {
    setCategoryFilter({
      category,
      subcategory: "",
      subsubcategory: ""
    });
  }

  function handleSubcategoryChange(subcategory: string) {
    setCategoryFilter((current) => ({
      ...current,
      subcategory,
      subsubcategory: ""
    }));
  }

  function handleSubsubcategoryChange(subsubcategory: string) {
    setCategoryFilter((current) => ({
      ...current,
      subsubcategory
    }));
  }

  function resetApprovedFilters() {
    setApprovedKeyword("");
    setApprovedType("ALL");
    setApprovedPriority("ALL");
    setApprovedStatus("ALL");
    setApprovedDateFrom("");
    setApprovedDateTo("");
    setApprovedSort("createdAt-desc");
    setCategoryFilter(EMPTY_CATEGORY_FILTER);
  }

  return (
    <main className="min-h-screen bg-[#f4efe6] text-stone-900">
      <div className="grid min-h-screen xl:grid-cols-[300px_420px_minmax(0,1fr)]">
        <ReviewSidebar
          view={view}
          onChange={setView}
          onLoggedOut={() => void onLoggedOut()}
          categories={categories.data ?? []}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
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

function matchesCategoryFilter(item: MemoraItem, filter: CategoryPathFilter) {
  return (
    (!filter.category || item.categoryPath.category === filter.category) &&
    (!filter.subcategory || item.categoryPath.subcategory === filter.subcategory) &&
    (!filter.subsubcategory || item.categoryPath.subsubcategory === filter.subsubcategory)
  );
}

function compareItems(left: MemoraItem, right: MemoraItem, sort: ApprovedSort) {
  if (sort === "createdAt-asc") {
    return left.createdAt.localeCompare(right.createdAt);
  }

  if (sort === "createdAt-desc") {
    return right.createdAt.localeCompare(left.createdAt);
  }

  if (sort === "title-asc") {
    return left.title.localeCompare(right.title);
  }

  if (sort === "title-desc") {
    return right.title.localeCompare(left.title);
  }

  const leftCategory = `${left.categoryPath.category}/${left.categoryPath.subcategory}/${left.categoryPath.subsubcategory}`;
  const rightCategory = `${right.categoryPath.category}/${right.categoryPath.subcategory}/${right.categoryPath.subsubcategory}`;

  return sort === "category-asc"
    ? leftCategory.localeCompare(rightCategory)
    : rightCategory.localeCompare(leftCategory);
}

function startOfDay(date: string) {
  return new Date(`${date}T00:00:00.000`);
}

function endOfDay(date: string) {
  return new Date(`${date}T23:59:59.999`);
}
