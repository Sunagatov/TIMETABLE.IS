import type { ReactNode } from "react";
import type { UpdateItemRequest } from "../../types/reviewTypes";
import type { DetailView } from "./itemDetailUtils";
import { CheckIcon, GhostBtn, PencilIcon, RetryIcon, ToolbarBtn } from "./DetailPrimitives";

type Props = {
  view: DetailView;
  itemId: string;
  editOpen: boolean;
  busyAction: string | null;
  actionError: string | null;
  validationError: string | null;
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

export function ItemActionAlerts(props: Pick<Props, "actionError" | "validationError" | "editOpen">) {
  return (
    <>
      {props.actionError && (
        <div className="border-b border-red-100 bg-red-50 px-6 py-2 text-xs text-red-700">
          {props.actionError}
        </div>
      )}
      {props.validationError && props.editOpen && (
        <div className="border-b border-amber-100 bg-amber-50 px-6 py-2 text-xs text-amber-800">
          {props.validationError}
        </div>
      )}
    </>
  );
}

export function ItemHeaderActions(props: Props) {
  const busy = props.busyAction !== null;

  return (
    <div className="flex items-center gap-1">
      {props.view !== "failures" && (
        <HeaderActionBtn
          busy={props.busyAction === "edit-approve" && props.editOpen}
          disabled={busy && !props.editOpen}
          onClick={props.onToggleEdit}
        >
          <PencilIcon /> {props.editOpen ? "Close editor" : "Edit"}
        </HeaderActionBtn>
      )}
      <SecondaryActionsMenu {...props} busy={busy} includeCategory={props.view === "needs-review"} />
    </div>
  );
}

export function ItemFooterActions(props: Props & { embedded?: boolean }) {
  const busy = props.busyAction !== null;

  if (props.view === "approved" && !props.editOpen) return null;

  return (
    <div className={props.embedded
      ? "flex items-center justify-end gap-2 border-t border-stone-100 px-6 py-4"
      : "sticky bottom-0 z-10 mt-auto bg-gradient-to-t from-white via-white/96 to-transparent px-6 pb-5 pt-8"
    }>
      <div className="flex items-center justify-end gap-2">
        {props.editOpen && props.view !== "failures" && (
          <ToolbarBtn tone="neutral" busy={false} disabled={busy} onClick={props.onToggleEdit}>
            Cancel
          </ToolbarBtn>
        )}
        {props.view === "needs-review" && !props.editOpen && (
          <ToolbarBtn tone="approve" busy={props.busyAction === "approve"} disabled={busy} onClick={() => void props.onApprove(props.itemId)}>
            <CheckIcon /> Approve
          </ToolbarBtn>
        )}
        {props.view === "needs-review" && props.editOpen && (
          <ToolbarBtn tone="approve" busy={props.busyAction === "edit-approve"} disabled={busy || Boolean(props.validationError)} onClick={() => void props.onEditAndApprove(props.itemId, props.request)}>
            <CheckIcon /> Save & Approve
          </ToolbarBtn>
        )}
        {props.view === "approved" && props.editOpen && (
          <ToolbarBtn tone="approve" busy={props.busyAction === "save"} disabled={busy || Boolean(props.validationError)} onClick={() => void props.onSave(props.itemId, props.request)}>
            Save
          </ToolbarBtn>
        )}
        {props.view === "failures" && (
          <ToolbarBtn tone="approve" busy={props.busyAction === "retry"} disabled={busy} onClick={() => void props.onRetry(props.itemId)}>
            <RetryIcon /> Retry
          </ToolbarBtn>
        )}
      </div>
    </div>
  );
}

function SecondaryActionsMenu(props: Props & { busy: boolean; includeCategory?: boolean }) {
  return (
    <details className="relative">
      <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
        <span className="sr-only">More actions</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="8" r="1.25" />
          <circle cx="8" cy="8" r="1.25" />
          <circle cx="13" cy="8" r="1.25" />
        </svg>
      </summary>
      <div className="absolute right-0 z-20 mt-2 flex min-w-[190px] flex-col items-stretch gap-1 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg shadow-stone-200/60">
        {(props.view === "needs-review" || props.view === "failures") && (
          <GhostBtn busy={props.busyAction === "delete"} disabled={props.busy} onClick={() => confirmAction(props.view === "failures" ? "Delete this failed item to trash?" : "Delete this item to trash?") && void props.onDelete(props.itemId)}>
            Delete
          </GhostBtn>
        )}
        {props.view === "needs-review" && (
          <>
            <GhostBtn busy={props.busyAction === "reject"} disabled={props.busy} onClick={() => confirmAction("Reject this item?") && void props.onReject(props.itemId)}>
              Reject
            </GhostBtn>
            <GhostBtn busy={props.busyAction === "regen-cleaned"} disabled={props.busy} onClick={() => void props.onRegenerateCleanedText(props.itemId)}>Regenerate text</GhostBtn>
            {props.includeCategory && (
              <GhostBtn busy={props.busyAction === "regen-category"} disabled={props.busy} onClick={() => void props.onRegenerateCategoryProposal(props.itemId)}>Regenerate category</GhostBtn>
            )}
            <GhostBtn busy={props.busyAction === "regen-all"} disabled={props.busy} onClick={() => void props.onRegenerateAll(props.itemId)}>Regenerate all</GhostBtn>
          </>
        )}
        {props.view === "approved" && (
          <>
            <GhostBtn busy={props.busyAction === "regen-cleaned"} disabled={props.busy} onClick={() => void props.onRegenerateCleanedText(props.itemId)}>Regenerate text</GhostBtn>
            <GhostBtn busy={props.busyAction === "regen-all"} disabled={props.busy} onClick={() => void props.onRegenerateAll(props.itemId)}>Regenerate all</GhostBtn>
          </>
        )}
      </div>
    </details>
  );
}

function HeaderActionBtn(props: {
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={props.busy || props.disabled}
      onClick={props.onClick}
      className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
    >
      {props.busy ? "..." : props.children}
    </button>
  );
}

function confirmAction(message: string): boolean {
  return window.confirm(message);
}
