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
type MobilePanel = "sidebar" | "list" | "detail";

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
  const [actionError, setActionError] = useState<string | null>(null);
  const [nrFilters, setNrFilters] = useState<NeedsReviewFilters>(DEFAULT_NR_FILTERS);
  const [failFilters, setFailFilters] = useState<FailuresFilters>(DEFAULT_FAIL_FILTERS);
  const [approvedFilters, setApprovedFilters] = useState<ApprovedFilters>(DEFAULT_APPROVED_FILTERS);
  const [categoryFilter, setCategoryFilter] = useState<CategoryPathFilter>(EMPTY_CATEGORY_FILTER);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("list");
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

  const { handleApprove, handleEditAndApprove, handleSave, handleReject, handleDelete, handleRetry,
    handleApproveCategoryProposal, handleRejectCategoryProposal, handleRegenerateCleanedText,
    handleRegenerateAnswer, handleRegenerateCategoryProposal, handleRegenerateAll } =
    useReviewActions({ setBusyAction, setActionError, setSelectedItemId });

  async function runCategoryAction(action: string, handler: () => Promise<unknown>) {
    setBusyAction(action);
    setActionError(null);
    try {
      await handler();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["review"] }),
        queryClient.invalidateQueries({ queryKey: ["item"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] })
      ]);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed");
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

  function handleSelectItem(itemId: string) {
    setSelectedItemId(itemId);
    setMobilePanel("detail");
  }

  function handleViewChange(next: View) {
    setView(next);
    setMobilePanel("list");
  }

  const title =
    view === "needs-review" ? "Needs Review" : view === "failures" ? "Failures" : "Approved";

  const description =
    view === "needs-review"
      ? "Unapproved items waiting for human review."
      : view === "failures"
        ? "Items that failed at a processing stage and remain retryable."
      : "Human-approved items only.";

  const counts = {
    needsReview: needsReview.data?.length ?? 0,
    failures: failures.data?.length ?? 0,
    approved: approved.data?.length ?? 0
  };

  const activeCount =
    view === "needs-review" ? counts.needsReview
    : view === "failures" ? counts.failures
    : counts.approved;

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
    <main className="min-h-screen bg-[#f5f0e8] text-stone-900">
      <div className="lg:grid lg:h-screen lg:overflow-hidden lg:grid-cols-[220px_340px_minmax(0,1fr)]">
        <div className={`${mobilePanel === "sidebar" ? "flex" : "hidden"} lg:flex flex-col h-[calc(100dvh-4rem)] lg:h-screen`}>
          <ReviewSidebar
            view={view}
            onChange={handleViewChange}
            onLoggedOut={() => void onLoggedOut()}
            categories={categories.data ?? []}
            categoriesLoading={categories.isPending}
            categoriesError={categories.error instanceof Error ? categories.error.message : null}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={(f) => { handleCategoryFilterChange(f); setMobilePanel("list"); }}
            busyAction={busyAction}
            counts={counts}
            onCreateCategory={handleCreateCategory}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>

        <div className={`${mobilePanel === "list" ? "flex" : "hidden"} lg:flex flex-col h-[calc(100dvh-4rem)] lg:h-screen`}>
          <ReviewQueueList
            title={title}
            description={description}
            items={items}
            selectedItemId={selectedItemId}
            onSelect={handleSelectItem}
            toolbar={toolbar}
            view={view}
            isLoading={
              view === "needs-review"
                ? needsReview.isPending
                : view === "failures"
                  ? failures.isPending
                  : approved.isPending
            }
            errorMessage={
              (view === "needs-review" && needsReview.error instanceof Error
                ? needsReview.error.message
                : null) ??
              (view === "failures" && failures.error instanceof Error ? failures.error.message : null) ??
              (view === "approved" && approved.error instanceof Error ? approved.error.message : null)
            }
          />
        </div>

        <div className={`${mobilePanel === "detail" ? "flex" : "hidden"} lg:flex flex-col h-[calc(100dvh-4rem)] lg:h-screen`}>
          <ItemDetailPanel
            view={view}
            item={selectedItem.data}
            categories={categories.data ?? []}
            busyAction={busyAction}
            actionError={actionError}
            isLoading={selectedItem.isPending}
            errorMessage={selectedItem.error instanceof Error ? selectedItem.error.message : null}
            onApprove={handleApprove}
            onEditAndApprove={handleEditAndApprove}
            onSave={handleSave}
            onReject={handleReject}
            onDelete={handleDelete}
            onRetry={handleRetry}
            onApproveCategoryProposal={handleApproveCategoryProposal}
            onRejectCategoryProposal={handleRejectCategoryProposal}
            onRegenerateCleanedText={handleRegenerateCleanedText}
            onRegenerateAnswer={handleRegenerateAnswer}
            onRegenerateCategoryProposal={handleRegenerateCategoryProposal}
            onRegenerateAll={handleRegenerateAll}
            onMobileBack={() => setMobilePanel("list")}
          />
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch border-t border-stone-200/80 bg-white/96 shadow-[0_-1px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm lg:hidden">
        <MobileNavTab
          active={mobilePanel === "sidebar"}
          onClick={() => setMobilePanel("sidebar")}
        >
          <MenuIcon />
          <span>Menu</span>
        </MobileNavTab>
        <MobileNavTab
          active={mobilePanel === "list"}
          onClick={() => setMobilePanel("list")}
        >
          <ListIcon />
          <span>{title}{activeCount > 0 ? ` · ${activeCount}` : ""}</span>
        </MobileNavTab>
        <MobileNavTab
          active={mobilePanel === "detail"}
          onClick={() => { if (selectedItemId) setMobilePanel("detail"); }}
          disabled={!selectedItemId}
        >
          <DetailIcon />
          <span>Detail</span>
        </MobileNavTab>
      </nav>
    </main>
  );
}

function MobileNavTab({
  active,
  onClick,
  disabled,
  children
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-medium transition ${
        active
          ? "text-amber-600"
          : disabled
            ? "cursor-default text-stone-300"
            : "text-stone-500 hover:text-stone-800"
      }`}
    >
      {children}
    </button>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="3" y1="5" x2="17" y2="5" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="15" x2="17" y2="15" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="4" width="14" height="3" rx="1" />
      <rect x="3" y="9" width="14" height="3" rx="1" />
      <rect x="3" y="14" width="14" height="3" rx="1" />
    </svg>
  );
}

function DetailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <line x1="7" y1="8" x2="13" y2="8" />
      <line x1="7" y1="11" x2="13" y2="11" />
      <line x1="7" y1="14" x2="10" y2="14" />
    </svg>
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
