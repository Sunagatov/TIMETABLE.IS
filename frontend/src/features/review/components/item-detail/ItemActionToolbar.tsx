import type { UpdateItemRequest } from "../../types/reviewTypes";
import type { DetailView } from "./itemDetailUtils";
import { CheckIcon, GhostBtn, PencilIcon, RetryIcon, ToolbarBtn } from "./DetailPrimitives";

type Props = {
  view: DetailView;
  itemId: string;
  editOpen: boolean;
  busyAction: string | null;
  actionError: string | null;
  request: UpdateItemRequest;
  onToggleEdit: () => void;
  onApprove: (itemId: string) => Promise<void>;
  onEditAndApprove: (itemId: string, request: UpdateItemRequest) => Promise<void>;
  onSave: (itemId: string, request: UpdateItemRequest) => Promise<void>;
  onReject: (itemId: string) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
  onRetry: (itemId: string) => Promise<void>;
  onRegenerateCleanedText: (itemId: string) => Promise<void>;
  onRegenerateCategoryProposal: (itemId: string) => Promise<void>;
  onRegenerateAll: (itemId: string) => Promise<void>;
};

export function ItemActionToolbar(props: Props) {
  const busy = props.busyAction !== null;
  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-stone-100 bg-white/97 backdrop-blur-sm">
      {props.actionError && (
        <div className="border-b border-red-100 bg-red-50 px-5 py-2 text-xs text-red-700">
          {props.actionError}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 px-5 py-3">
        {props.view === "needs-review" && (
          <>
            <ToolbarBtn tone="approve" busy={props.busyAction === "approve"} disabled={busy} onClick={() => void props.onApprove(props.itemId)}>
              <CheckIcon /> Approve
            </ToolbarBtn>
            <ToolbarBtn tone="edit" busy={props.busyAction === "edit-approve" && props.editOpen} disabled={busy && !props.editOpen} onClick={props.onToggleEdit}>
              <PencilIcon /> {props.editOpen ? "Cancel edit" : "Edit & Approve"}
            </ToolbarBtn>
            <ToolbarBtn tone="neutral" busy={props.busyAction === "reject"} disabled={busy} onClick={() => confirmAction("Reject this item?") && void props.onReject(props.itemId)}>
              Reject
            </ToolbarBtn>
            <ToolbarBtn tone="danger" busy={props.busyAction === "delete"} disabled={busy} onClick={() => confirmAction("Delete this item to trash?") && void props.onDelete(props.itemId)}>
              Delete
            </ToolbarBtn>
            <RegenerationButtons {...props} busy={busy} includeCategory />
          </>
        )}

        {props.view === "failures" && (
          <>
            <ToolbarBtn tone="approve" busy={props.busyAction === "retry"} disabled={busy} onClick={() => void props.onRetry(props.itemId)}>
              <RetryIcon /> Retry Processing
            </ToolbarBtn>
            <ToolbarBtn tone="danger" busy={props.busyAction === "delete"} disabled={busy} onClick={() => confirmAction("Delete this failed item to trash?") && void props.onDelete(props.itemId)}>
              Delete
            </ToolbarBtn>
          </>
        )}

        {props.view === "approved" && (
          <>
            <ToolbarBtn tone={props.editOpen ? "neutral" : "edit"} busy={false} disabled={false} onClick={props.onToggleEdit}>
              <PencilIcon /> {props.editOpen ? "Cancel edit" : "Edit item"}
            </ToolbarBtn>
            {props.editOpen && (
              <ToolbarBtn tone="approve" busy={props.busyAction === "save"} disabled={busy} onClick={() => void props.onSave(props.itemId, props.request)}>
                Save Changes
              </ToolbarBtn>
            )}
            <RegenerationButtons {...props} busy={busy} />
          </>
        )}
      </div>
    </div>
  );
}

function RegenerationButtons(props: Props & { busy: boolean; includeCategory?: boolean }) {
  return (
    <div className="ml-auto flex items-center gap-1">
      <GhostBtn busy={props.busyAction === "regen-all"} disabled={props.busy} onClick={() => void props.onRegenerateAll(props.itemId)}>Regen All</GhostBtn>
      <GhostBtn busy={props.busyAction === "regen-cleaned"} disabled={props.busy} onClick={() => void props.onRegenerateCleanedText(props.itemId)}>Regen Text</GhostBtn>
      {props.includeCategory && (
        <GhostBtn busy={props.busyAction === "regen-category"} disabled={props.busy} onClick={() => void props.onRegenerateCategoryProposal(props.itemId)}>Regen Category</GhostBtn>
      )}
    </div>
  );
}

function confirmAction(message: string): boolean {
  return window.confirm(message);
}
