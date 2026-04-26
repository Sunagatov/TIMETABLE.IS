import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { readableErrorMessage } from "../../../shared/api/httpClient";
import { createCategory, deleteCategory, renameCategory } from "../api/reviewApi";
import { ApprovedFiltersBar } from "../components/ApprovedFiltersBar";
import { FailuresFiltersBar } from "../components/FailuresFiltersBar";
import { ItemDetailPanel } from "../components/ItemDetailPanel";
import { NeedsReviewFiltersBar } from "../components/NeedsReviewFiltersBar";
import { ReviewQueueList } from "../components/ReviewQueueList";
import { ReviewSidebar } from "../components/ReviewSidebar";
import { CategoryManager } from "../components/sidebar/CategoryManager";
import { MobileBottomNav } from "../components/workspace/MobileBottomNav";
import { WorkspaceColumn } from "../components/workspace/WorkspaceColumn";
import { useReviewActions } from "../hooks/useReviewActions";
import { useReviewQueries } from "../hooks/useReviewQueries";
import {
  DEFAULT_APPROVED_FILTERS,
  DEFAULT_FAIL_FILTERS,
  DEFAULT_NR_FILTERS,
  useReviewWorkspaceState
} from "../hooks/useReviewWorkspaceState";
import { REVIEW_VIEW_META, type ReviewView } from "../reviewViewMeta";
import type { ApprovedFilters, CategoryPathFilter, CreateCategoryRequest, FailuresFilters, NeedsReviewFilters, RenameCategoryRequest } from "../types/reviewTypes";

type Props = {
  onLoggedOut: () => void | Promise<void>;
};

export function ReviewWorkspacePage({ onLoggedOut }: Props) {
  const state = useReviewWorkspaceState();
  const queryClient = useQueryClient();
  const queries = useReviewQueries({
    nrParams: state.nrParams,
    failParams: state.failParams,
    approvedParams: state.approvedParams,
    selectedItemId: state.selectedItemId
  });
  const actions = useReviewActions({
    setBusyAction: state.setBusyAction,
    setActionError: state.setActionError,
    setSelectedItemId: state.setSelectedItemId
  });
  const items = getItemsForView(state.view, queries);
  const listQuery = getListQueryForView(state.view, queries);
  const viewMeta = REVIEW_VIEW_META[state.view];

  useEffect(() => {
    if (!items.length) {
      state.setSelectedItemId(null);
      return;
    }
    if (!state.selectedItemId || !items.some((item) => item.id === state.selectedItemId)) {
      state.setSelectedItemId(items[0].id);
    }
  }, [items, state.selectedItemId, state.setSelectedItemId]);

  useEffect(() => {
    state.setActionError(null);
  }, [state.view, state.selectedItemId, state.setActionError]);

  async function runCategoryAction(action: string, handler: () => Promise<unknown>) {
    state.setBusyAction(action);
    state.setActionError(null);
    try {
      await handler();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["review"] }),
        queryClient.invalidateQueries({ queryKey: ["item"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] })
      ]);
    } catch (error) {
      state.setActionError(readableErrorMessage(error));
      throw error;
    } finally {
      state.setBusyAction(null);
    }
  }

  const counts = {
    needsReview: queries.needsReview.data?.length ?? 0,
    failures: queries.failures.data?.length ?? 0,
    approved: queries.approved.data?.length ?? 0
  };
  const activeCount = countForView(state.view, counts);

  const activeFilters =
    state.view === "needs-review"
      ? state.nrFilters
      : state.view === "failures"
        ? state.failFilters
        : state.approvedFilters;

  function patchActiveFilters(patch: Record<string, string>) {
    if (state.view === "needs-review") {
      state.setNrFilters({ ...state.nrFilters, ...patch } as NeedsReviewFilters);
    } else if (state.view === "failures") {
      state.setFailFilters({ ...state.failFilters, ...patch } as FailuresFilters);
    } else {
      state.setApprovedFilters({ ...state.approvedFilters, ...patch } as ApprovedFilters);
    }
  }

  const hasSecondaryFilters =
    activeFilters.category !== "" ||
    activeFilters.subcategory !== "" ||
    activeFilters.priority !== "ALL" ||
    activeFilters.createdFrom !== "" ||
    activeFilters.createdTo !== "" ||
    ("status" in activeFilters && activeFilters.status !== "ALL");

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-stone-900">
      {state.mobilePanel === "sidebar" ? (
        <div className="flex h-[calc(100dvh-4rem)] flex-col lg:hidden">
          <ReviewSidebar
            onLoggedOut={() => void onLoggedOut()}
            categories={queries.categories.data ?? []}
            categoryFilter={state.activeCategoryFilter}
            onCategoryFilterChange={state.setActiveCategoryFilter}
            busyAction={state.busyAction}
            onCreateCategory={(request) => runCategoryAction("category-create", () => createCategory(request))}
            onRenameCategory={(categoryId, request) => handleRenameCategory(categoryId, request, state.activeCategoryFilter, state.setActiveCategoryFilter)}
            onDeleteCategory={(categoryId) => runCategoryAction("category-delete", () => deleteCategory(categoryId))}
          />
        </div>
      ) : null}

      <div className="lg:grid lg:h-screen lg:grid-cols-[minmax(420px,520px)_minmax(0,1fr)] lg:overflow-hidden">

        <WorkspaceColumn panel="list" activePanel={state.mobilePanel}>
          <ReviewQueueList
            items={items}
            selectedItemId={state.selectedItemId}
            onSelect={(itemId) => { state.setSelectedItemId(itemId); state.setMobilePanel("detail"); }}
            toolbar={renderToolbarForView(state, queries.categories.data ?? [], {
              busyAction: state.busyAction,
              categoryFilter: state.activeCategoryFilter,
              onCategoryFilterChange: state.setActiveCategoryFilter,
              onCreateCategory: (request) => runCategoryAction("category-create", () => createCategory(request)),
              onRenameCategory: (categoryId, request) => handleRenameCategory(categoryId, request, state.activeCategoryFilter, state.setActiveCategoryFilter),
              onDeleteCategory: (categoryId) => runCategoryAction("category-delete", () => deleteCategory(categoryId))
            })}
            view={state.view}
            counts={counts}
            onViewChange={(view) => state.setView(view)}
            isLoading={listQuery.isPending}
            errorMessage={listQuery.error instanceof Error ? listQuery.error.message : null}
            searchValue={activeFilters.keyword}
            onSearchChange={(v) => patchActiveFilters({ keyword: v })}
            typeFilter={activeFilters.type}
            onTypeFilterChange={(v) => patchActiveFilters({ type: v })}
            sortValue={activeFilters.sort}
            onSortChange={(v) => patchActiveFilters({ sort: v })}
            hasSecondaryFilters={hasSecondaryFilters}
          />
        </WorkspaceColumn>

        <WorkspaceColumn panel="detail" activePanel={state.mobilePanel}>
          <ItemDetailPanel
            view={state.view}
            item={queries.selectedItem.data}
            categories={queries.categories.data ?? []}
            busyAction={state.busyAction}
            actionError={state.actionError}
            isLoading={queries.selectedItem.isPending}
            errorMessage={queries.selectedItem.error instanceof Error ? queries.selectedItem.error.message : null}
            onApprove={actions.handleApprove}
            onEditAndApprove={actions.handleEditAndApprove}
            onSave={actions.handleSave}
            onReject={actions.handleReject}
            onDelete={actions.handleDelete}
            onRetry={actions.handleRetry}
            onApproveCategoryProposal={actions.handleApproveCategoryProposal}
            onRejectCategoryProposal={actions.handleRejectCategoryProposal}
            onRegenerateCleanedText={actions.handleRegenerateCleanedText}
            onRegenerateAnswer={actions.handleRegenerateAnswer}
            onRegenerateCategoryProposal={actions.handleRegenerateCategoryProposal}
            onRegenerateAll={actions.handleRegenerateAll}
            onMobileBack={() => state.setMobilePanel("list")}
          />
        </WorkspaceColumn>
      </div>
      <MobileBottomNav
        panel={state.mobilePanel}
        title={viewMeta.title}
        activeCount={activeCount}
        hasSelectedItem={Boolean(state.selectedItemId)}
        onChange={state.setMobilePanel}
      />
    </main>
  );

  async function handleRenameCategory(categoryId: string, request: RenameCategoryRequest, activeFilter: CategoryPathFilter, setActiveFilter: (next: CategoryPathFilter) => void) {
    const original = queries.categories.data?.find((category) => category.id === categoryId)?.path ?? null;
    await runCategoryAction("category-rename", async () => {
      await renameCategory(categoryId, request);
      if (original && sameFilter(activeFilter, original)) setActiveFilter(request.path);
    });
  }
}

function sameFilter(left: CategoryPathFilter, right: CategoryPathFilter): boolean {
  return left.category === right.category &&
    left.subcategory === right.subcategory;
}

function countForView(
  view: ReviewView,
  counts: { needsReview: number; failures: number; approved: number }
): number {
  if (view === "needs-review") return counts.needsReview;
  if (view === "failures") return counts.failures;
  return counts.approved;
}

function getItemsForView(
  view: ReviewView,
  queries: ReturnType<typeof useReviewQueries>
) {
  if (view === "needs-review") return queries.needsReview.data ?? [];
  if (view === "failures") return queries.failures.data ?? [];
  return queries.approved.data ?? [];
}

function getListQueryForView(
  view: ReviewView,
  queries: ReturnType<typeof useReviewQueries>
) {
  if (view === "needs-review") return queries.needsReview;
  if (view === "failures") return queries.failures;
  return queries.approved;
}

function renderToolbarForView(
  state: ReturnType<typeof useReviewWorkspaceState>,
  categories: ReturnType<typeof useReviewQueries>["categories"]["data"] extends infer T
    ? NonNullable<T>
    : never,
  categoryManagerProps: {
    busyAction: string | null;
    categoryFilter: CategoryPathFilter;
    onCategoryFilterChange: (next: CategoryPathFilter) => void;
    onCreateCategory: (request: CreateCategoryRequest) => Promise<void>;
    onRenameCategory: (categoryId: string, request: RenameCategoryRequest) => Promise<void>;
    onDeleteCategory: (categoryId: string) => Promise<void>;
  }
) {
  const view = state.view;
  const filters = view === "needs-review"
    ? (
      <NeedsReviewFiltersBar
        filters={state.nrFilters}
        categories={categories}
        onChange={state.setNrFilters}
        onReset={() => state.setNrFilters(DEFAULT_NR_FILTERS)}
      />
    )
    : view === "failures"
      ? (
        <FailuresFiltersBar
          filters={state.failFilters}
          categories={categories}
          onChange={state.setFailFilters}
          onReset={() => state.setFailFilters(DEFAULT_FAIL_FILTERS)}
        />
      )
      : (
        <ApprovedFiltersBar
          filters={state.approvedFilters}
          categories={categories}
          onChange={state.setApprovedFilters}
          onReset={() => state.setApprovedFilters(DEFAULT_APPROVED_FILTERS)}
        />
      );

  return (
    <div className="space-y-4">
      {filters}
      <details className="group rounded-[1.35rem] border border-stone-200 bg-stone-50/70">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-stone-700">
          <span>Category tools</span>
          <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500 transition group-open:border-stone-300 group-open:text-stone-800">
            Manage
          </span>
        </summary>
        <div className="border-t border-stone-200 px-4 py-4">
          <CategoryManager
            categories={categories}
            categoryFilter={categoryManagerProps.categoryFilter}
            onCategoryFilterChange={categoryManagerProps.onCategoryFilterChange}
            busyAction={categoryManagerProps.busyAction}
            onCreateCategory={categoryManagerProps.onCreateCategory}
            onRenameCategory={categoryManagerProps.onRenameCategory}
            onDeleteCategory={categoryManagerProps.onDeleteCategory}
            tone="light"
          />
        </div>
      </details>
    </div>
  );
}
