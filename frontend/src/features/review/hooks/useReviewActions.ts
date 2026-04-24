import { useQueryClient } from "@tanstack/react-query";
import {
  approveItem,
  editAndApproveItem,
  rejectItem,
  retryItem,
  trashItem,
  updateItem
} from "../api/reviewApi";
import type { UpdateItemRequest } from "../types/reviewTypes";

type Options = {
  setBusyAction: (action: string | null) => void;
  setSelectedItemId: (fn: (current: string | null) => string | null) => void;
};

export function useReviewActions({ setBusyAction, setSelectedItemId }: Options) {
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

  return {
    refreshAll,
    handleApprove: (itemId: string) =>
      runItemAction("approve", itemId, () => approveItem(itemId)),
    handleEditAndApprove: (itemId: string, request: UpdateItemRequest) =>
      runItemAction("edit-approve", itemId, () => editAndApproveItem(itemId, request)),
    handleSave: (itemId: string, request: UpdateItemRequest) =>
      runItemAction("save", itemId, () => updateItem(itemId, request), false),
    handleReject: (itemId: string) =>
      runItemAction("reject", itemId, () => rejectItem(itemId)),
    handleDelete: (itemId: string) =>
      runItemAction("delete", itemId, () => trashItem(itemId)),
    handleRetry: (itemId: string) =>
      runItemAction("retry", itemId, () => retryItem(itemId))
  };
}
