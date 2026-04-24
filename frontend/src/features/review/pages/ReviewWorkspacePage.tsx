import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveItem,
  editAndApproveItem,
  fetchApproved,
  fetchCategories,
  fetchFailures,
  fetchItem,
  fetchNeedsReview,
  rejectItem,
  retryItem,
  trashItem,
  updateItem
} from "../api/reviewApi";
import { ApprovedFiltersBar } from "../components/ApprovedFiltersBar";
import { ItemDetailPanel } from "../components/ItemDetailPanel";
import { ReviewQueueList } from "../components/ReviewQueueList";
import { ReviewSidebar } from "../components/ReviewSidebar";
import type { ApprovedSort, MemoraItem, UpdateItemRequest } from "../types/reviewTypes";

type View = "needs-review" | "failures" | "approved";

type Props = {
  onLoggedOut: () => void | Promise<void>;
};

export function ReviewWorkspacePage({ onLoggedOut }: Props) {
  const [view, setView] = useState<View>("needs-review");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [approvedKeyword, setApprovedKeyword] = useState("");
  const [approvedType, setApprovedType] = useState("ALL");
  const [approvedPriority, setApprovedPriority] = useState("ALL");
  const [approvedSort, setApprovedSort] = useState<ApprovedSort>("createdAt-desc");
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

  const selectedCategory = categories.data?.find((entry) => entry.id === selectedCategoryId) ?? null;

  const items = useMemo(() => {
    let nextItems = baseItems;

    if (selectedCategory) {
      nextItems = nextItems.filter(
        (item) =>
          item.categoryPath.category === selectedCategory.path.category &&
          item.categoryPath.subcategory === selectedCategory.path.subcategory &&
          item.categoryPath.subsubcategory === selectedCategory.path.subsubcategory
      );
    }

    if (view !== "approved") {
      return nextItems;
    }

    const keyword = approvedKeyword.trim().toLowerCase();

    nextItems = nextItems.filter((item) => {
      if (approvedType !== "ALL" && item.type !== approvedType) {
        return false;
      }

      if (approvedPriority !== "ALL" && item.priority !== approvedPriority) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const haystack = [
        item.title,
        item.cleanedText,
        item.rawTranscript ?? "",
        item.rawInputText ?? ""
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });

    return [...nextItems].sort((left, right) => compareItems(left, right, approvedSort));
  }, [approvedKeyword, approvedPriority, approvedSort, approvedType, baseItems, selectedCategory, view]);

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
        sort={approvedSort}
        onKeywordChange={setApprovedKeyword}
        onTypeChange={setApprovedType}
        onPriorityChange={setApprovedPriority}
        onSortChange={setApprovedSort}
      />
    ) : null;

  async function refreshAll() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["review"] }),
      queryClient.invalidateQueries({ queryKey: ["item"] }),
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    ]);
  }

  async function runAction(action: string, itemId: string, handler: () => Promise<unknown>) {
    setBusyAction(action);

    try {
      await handler();
      await refreshAll();

      if (selectedItemId === itemId) {
        setSelectedItemId(null);
      }
    } finally {
      setBusyAction(null);
    }
  }

  async function handleApprove(itemId: string) {
    await runAction("approve", itemId, () => approveItem(itemId));
  }

  async function handleEditAndApprove(itemId: string, request: UpdateItemRequest) {
    await runAction("edit-approve", itemId, () => editAndApproveItem(itemId, request));
  }

  async function handleSave(itemId: string, request: UpdateItemRequest) {
    await runAction("save", itemId, () => updateItem(itemId, request));
  }

  async function handleReject(itemId: string) {
    await runAction("reject", itemId, () => rejectItem(itemId));
  }

  async function handleDelete(itemId: string) {
    await runAction("delete", itemId, () => trashItem(itemId));
  }

  async function handleRetry(itemId: string) {
    await runAction("retry", itemId, () => retryItem(itemId));
  }

  return (
    <main className="min-h-screen bg-[#f4efe6] text-stone-900">
      <div className="grid min-h-screen xl:grid-cols-[300px_420px_minmax(0,1fr)]">
        <ReviewSidebar
          view={view}
          onChange={setView}
          onLoggedOut={() => void onLoggedOut()}
          categories={categories.data ?? []}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
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
