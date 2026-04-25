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
import type { CategoryPathFilter, RenameCategoryRequest } from "../types/reviewTypes";

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

  const items =
    state.view === "needs-review"
      ? queries.needsReview.data ?? []
      : state.view === "failures"
        ? queries.failures.data ?? []
        : queries.approved.data ?? [];

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
  const title = state.view === "needs-review" ? "Needs Review" : state.view === "failures" ? "Failures" : "Approved";
  const listQuery = currentListQuery();
  const description =
    state.view === "needs-review"
      ? "Unapproved items waiting for human review."
      : state.view === "failures"
        ? "Items that failed at a processing stage and remain retryable."
        : "Human-approved items only.";
  const activeCount = state.view === "needs-review" ? counts.needsReview : state.view === "failures" ? counts.failures : counts.approved;

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-stone-900">
      <div className="lg:grid lg:h-screen lg:grid-cols-[220px_340px_minmax(0,1fr)] lg:overflow-hidden">
        <WorkspaceColumn panel="sidebar" activePanel={state.mobilePanel}>
          <ReviewSidebar
            view={state.view}
            onChange={(view) => { state.setView(view); state.setMobilePanel("list"); }}
            onLoggedOut={() => void onLoggedOut()}
            categories={queries.categories.data ?? []}
            categoriesLoading={queries.categories.isPending}
            categoriesError={queries.categories.error instanceof Error ? queries.categories.error.message : null}
            categoryFilter={state.activeCategoryFilter}
            onCategoryFilterChange={(filter) => { state.setActiveCategoryFilter(filter); state.setMobilePanel("list"); }}
            busyAction={state.busyAction}
            counts={counts}
            onCreateCategory={(request) => runCategoryAction("category-create", () => createCategory(request))}
            onRenameCategory={(categoryId, request) => handleRenameCategory(categoryId, request, state.activeCategoryFilter, state.setActiveCategoryFilter)}
            onDeleteCategory={(categoryId) => runCategoryAction("category-delete", () => deleteCategory(categoryId))}
          />
        </WorkspaceColumn>

        <WorkspaceColumn panel="list" activePanel={state.mobilePanel}>
          <ReviewQueueList
            title={title}
            description={description}
            items={items}
            selectedItemId={state.selectedItemId}
            onSelect={(itemId) => { state.setSelectedItemId(itemId); state.setMobilePanel("detail"); }}
            toolbar={renderToolbar()}
            view={state.view}
            isLoading={listQuery.isPending}
            errorMessage={listQuery.error instanceof Error ? listQuery.error.message : null}
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
        title={title}
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

  function renderToolbar() {
    const categories = queries.categories.data ?? [];
    if (state.view === "needs-review") {
      return <NeedsReviewFiltersBar filters={state.nrFilters} categories={categories} onChange={state.setNrFilters} onReset={() => state.setNrFilters(DEFAULT_NR_FILTERS)} />;
    }
    if (state.view === "failures") {
      return <FailuresFiltersBar filters={state.failFilters} categories={categories} onChange={state.setFailFilters} onReset={() => state.setFailFilters(DEFAULT_FAIL_FILTERS)} />;
    }
    return <ApprovedFiltersBar filters={state.approvedFilters} categories={categories} onChange={state.setApprovedFilters} onReset={() => state.setApprovedFilters(DEFAULT_APPROVED_FILTERS)} />;
  }

  function currentListQuery() {
    return state.view === "needs-review" ? queries.needsReview : state.view === "failures" ? queries.failures : queries.approved;
  }
}

function sameFilter(left: CategoryPathFilter, right: CategoryPathFilter): boolean {
  return left.category === right.category &&
    left.subcategory === right.subcategory &&
    left.subsubcategory === right.subsubcategory;
}
