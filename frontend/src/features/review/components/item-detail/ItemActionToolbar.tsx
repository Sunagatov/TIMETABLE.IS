import { useEffect, useRef, useState } from "react";
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
          active={props.editOpen}
          shortcut="E"
        >
          <PencilIcon /> {props.editOpen ? "Editing" : "Edit"}
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
          <>
            <ToolbarBtn
              tone="danger"
              busy={props.busyAction === "reject"}
              disabled={busy}
              onClick={() => confirmAction("Reject this item?") && void props.onReject(props.itemId)}
            >
              Reject
            </ToolbarBtn>
            <ToolbarBtn
              tone="approve"
              busy={props.busyAction === "approve"}
              disabled={busy}
              onClick={() => void props.onApprove(props.itemId)}
              title="Approve (A)"
            >
              <CheckIcon /> Approve
            </ToolbarBtn>
          </>
        )}
        {props.view === "needs-review" && props.editOpen && (
          <ToolbarBtn
            tone="approve"
            busy={props.busyAction === "edit-approve"}
            disabled={busy || Boolean(props.validationError)}
            onClick={() => void props.onEditAndApprove(props.itemId, props.request)}
            title="Save & Approve"
          >
            <CheckIcon /> Save & Approve
          </ToolbarBtn>
        )}
        {props.view === "approved" && props.editOpen && (
          <ToolbarBtn
            tone="approve"
            busy={props.busyAction === "save"}
            disabled={busy || Boolean(props.validationError)}
            onClick={() => void props.onSave(props.itemId, props.request)}
          >
            Save
          </ToolbarBtn>
        )}
        {props.view === "failures" && (
          <ToolbarBtn
            tone="approve"
            busy={props.busyAction === "retry"}
            disabled={busy}
            onClick={() => void props.onRetry(props.itemId)}
          >
            <RetryIcon /> Retry
          </ToolbarBtn>
        )}
      </div>
    </div>
  );
}

function SecondaryActionsMenu(props: Props & { busy: boolean; includeCategory?: boolean }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [open]);

  const menuItems = (
    <div className="space-y-0.5">
      {(props.view === "needs-review" || props.view === "failures") && (
        <GhostBtn
          busy={props.busyAction === "delete"}
          disabled={props.busy}
          danger
          onClick={() => {
            setOpen(false);
            confirmAction(props.view === "failures" ? "Delete this failed item?" : "Delete this item?") && void props.onDelete(props.itemId);
          }}
        >
          Delete
        </GhostBtn>
      )}
      {props.view === "needs-review" && (
        <>
          <GhostBtn busy={props.busyAction === "regen-cleaned"} disabled={props.busy} onClick={() => { setOpen(false); void props.onRegenerateCleanedText(props.itemId); }}>
            Regenerate text
          </GhostBtn>
          {props.includeCategory && (
            <GhostBtn busy={props.busyAction === "regen-category"} disabled={props.busy} onClick={() => { setOpen(false); void props.onRegenerateCategoryProposal(props.itemId); }}>
              Regenerate category
            </GhostBtn>
          )}
          <GhostBtn busy={props.busyAction === "regen-all"} disabled={props.busy} onClick={() => { setOpen(false); void props.onRegenerateAll(props.itemId); }}>
            Regenerate all
          </GhostBtn>
        </>
      )}
      {props.view === "approved" && (
        <>
          <GhostBtn busy={props.busyAction === "regen-cleaned"} disabled={props.busy} onClick={() => { setOpen(false); void props.onRegenerateCleanedText(props.itemId); }}>
            Regenerate text
          </GhostBtn>
          <GhostBtn busy={props.busyAction === "regen-all"} disabled={props.busy} onClick={() => { setOpen(false); void props.onRegenerateAll(props.itemId); }}>
            Regenerate all
          </GhostBtn>
        </>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
      >
        <span className="sr-only">More actions</span>
        <DotsIcon />
      </button>

      {open && (
        <>
          {/* Mobile: dimmed backdrop + bottom sheet */}
          <div
            className="fixed inset-0 z-40 bg-stone-900/25 backdrop-blur-[2px] lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-stone-200 bg-white p-5 shadow-2xl lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-stone-900">More actions</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:text-stone-700"
              >
                <XIcon />
              </button>
            </div>
            {menuItems}
          </div>

          {/* Desktop: transparent backdrop + floating dropdown */}
          <div
            className="fixed inset-0 z-40 hidden lg:block"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 hidden min-w-[200px] rounded-2xl border border-stone-200 bg-white p-2 shadow-lg shadow-stone-200/60 lg:block">
            {menuItems}
          </div>
        </>
      )}
    </div>
  );
}

function HeaderActionBtn(props: {
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  shortcut?: string;
}) {
  return (
    <button
      type="button"
      disabled={props.busy || props.disabled}
      onClick={props.onClick}
      className={`flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition disabled:opacity-50 ${
        props.active
          ? "border-stone-900 bg-stone-900 text-white shadow-[0_6px_18px_rgba(28,25,23,0.18)]"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      {props.busy ? "..." : props.children}
      {props.shortcut && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
            props.active ? "bg-white/15 text-white" : "bg-stone-100 text-stone-400"
          }`}
        >
          {props.shortcut}
        </span>
      )}
    </button>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="13" cy="8" r="1.25" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 2l10 10M12 2 2 12" />
    </svg>
  );
}

function confirmAction(message: string): boolean {
  return window.confirm(message);
}
