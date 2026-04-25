import { useQueryClient } from "@tanstack/react-query";
import { readableErrorMessage } from "../../../shared/api/httpClient";
import {
  approveItem,
  approveCategoryProposal,
  editAndApproveItem,
  rejectItem,
  rejectCategoryProposal,
  regenerateAnswer,
  regenerateAll,
  regenerateCategoryProposal,
  regenerateCleanedText,
  retryItem,
  trashItem,
  updateItem
} from "../api/reviewApi";
import type { UpdateItemRequest } from "../types/reviewTypes";

type Options = {
  setBusyAction: (action: string | null) => void;
  setActionError: (message: string | null) => void;
  setSelectedItemId: (fn: (current: string | null) => string | null) => void;
};

export function useReviewActions({ setBusyAction, setActionError, setSelectedItemId }: Options) {
  const queryClient = useQueryClient();

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
    setActionError(null);
    try {
      await handler();
      await refreshAll();
      if (clearSelection) {
        setSelectedItemId((current) => (current === itemId ? null : current));
      }
    } catch (error) {
      setActionError(readableErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  return {
    refreshAll,
    handleApprove: (itemId: string) =>
      runItemAction("approve", itemId, () => approveItem(itemId)),
    handleEditAndApprove: (itemId: string, request: UpdateItemRequest) =>
      runItemAction("edit-approve", itemId, () => editAndApproveItem(itemId, request)),
    handleSave: (itemId: string, request: UpdateItemRequest) =>
      runItemAction("save", itemId, () => updateItem(itemId, request), false),
    handleApproveCategoryProposal: (itemId: string) =>
      runItemAction("category-approve", itemId, () => approveCategoryProposal(itemId), false),
    handleRejectCategoryProposal: (itemId: string) =>
      runItemAction("category-reject", itemId, () => rejectCategoryProposal(itemId), false),
    handleReject: (itemId: string) =>
      runItemAction("reject", itemId, () => rejectItem(itemId)),
    handleDelete: (itemId: string) =>
      runItemAction("delete", itemId, () => trashItem(itemId)),
    handleRetry: (itemId: string) =>
      runItemAction("retry", itemId, () => retryItem(itemId)),
    handleRegenerateCleanedText: (itemId: string) =>
      runItemAction("regen-cleaned", itemId, () => regenerateCleanedText(itemId), false),
    handleRegenerateAnswer: (itemId: string) =>
      runItemAction("regen-answer", itemId, () => regenerateAnswer(itemId), false),
    handleRegenerateCategoryProposal: (itemId: string) =>
      runItemAction("regen-category", itemId, () => regenerateCategoryProposal(itemId), false),
    handleRegenerateAll: (itemId: string) =>
      runItemAction("regen-all", itemId, () => regenerateAll(itemId), false)
  };
}
