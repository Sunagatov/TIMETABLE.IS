import { useEffect } from "react";
import { ItemDetailPanel } from "../components/ItemDetailPanel";
import { ReviewQueueList } from "../components/ReviewQueueList";
import { uniqueSorted } from "../components/FilterControls";
import { useReviewActions } from "../hooks/useReviewActions";
import { useReviewQueries } from "../hooks/useReviewQueries";
import { useReviewWorkspaceState } from "../hooks/useReviewWorkspaceState";
import type { ReviewView } from "../reviewViewMeta";
import type {
  ApprovedFilters,
  FailuresFilters,
  NeedsReviewFilters,
} from "../types/reviewTypes";

type Props = {
  onLoggedOut: () => void | Promise<void>;
};

export function ReviewWorkspacePage({ onLoggedOut }: Props) {
  const state = useReviewWorkspaceState();
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

  const counts = {
    needsReview: queries.needsReview.data?.length ?? 0,
    failures: queries.failures.data?.length ?? 0,
    approved: queries.approved.data?.length ?? 0
  };

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

  const categoryOptions = uniqueSorted(
    (queries.categories.data ?? []).map((category) => category.path.category)
  );

  return (
    <ReviewQueueList
      items={items}
      selectedItemId={state.selectedItemId}
      onSelect={state.setSelectedItemId}
      view={state.view}
      counts={counts}
      onViewChange={state.setView}
      onLoggedOut={() => void onLoggedOut()}
      isLoading={listQuery.isPending}
      errorMessage={listQuery.error instanceof Error ? listQuery.error.message : null}
      searchValue={activeFilters.keyword}
      onSearchChange={(v) => patchActiveFilters({ keyword: v })}
      typeFilter={activeFilters.type}
      onTypeFilterChange={(v) => patchActiveFilters({ type: v })}
      sortValue={activeFilters.sort}
      onSortChange={(v) => patchActiveFilters({ sort: v })}
      categoryValue={activeFilters.category}
      onCategoryChange={(v) => patchActiveFilters({ category: v, subcategory: "" })}
      categoryOptions={categoryOptions}
      renderDetail={
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
          embedded
        />
      }
      renderDesktopDetail={
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
        />
      }
    />
  );
}

function getItemsForView(view: ReviewView, queries: ReturnType<typeof useReviewQueries>) {
  if (view === "needs-review") return queries.needsReview.data ?? [];
  if (view === "failures") return queries.failures.data ?? [];
  return queries.approved.data ?? [];
}

function getListQueryForView(view: ReviewView, queries: ReturnType<typeof useReviewQueries>) {
  if (view === "needs-review") return queries.needsReview;
  if (view === "failures") return queries.failures;
  return queries.approved;
}
