import { useCallback, useEffect, useMemo, useState } from "react";
import type { MemoraCategory, MemoraItem, UpdateItemRequest } from "../../types/reviewTypes";
import { CategoryProposalCard } from "./CategoryProposalCard";
import { CenterState, MobileBack } from "./DetailPrimitives";
import { ItemActionAlerts, ItemFooterActions, ItemHeaderActions } from "./ItemActionToolbar";
import { ItemEditForm } from "./ItemEditForm";
import { ItemFailureNotice } from "./ItemFailureNotice";
import { ItemHeader } from "./ItemHeader";
import { ItemMainContent } from "./ItemMainContent";
import { ItemMetadataChips } from "./ItemMetadataChips";
import { OriginalAiDraftSection } from "./OriginalAiDraftSection";
import { OriginalCaptureSection } from "./OriginalCaptureSection";
import type { DetailView, ItemDetailFormState } from "./itemDetailUtils";
import {
  buildUpdateItemRequest,
  EMPTY_FORM_STATE,
  formStateFromItem,
  getUpdateRequestValidationError,
  isQuestionItem
} from "./itemDetailUtils";

type Props = {
  view: DetailView;
  item: MemoraItem | undefined;
  categories: MemoraCategory[];
  busyAction: string | null;
  actionError: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  onApprove: (itemId: string) => Promise<void>;
  onEditAndApprove: (itemId: string, request: UpdateItemRequest) => Promise<void>;
  onSave: (itemId: string, request: UpdateItemRequest) => Promise<void>;
  onReject: (itemId: string) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
  onRetry: (itemId: string) => Promise<void>;
  onApproveCategoryProposal: (itemId: string) => Promise<void>;
  onRejectCategoryProposal: (itemId: string) => Promise<void>;
  onRegenerateCleanedText: (itemId: string) => Promise<void>;
  onRegenerateAnswer: (itemId: string) => Promise<void>;
  onRegenerateCategoryProposal: (itemId: string) => Promise<void>;
  onRegenerateAll: (itemId: string) => Promise<void>;
  onMobileBack?: () => void;
  embedded?: boolean;
};

export function ItemDetailPanel({
  view,
  item,
  categories,
  busyAction,
  actionError,
  isLoading,
  errorMessage,
  onApprove,
  onEditAndApprove,
  onSave,
  onReject,
  onDelete,
  onRetry,
  onApproveCategoryProposal,
  onRejectCategoryProposal,
  onRegenerateCleanedText,
  onRegenerateAnswer,
  onRegenerateCategoryProposal,
  onRegenerateAll,
  onMobileBack,
  embedded
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [formState, setFormState] = useState<ItemDetailFormState>(EMPTY_FORM_STATE);

  useEffect(() => setEditOpen(false), [item?.id]);
  useEffect(() => {
    if (item && !editOpen) setFormState(formStateFromItem(item, categories));
  }, [categories, editOpen, item]);

  const handleApproveKey = useCallback(() => {
    if (item && view === "needs-review" && !editOpen) void onApprove(item.id);
  }, [item, view, editOpen, onApprove]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "a") { e.preventDefault(); handleApproveKey(); }
      if (e.key === "e" && view !== "failures") { e.preventDefault(); setEditOpen((o) => !o); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleApproveKey, view]);

  const request = useMemo(
    () => buildUpdateItemRequest(formState, categories),
    [categories, formState]
  );
  const validationError = useMemo(
    () => getUpdateRequestValidationError(formState),
    [formState]
  );

  if (isLoading) {
    if (embedded) return <div className="flex items-center justify-center py-10 text-sm text-stone-400">Loading…</div>;
    return <PanelShell onMobileBack={onMobileBack}><CenterState icon=".  .  ." title="Loading" body="Fetching item..." /></PanelShell>;
  }

  if (errorMessage) {
    if (embedded) return <div className="px-6 py-4 text-sm text-red-600">{errorMessage}</div>;
    return (
      <PanelShell onMobileBack={onMobileBack}>
        <div className="max-w-sm rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-semibold text-red-900">Failed to load</p>
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
        </div>
      </PanelShell>
    );
  }

  if (!item) {
    if (embedded) return null;
    return <PanelShell onMobileBack={onMobileBack}><CenterState icon="□" title="Open the queue on the left" body="Choose one note, read the cleaned version, then approve or edit it." /></PanelShell>;
  }

  const busy = busyAction !== null;
  const isQuestion = isQuestionItem(item);
  const answerFailureMessage =
    item.answerStatus === "FAILED" ? (item.answerFailureReason || "Answer generation failed") : null;
  const actionProps = {
    view,
    itemId: item.id,
    editOpen,
    busyAction,
    actionError,
    validationError,
    request,
    onToggleEdit: () => setEditOpen((open) => !open),
    onApprove,
    onEditAndApprove,
    onSave,
    onReject,
    onDelete,
    onRetry,
    onRegenerateCleanedText,
    onRegenerateCategoryProposal,
    onRegenerateAll
  } satisfies React.ComponentProps<typeof ItemHeaderActions>;

  const sharedContent = (
    <>
      <ItemHeader item={item} isQuestion={isQuestion} actions={<ItemHeaderActions {...actionProps} />} />
      <ItemMetadataChips item={item} />
      <ItemMainContent item={item} isQuestion={isQuestion} />
      <ItemFailureNotice item={item} />
      <OriginalAiDraftSection item={item} isQuestion={isQuestion} />
      <OriginalCaptureSection item={item} />
      {view === "needs-review" && (
        <CategoryProposalCard
          item={item}
          busy={busy}
          busyAction={busyAction}
          onApproveCategoryProposal={onApproveCategoryProposal}
          onRejectCategoryProposal={onRejectCategoryProposal}
        />
      )}
      {editOpen && (
        <ItemEditForm
          view={view}
          item={item}
          categories={categories}
          busy={busy}
          busyAction={busyAction}
          isQuestion={isQuestion}
          answerFailureMessage={answerFailureMessage}
          validationError={validationError}
          formState={formState}
          setFormState={setFormState}
          request={request}
          onEditAndApprove={onEditAndApprove}
          onRegenerateAnswer={onRegenerateAnswer}
        />
      )}
    </>
  );

  if (embedded) {
    return (
      <div>
        <ItemActionAlerts actionError={actionError} validationError={validationError} editOpen={editOpen} />
        <div className="px-6 py-5">{sharedContent}</div>
        <ItemFooterActions {...actionProps} embedded />
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col bg-white">
      {onMobileBack && <MobileBack onClick={onMobileBack} />}
      <ItemActionAlerts actionError={actionError} validationError={validationError} editOpen={editOpen} />
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 pb-32">
          {sharedContent}
        </div>
      </div>
      <ItemFooterActions {...actionProps} />
    </section>
  );
}

function PanelShell({ onMobileBack, children }: { onMobileBack?: () => void; children: React.ReactNode }) {
  return (
    <section className="flex h-full flex-col bg-white">
      {onMobileBack && <MobileBack onClick={onMobileBack} />}
      <div className="flex flex-1 items-center justify-center p-8">{children}</div>
    </section>
  );
}
