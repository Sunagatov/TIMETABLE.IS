import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { MemoraCategory, MemoraItem, UpdateItemRequest } from "../types/reviewTypes";

type View = "needs-review" | "failures" | "approved";

type Props = {
  view: View;
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
};

type FormState = {
  title: string;
  cleanedText: string;
  rawTranscript: string;
  type: string;
  priority: string;
  categoryId: string;
  answer: string;
  answerStatus: string;
};

const ANSWER_STATUS_OPTIONS = ["NONE", "GENERATED", "EDITED", "REJECTED", "DELETED"];

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
  onMobileBack
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showAiDetails, setShowAiDetails] = useState(false);
  const [showTrace, setShowTrace] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    title: "",
    cleanedText: "",
    rawTranscript: "",
    type: "OTHER",
    priority: "NOT_APPLICABLE",
    categoryId: "",
    answer: "",
    answerStatus: "NONE"
  });

  useEffect(() => {
    setEditOpen(false);
    setShowOriginal(false);
    setShowAiDetails(false);
    setShowTrace(false);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const matchingCategory = categories.find(
      (c) =>
        c.path.category === item.categoryPath.category &&
        c.path.subcategory === item.categoryPath.subcategory &&
        c.path.subsubcategory === item.categoryPath.subsubcategory
    );
    setFormState({
      title: item.title,
      cleanedText: item.cleanedText,
      rawTranscript: item.rawTranscript ?? "",
      type: item.type,
      priority: item.priority,
      categoryId: matchingCategory?.id ?? "",
      answer: item.answer ?? "",
      answerStatus: item.answerStatus
    });
  }, [categories, item]);

  const request = useMemo<UpdateItemRequest>(() => {
    const category = categories.find((e) => e.id === formState.categoryId);
    const normalizedAnswerStatus = normalizeAnswerStatus(formState.answerStatus, formState.answer);
    return {
      title: formState.title,
      cleanedText: formState.cleanedText,
      rawTranscript: formState.rawTranscript || undefined,
      type: formState.type,
      priority: formState.priority,
      categoryPath: category?.path,
      answer:
        normalizedAnswerStatus === "GENERATED" || normalizedAnswerStatus === "EDITED"
          ? formState.answer
          : undefined,
      answerStatus: normalizedAnswerStatus
    };
  }, [categories, formState]);

  const busy = busyAction !== null;

  // ── Empty / loading states ────────────────────────────────

  if (isLoading) {
    return (
      <section className="flex h-full flex-col bg-white">
        {onMobileBack && <MobileBack onClick={onMobileBack} />}
        <div className="flex flex-1 items-center justify-center">
          <CenterState icon="·  ·  ·" title="Loading" body="Fetching item…" />
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="flex h-full flex-col bg-white">
        {onMobileBack && <MobileBack onClick={onMobileBack} />}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-sm rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-900">Failed to load</p>
            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="flex h-full flex-col bg-white">
        {onMobileBack && <MobileBack onClick={onMobileBack} />}
        <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="20" height="20" rx="3" />
              <line x1="9" y1="11" x2="19" y2="11" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-stone-700">Select an item to review</p>
            <p className="mt-1 text-sm text-stone-400">Pick from the list to read, decide, and act.</p>
          </div>
        </div>
      </section>
    );
  }

  // ── Derived values ────────────────────────────────────────

  const isQuestion = item.type === "QUESTION" || item.aiType === "QUESTION";
  const hasPendingProposal = item.proposedCategoryPath != null && item.proposedCategoryStatus === "PENDING_REVIEW";
  const hasOriginal = Boolean(item.rawInputText || item.rawTranscript);
  const hasAiDiff =
    (item.aiCleanedText && item.aiCleanedText !== item.cleanedText) ||
    (item.aiTitle && item.aiTitle !== item.title);
  const answerStatusOptions =
    formState.answerStatus === "FAILED" ? ["FAILED", ...ANSWER_STATUS_OPTIONS] : ANSWER_STATUS_OPTIONS;
  const answerFailureMessage =
    item.answerStatus === "FAILED" ? (item.answerFailureReason || "Answer generation failed") : null;
  const displayAnswer = item.answer || item.aiAnswer;
  const categoryLabel = [
    item.categoryPath.category,
    item.categoryPath.subcategory,
    item.categoryPath.subsubcategory
  ].filter(Boolean).join(" › ");

  // ── Full render ───────────────────────────────────────────

  return (
    <section className="flex h-full flex-col bg-white">
      {onMobileBack && <MobileBack onClick={onMobileBack} />}

      {/* ── Sticky action toolbar ───────────────────────────── */}
      <div className="sticky top-0 z-10 shrink-0 border-b border-stone-100 bg-white/97 backdrop-blur-sm">
        {actionError && (
          <div className="border-b border-red-100 bg-red-50 px-5 py-2 text-xs text-red-700">
            {actionError}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 px-5 py-3">

          {view === "needs-review" && (
            <>
              <ToolbarBtn
                tone="approve"
                busy={busyAction === "approve"}
                disabled={busy}
                onClick={() => void onApprove(item.id)}
              >
                <CheckIcon /> Approve
              </ToolbarBtn>
              <ToolbarBtn
                tone="edit"
                busy={busyAction === "edit-approve" && editOpen}
                disabled={busy && !editOpen}
                onClick={() => setEditOpen((o) => !o)}
              >
                <PencilIcon /> {editOpen ? "Cancel edit" : "Edit & Approve"}
              </ToolbarBtn>
              <ToolbarBtn
                tone="neutral"
                busy={busyAction === "reject"}
                disabled={busy}
                onClick={() => void onReject(item.id)}
              >
                Reject
              </ToolbarBtn>
              <ToolbarBtn
                tone="danger"
                busy={busyAction === "delete"}
                disabled={busy}
                onClick={() => void onDelete(item.id)}
              >
                Delete
              </ToolbarBtn>

              <div className="ml-auto flex items-center gap-1">
                <GhostBtn busy={busyAction === "regen-all"} disabled={busy} onClick={() => void onRegenerateAll(item.id)}>Regen All</GhostBtn>
                <GhostBtn busy={busyAction === "regen-cleaned"} disabled={busy} onClick={() => void onRegenerateCleanedText(item.id)}>Regen Text</GhostBtn>
                <GhostBtn busy={busyAction === "regen-category"} disabled={busy} onClick={() => void onRegenerateCategoryProposal(item.id)}>Regen Category</GhostBtn>
              </div>
            </>
          )}

          {view === "failures" && (
            <>
              <ToolbarBtn
                tone="approve"
                busy={busyAction === "retry"}
                disabled={busy}
                onClick={() => void onRetry(item.id)}
              >
                <RetryIcon /> Retry Processing
              </ToolbarBtn>
              <ToolbarBtn
                tone="danger"
                busy={busyAction === "delete"}
                disabled={busy}
                onClick={() => void onDelete(item.id)}
              >
                Delete
              </ToolbarBtn>
            </>
          )}

          {view === "approved" && (
            <>
              <ToolbarBtn
                tone={editOpen ? "neutral" : "edit"}
                busy={false}
                disabled={false}
                onClick={() => setEditOpen((o) => !o)}
              >
                <PencilIcon /> {editOpen ? "Cancel edit" : "Edit item"}
              </ToolbarBtn>
              {editOpen && (
                <ToolbarBtn
                  tone="approve"
                  busy={busyAction === "save"}
                  disabled={busy}
                  onClick={() => void onSave(item.id, request)}
                >
                  Save Changes
                </ToolbarBtn>
              )}
              <div className="ml-auto flex items-center gap-1">
                <GhostBtn busy={busyAction === "regen-all"} disabled={busy} onClick={() => void onRegenerateAll(item.id)}>Regen All</GhostBtn>
                <GhostBtn busy={busyAction === "regen-cleaned"} disabled={busy} onClick={() => void onRegenerateCleanedText(item.id)}>Regen Text</GhostBtn>
              </div>
            </>
          )}

        </div>
      </div>

      {/* ── Scrollable document ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-7">

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-stone-500">
              {item.sourceType.replace(/_/g, " ")}
            </span>
            <StatusPill status={item.status} />
            {isQuestion && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Question</span>
            )}
            {item.proposedCategoryStatus === "PENDING_REVIEW" && (
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">Category proposal pending</span>
            )}
            <span className="ml-auto text-xs text-stone-400">{formatDate(item.createdAt)}</span>
          </div>

          {/* Title */}
          <h1 className="mt-4 text-2xl font-semibold leading-snug text-stone-950">
            {item.title || <span className="text-stone-300">Untitled</span>}
          </h1>

          {/* Main content */}
          {item.cleanedText && (
            <p className="mt-4 text-base leading-8 text-stone-700 whitespace-pre-wrap">
              {item.cleanedText}
            </p>
          )}

          {/* Answer block for questions */}
          {isQuestion && displayAnswer && (
            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/60 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">Answer</p>
              <p className="text-base leading-7 text-stone-700">{displayAnswer}</p>
              {item.answerStatus && (
                <p className="mt-2 text-xs text-stone-400">{item.answerStatus.toLowerCase()}</p>
              )}
            </div>
          )}

          {/* Metadata chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Chip label="Type" value={item.type} />
            {item.priority !== "NOT_APPLICABLE" && (
              <Chip label="Priority" value={priorityLabel(item.priority)} />
            )}
            {categoryLabel && <Chip label="Category" value={categoryLabel} />}
          </div>

          {/* Failure notice */}
          {(item.failureStage || item.failureReason) && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                {item.failureStage ? `Failed at: ${item.failureStage.replace(/_/g, " ")}` : "Processing failure"}
              </p>
              {item.failureReason && (
                <p className="mt-1 text-sm text-red-700">{item.failureReason}</p>
              )}
            </div>
          )}

          {/* Disclosure row */}
          {(hasOriginal || hasAiDiff || item.telegramTrace) && (
            <div className="mt-5 flex flex-wrap gap-4 border-t border-stone-100 pt-4">
              {hasOriginal && (
                <Disclosure open={showOriginal} onToggle={() => setShowOriginal((o) => !o)}>
                  Original capture
                </Disclosure>
              )}
              {hasAiDiff && (
                <Disclosure open={showAiDetails} onToggle={() => setShowAiDetails((o) => !o)}>
                  AI changes
                </Disclosure>
              )}
              {item.telegramTrace && (
                <Disclosure open={showTrace} onToggle={() => setShowTrace((o) => !o)}>
                  Telegram trace
                </Disclosure>
              )}
            </div>
          )}

          {/* Expanded: original capture */}
          {showOriginal && (
            <div className="mt-3 rounded-xl bg-stone-50 p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Original capture</p>
              {item.rawInputText && (
                <p className="text-sm leading-6 text-stone-600 whitespace-pre-wrap">{item.rawInputText}</p>
              )}
              {item.rawTranscript && (
                <>
                  <p className="mt-3 text-[11px] font-medium text-stone-400">Transcript</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600 whitespace-pre-wrap">{item.rawTranscript}</p>
                </>
              )}
            </div>
          )}

          {/* Expanded: AI diff */}
          {showAiDetails && (
            <div className="mt-3 rounded-xl bg-stone-50 p-5 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">AI original output</p>
              {item.aiTitle && item.aiTitle !== item.title && (
                <KV label="AI Title" value={item.aiTitle} />
              )}
              {item.aiCleanedText && item.aiCleanedText !== item.cleanedText && (
                <KV label="AI Cleaned Text" value={item.aiCleanedText} multiline />
              )}
              {item.aiType && <KV label="AI Type" value={item.aiType} />}
              {item.aiPriority && <KV label="AI Priority" value={item.aiPriority} />}
              {item.aiCategoryPath && (
                <KV label="AI Category" value={formatCategoryPath(item.aiCategoryPath)} />
              )}
              {isQuestion && item.aiAnswer && (
                <KV label="AI Answer" value={item.aiAnswer} multiline />
              )}
            </div>
          )}

          {/* Expanded: telegram trace */}
          {showTrace && item.telegramTrace && (
            <div className="mt-3 rounded-xl bg-stone-50 p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Telegram trace</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <KVPair label="User ID" value={item.telegramTrace.telegramUserId} />
                <KVPair label="Chat ID" value={item.telegramTrace.telegramChatId} />
                <KVPair label="Message ID" value={item.telegramTrace.telegramMessageId} />
                {item.telegramTrace.durationSeconds && (
                  <KVPair label="Duration" value={`${item.telegramTrace.durationSeconds}s`} />
                )}
                {item.telegramTrace.mimeType && (
                  <KVPair label="MIME" value={item.telegramTrace.mimeType} />
                )}
              </div>
            </div>
          )}

          {/* Category proposal */}
          {item.proposedCategoryPath && (
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">AI Category Proposal</p>
                  <p className="mt-1 text-sm text-stone-700">
                    {formatCategoryPath(item.proposedCategoryPath)}
                    <span className="ml-2 text-xs text-stone-400">{proposalLabel(item.proposedCategoryStatus)}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!hasPendingProposal || busy}
                    onClick={() => void onApproveCategoryProposal(item.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
                  >
                    {busyAction === "category-approve" ? "…" : "Accept"}
                  </button>
                  <button
                    type="button"
                    disabled={!item.proposedCategoryPath || busy}
                    onClick={() => void onRejectCategoryProposal(item.id)}
                    className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                  >
                    {busyAction === "category-reject" ? "…" : "Dismiss"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit form */}
          {editOpen && (
            <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50/60 p-5">
              <p className="mb-4 text-sm font-semibold text-stone-700">Edit fields</p>
              <div className="space-y-4">
                <FormField label="Title">
                  <input
                    value={formState.title}
                    onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                  />
                </FormField>

                <FormField label="Cleaned Text">
                  <textarea
                    rows={7}
                    value={formState.cleanedText}
                    onChange={(e) => setFormState((s) => ({ ...s, cleanedText: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                  />
                </FormField>

                {formState.rawTranscript && (
                  <FormField label="Raw Transcript">
                    <textarea
                      rows={3}
                      value={formState.rawTranscript}
                      onChange={(e) => setFormState((s) => ({ ...s, rawTranscript: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                    />
                  </FormField>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  <FormField label="Type">
                    <select
                      value={formState.type}
                      onChange={(e) => setFormState((s) => ({ ...s, type: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                    >
                      {["IDEA", "THOUGHT", "QUESTION", "REMINDER", "OTHER"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Priority">
                    <select
                      value={formState.priority}
                      onChange={(e) => setFormState((s) => ({ ...s, priority: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                    >
                      {["URGENT_IMPORTANT","URGENT_NOT_IMPORTANT","NOT_URGENT_IMPORTANT","NOT_URGENT_NOT_IMPORTANT","NOT_APPLICABLE"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Category">
                    <select
                      value={formState.categoryId}
                      onChange={(e) => setFormState((s) => ({ ...s, categoryId: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                    >
                      <option value="">Select…</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{formatCategoryPath(c.path)}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {isQuestion && (
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Answer</p>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void onRegenerateAnswer(item.id)}
                        className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 transition disabled:opacity-50"
                      >
                        {busyAction === "regen-answer" ? "…" : "Regenerate"}
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField label="Status">
                        <select
                          value={formState.answerStatus}
                          onChange={(e) => setFormState((s) => ({ ...s, answerStatus: e.target.value }))}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                        >
                          {answerStatusOptions.map((o) => (
                            <option key={o} value={o} disabled={o === "FAILED"}>{o}</option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Answer text">
                        <textarea
                          rows={4}
                          value={formState.answer}
                          onChange={(e) => setFormState((s) => ({ ...s, answer: e.target.value }))}
                          placeholder="Edit or verify…"
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                        />
                      </FormField>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        { l: "Use AI", a: () => setFormState((s) => ({ ...s, answerStatus: "GENERATED", answer: item.aiAnswer ?? s.answer })) },
                        { l: "Mark edited", a: () => setFormState((s) => ({ ...s, answerStatus: "EDITED" })) },
                        { l: "Clear", a: () => setFormState((s) => ({ ...s, answerStatus: "NONE", answer: "" })) },
                        { l: "Reject", a: () => setFormState((s) => ({ ...s, answerStatus: "REJECTED", answer: "" })) },
                        { l: "Delete", a: () => setFormState((s) => ({ ...s, answerStatus: "DELETED", answer: "" })) },
                      ].map(({ l, a }) => (
                        <button key={l} type="button" disabled={busy} onClick={a}
                          className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600 hover:border-stone-400 transition disabled:opacity-50">
                          {l}
                        </button>
                      ))}
                    </div>
                    {answerFailureMessage && (
                      <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{answerFailureMessage}</p>
                    )}
                  </div>
                )}

                {/* Confirm inside edit form */}
                {view === "needs-review" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onEditAndApprove(item.id, request)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-55"
                  >
                    <CheckIcon />
                    {busyAction === "edit-approve" ? "Approving…" : "Confirm Edit & Approve"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 border-t border-stone-100 pt-4 text-[11px] text-stone-300">
            <span>Updated {formatDate(item.updatedAt)}</span>
            <span className="mx-2">·</span>
            <span>Retries: {item.retryCountTranscription} / {item.retryCountAi}</span>
            <span className="mx-2">·</span>
            <span className="font-mono">{item.id}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── UI primitives ─────────────────────────────────────────────

function MobileBack({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center border-b border-stone-100 px-5 py-3 lg:hidden">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100 transition"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="10 3 5 8 10 13" />
        </svg>
        Back
      </button>
    </div>
  );
}

function ToolbarBtn({
  tone,
  busy,
  disabled,
  onClick,
  children
}: {
  tone: "approve" | "edit" | "neutral" | "danger";
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const cls =
    tone === "approve"
      ? "bg-emerald-600 text-white hover:bg-emerald-500"
      : tone === "edit"
        ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
        : tone === "danger"
          ? "text-red-500 hover:bg-red-50"
          : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50";

  return (
    <button
      type="button"
      disabled={busy || disabled}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${cls}`}
    >
      {busy ? "…" : children}
    </button>
  );
}

function GhostBtn({
  busy,
  disabled,
  onClick,
  children
}: {
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={busy || disabled}
      onClick={onClick}
      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition disabled:opacity-50"
    >
      {busy ? "…" : children}
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls = status.includes("APPROVED")
    ? "bg-emerald-100 text-emerald-700"
    : status.includes("FAILED")
      ? "bg-red-100 text-red-700"
      : status.includes("PENDING")
        ? "bg-amber-100 text-amber-700"
        : "bg-stone-100 text-stone-600";
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{label}</span>
      <span className="text-xs font-medium text-stone-700">{value}</span>
    </div>
  );
}

function Disclosure({ open, onToggle, children }: { open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-1.5 text-xs font-medium text-stone-400 transition hover:text-stone-700"
    >
      <span className="text-[9px]">{open ? "▲" : "▼"}</span>
      {children}
    </button>
  );
}

function KV({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{label}</p>
      <p className={`mt-0.5 text-sm text-stone-600 ${multiline ? "whitespace-pre-wrap leading-6" : ""}`}>{value}</p>
    </div>
  );
}

function KVPair({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      <p className="text-stone-400">{label}</p>
      <p className="font-mono text-stone-600 truncate">{value}</p>
    </>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-stone-500">{label}</span>
      {children}
    </label>
  );
}

function CenterState({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="max-w-xs rounded-2xl border border-dashed border-stone-200 p-10 text-center">
      <p className="text-3xl text-stone-200">{icon}</p>
      <p className="mt-3 font-semibold text-stone-700">{title}</p>
      <p className="mt-2 text-sm text-stone-400">{body}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 7.5 5.5 11 12 4.5" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 1.5L11.5 4.5L4.5 11.5H1.5V8.5L8.5 1.5Z" />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 7A5.5 5.5 0 1 0 3 3L1.5 1.5V5H5" />
    </svg>
  );
}

// ── Utilities ─────────────────────────────────────────────────

function normalizeAnswerStatus(status: string, answer: string): string | undefined {
  if (status === "FAILED") return answer.trim() ? "EDITED" : undefined;
  return ANSWER_STATUS_OPTIONS.includes(status) ? status : answer.trim() ? "EDITED" : "NONE";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatCategoryPath(path: { category: string; subcategory: string; subsubcategory: string }) {
  return `${path.category} / ${path.subcategory} / ${path.subsubcategory}`;
}

function proposalLabel(status: string) {
  if (status === "PENDING_REVIEW") return "pending review";
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "rejected";
  return "none";
}

function priorityLabel(priority: string): string {
  if (priority === "URGENT_IMPORTANT") return "Urgent & important";
  if (priority === "URGENT_NOT_IMPORTANT") return "Urgent, not important";
  if (priority === "NOT_URGENT_IMPORTANT") return "Important";
  if (priority === "NOT_URGENT_NOT_IMPORTANT") return "Low priority";
  return priority;
}
