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
    if (!item) return;

    const matchingCategory = categories.find(
      (category) =>
        category.path.category === item.categoryPath.category &&
        category.path.subcategory === item.categoryPath.subcategory &&
        category.path.subsubcategory === item.categoryPath.subsubcategory
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
    const category = categories.find((entry) => entry.id === formState.categoryId);
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

  const mobileHeader = onMobileBack ? (
    <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-3 lg:hidden">
      <button
        type="button"
        onClick={onMobileBack}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 transition"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="10 3 5 8 10 13" />
        </svg>
        <span>Back</span>
      </button>
    </div>
  ) : null;

  if (isLoading) {
    return (
      <section className="flex h-full flex-col bg-white">
        {mobileHeader}
        <div className="flex flex-1 items-center justify-center p-10">
          <StateCard icon="⟳" title="Loading item" body="Fetching the selected item from the backend." />
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="flex h-full flex-col bg-white">
        {mobileHeader}
        <div className="flex flex-1 items-center justify-center p-10">
          <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-lg font-semibold text-red-900">Failed to load item</p>
            <p className="mt-2 text-sm leading-6 text-red-700">{errorMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="flex h-full flex-col bg-white">
        {mobileHeader}
        <div className="flex flex-1 items-center justify-center p-10">
          <StateCard
            icon="◱"
            title="No item selected"
            body="Select an item from the list to inspect, compare AI output, and take review actions."
          />
        </div>
      </section>
    );
  }

  const isQuestion = item.type === "QUESTION" || item.aiType === "QUESTION";
  const hasPendingProposal =
    item.proposedCategoryPath != null && item.proposedCategoryStatus === "PENDING_REVIEW";
  const showProposalControls = Boolean(item.proposedCategoryPath);
  const answerFailureMessage =
    item.answerStatus === "FAILED"
      ? item.answerFailureReason || "Answer generation failed"
      : null;
  const answerStatusOptions =
    formState.answerStatus === "FAILED" ? ["FAILED", ...ANSWER_STATUS_OPTIONS] : ANSWER_STATUS_OPTIONS;

  return (
    <section className="flex h-full flex-col bg-white">
      {mobileHeader}

      {/* Item header */}
      <div className="border-b border-stone-100 px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} />
              <span className="text-xs text-stone-400">{item.sourceType.replace(/_/g, " ")}</span>
            </div>
            <h2 className="mt-2 text-xl font-semibold leading-snug text-stone-950">
              {item.title || "Untitled"}
            </h2>
          </div>
          <div className="shrink-0 rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-xs text-stone-500">
            <p>{formatDate(item.createdAt)}</p>
            <p className="mt-0.5 text-stone-400">Updated {formatDate(item.updatedAt)}</p>
          </div>
        </div>

        {actionError ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {actionError}
          </div>
        ) : null}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">

            {/* Left: read-only info */}
            <div className="space-y-4">
              <InfoSection title="AI Output">
                <Field label="Title" value={item.aiTitle} />
                <Field label="Cleaned Text" value={item.aiCleanedText} multiline />
                <Field label="Type" value={item.aiType} />
                <Field label="Category" value={formatCategoryPath(item.aiCategoryPath)} />
                <Field label="Priority" value={item.aiPriority} />
                <Field
                  label="Proposed Category"
                  value={
                    item.proposedCategoryPath
                      ? `${formatCategoryPath(item.proposedCategoryPath)} · ${proposalLabel(item.proposedCategoryStatus)}`
                      : null
                  }
                />
                {isQuestion ? <Field label="Answer" value={item.aiAnswer} multiline /> : null}
              </InfoSection>

              <InfoSection title="Current Values">
                <Field label="Title" value={formState.title} />
                <Field label="Cleaned Text" value={formState.cleanedText} multiline />
                <Field label="Type" value={formState.type} />
                <Field label="Priority" value={formState.priority} />
                <Field
                  label="Category"
                  value={displaySelectedCategory(categories, formState.categoryId, item.categoryPath)}
                />
                {formState.answer ? <Field label="Answer" value={formState.answer} multiline /> : null}
                <Field label="Answer Status" value={formState.answerStatus} />
                {answerFailureMessage ? (
                  <Field label="Answer Failure" value={answerFailureMessage} multiline />
                ) : null}
              </InfoSection>

              <InfoSection title="Raw Capture">
                <Field label="Raw Input Text" value={item.rawInputText} multiline />
                <Field label="Raw Transcript" value={item.rawTranscript} multiline />
                {item.failureStage || item.failureReason ? (
                  <>
                    <Field label="Failure Stage" value={item.failureStage} />
                    <Field label="Failure Reason" value={item.failureReason} multiline />
                  </>
                ) : null}
              </InfoSection>

              {item.telegramTrace ? (
                <InfoSection title="Telegram Trace">
                  <Field label="User ID" value={item.telegramTrace.telegramUserId} />
                  <Field label="Chat ID" value={item.telegramTrace.telegramChatId} />
                  <Field label="Message ID" value={item.telegramTrace.telegramMessageId} />
                  <Field label="File ID" value={item.telegramTrace.telegramFileId} />
                  <Field
                    label="Media"
                    value={
                      item.telegramTrace.durationSeconds || item.telegramTrace.mimeType
                        ? `${item.telegramTrace.durationSeconds ?? "?"}s · ${item.telegramTrace.mimeType ?? "unknown"}`
                        : null
                    }
                  />
                </InfoSection>
              ) : null}

              <div className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 text-xs text-stone-500">
                <p className="font-medium text-stone-600">Retry counts</p>
                <p className="mt-1">Transcription: {item.retryCountTranscription} · AI: {item.retryCountAi}</p>
                <p className="mt-1 font-mono text-[10px] text-stone-400 truncate">{item.id}</p>
              </div>
            </div>

            {/* Right: editable form + actions */}
            <div>
              <div className="rounded-2xl border border-stone-200 bg-[#fdfcfa] p-5">
                <h3 className="text-sm font-semibold text-stone-900">Edit &amp; Actions</h3>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Human-facing values. Submit backend-supported fields only.
                </p>

                {/* Primary actions — top of form for quick access */}
                <div className="mt-4">
                  <ActionBar
                    view={view}
                    item={item}
                    busyAction={busyAction}
                    request={request}
                    onApprove={onApprove}
                    onEditAndApprove={onEditAndApprove}
                    onSave={onSave}
                    onReject={onReject}
                    onDelete={onDelete}
                    onRetry={onRetry}
                    onRegenerateCleanedText={onRegenerateCleanedText}
                    onRegenerateAnswer={onRegenerateAnswer}
                    onRegenerateCategoryProposal={onRegenerateCategoryProposal}
                    onRegenerateAll={onRegenerateAll}
                  />
                </div>

                <div className="mt-5 space-y-4">
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

                  <FormField label="Raw Transcript">
                    <textarea
                      rows={4}
                      value={formState.rawTranscript}
                      onChange={(e) => setFormState((s) => ({ ...s, rawTranscript: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                    />
                  </FormField>

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
                        {[
                          "URGENT_IMPORTANT",
                          "URGENT_NOT_IMPORTANT",
                          "NOT_URGENT_IMPORTANT",
                          "NOT_URGENT_NOT_IMPORTANT",
                          "NOT_APPLICABLE"
                        ].map((o) => (
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
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {formatCategoryPath(cat.path)}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  {showProposalControls ? (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                        AI Category Proposal
                      </p>
                      <p className="mt-2 text-sm text-stone-700">
                        {item.proposedCategoryPath
                          ? `${formatCategoryPath(item.proposedCategoryPath)} · ${proposalLabel(item.proposedCategoryStatus)}`
                          : "No proposal"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <ActionButton
                          label="Approve Proposal"
                          busy={busyAction === "category-approve"}
                          disabled={!hasPendingProposal || busyAction !== null}
                          onClick={() => onApproveCategoryProposal(item.id)}
                          tone="primary"
                          size="sm"
                        />
                        <ActionButton
                          label="Reject Proposal"
                          busy={busyAction === "category-reject"}
                          disabled={!item.proposedCategoryPath || busyAction !== null}
                          onClick={() => onRejectCategoryProposal(item.id)}
                          tone="secondary"
                          size="sm"
                        />
                      </div>
                    </div>
                  ) : null}

                  {isQuestion ? (
                    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                          Answer
                        </p>
                        <ActionButton
                          label="Regenerate"
                          busy={busyAction === "regen-answer"}
                          disabled={busyAction !== null}
                          onClick={() => onRegenerateAnswer(item.id)}
                          tone="accent"
                          size="xs"
                        />
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
                          { label: "Use AI Answer", action: () => setFormState((s) => ({ ...s, answerStatus: "GENERATED", answer: item.aiAnswer ?? s.answer })) },
                          { label: "Mark Edited", action: () => setFormState((s) => ({ ...s, answerStatus: "EDITED" })) },
                          { label: "Clear", action: () => setFormState((s) => ({ ...s, answerStatus: "NONE", answer: "" })) },
                          { label: "Reject", action: () => setFormState((s) => ({ ...s, answerStatus: "REJECTED", answer: "" })) },
                          { label: "Delete", action: () => setFormState((s) => ({ ...s, answerStatus: "DELETED", answer: "" })) },
                        ].map(({ label, action }) => (
                          <button
                            key={label}
                            type="button"
                            disabled={busyAction !== null}
                            onClick={action}
                            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600 hover:border-stone-400 hover:text-stone-900 transition disabled:opacity-50"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      {answerFailureMessage ? (
                        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                          {answerFailureMessage}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionBar({
  view,
  item,
  busyAction,
  request,
  onApprove,
  onEditAndApprove,
  onSave,
  onReject,
  onDelete,
  onRetry,
  onRegenerateCleanedText,
  onRegenerateAnswer: _onRegenerateAnswer,
  onRegenerateCategoryProposal,
  onRegenerateAll
}: {
  view: View;
  item: MemoraItem;
  busyAction: string | null;
  request: UpdateItemRequest;
  onApprove: (id: string) => Promise<void>;
  onEditAndApprove: (id: string, r: UpdateItemRequest) => Promise<void>;
  onSave: (id: string, r: UpdateItemRequest) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRetry: (id: string) => Promise<void>;
  onRegenerateCleanedText: (id: string) => Promise<void>;
  onRegenerateAnswer: (id: string) => Promise<void>;
  onRegenerateCategoryProposal: (id: string) => Promise<void>;
  onRegenerateAll: (id: string) => Promise<void>;
}) {
  const busy = busyAction !== null;

  if (view === "needs-review") {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <ActionButton label="Approve As Is" busy={busyAction === "approve"} disabled={busy} onClick={() => onApprove(item.id)} tone="primary" />
          <ActionButton label="Edit Then Approve" busy={busyAction === "edit-approve"} disabled={busy} onClick={() => onEditAndApprove(item.id, request)} tone="accent" />
          <ActionButton label="Reject" busy={busyAction === "reject"} disabled={busy} onClick={() => onReject(item.id)} tone="secondary" />
          <ActionButton label="Delete" busy={busyAction === "delete"} disabled={busy} onClick={() => onDelete(item.id)} tone="danger" />
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton label="Regen All" busy={busyAction === "regen-all"} disabled={busy} onClick={() => onRegenerateAll(item.id)} tone="secondary" size="sm" />
          <ActionButton label="Regen Text" busy={busyAction === "regen-cleaned"} disabled={busy} onClick={() => onRegenerateCleanedText(item.id)} tone="secondary" size="sm" />
          <ActionButton label="Regen Category" busy={busyAction === "regen-category"} disabled={busy} onClick={() => onRegenerateCategoryProposal(item.id)} tone="secondary" size="sm" />
        </div>
      </div>
    );
  }

  if (view === "failures") {
    return (
      <div className="flex flex-wrap gap-2">
        <ActionButton label="Retry" busy={busyAction === "retry"} disabled={busy} onClick={() => onRetry(item.id)} tone="primary" />
        <ActionButton label="Delete" busy={busyAction === "delete"} disabled={busy} onClick={() => onDelete(item.id)} tone="danger" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton label="Save Changes" busy={busyAction === "save"} disabled={busy} onClick={() => onSave(item.id, request)} tone="primary" />
      <ActionButton label="Regen All" busy={busyAction === "regen-all"} disabled={busy} onClick={() => onRegenerateAll(item.id)} tone="secondary" size="sm" />
      <ActionButton label="Regen Text" busy={busyAction === "regen-cleaned"} disabled={busy} onClick={() => onRegenerateCleanedText(item.id)} tone="secondary" size="sm" />
    </div>
  );
}

function ActionButton(props: {
  label: string;
  busy: boolean;
  disabled?: boolean;
  onClick: () => Promise<void> | void;
  tone: "primary" | "accent" | "secondary" | "danger";
  size?: "sm" | "xs";
}) {
  const toneClass =
    props.tone === "primary"
      ? "bg-stone-900 text-white hover:bg-stone-700"
      : props.tone === "accent"
        ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
        : props.tone === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "border border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50";

  const sizeClass =
    props.size === "xs"
      ? "rounded-lg px-2.5 py-1 text-xs"
      : props.size === "sm"
        ? "rounded-xl px-3 py-1.5 text-xs"
        : "rounded-xl px-4 py-2.5 text-sm";

  return (
    <button
      type="button"
      disabled={props.busy || props.disabled}
      onClick={() => void props.onClick()}
      className={`font-medium transition disabled:cursor-not-allowed disabled:opacity-55 ${toneClass} ${sizeClass}`}
    >
      {props.busy ? "Working…" : props.label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorClass = status.includes("APPROVED")
    ? "bg-emerald-100 text-emerald-700"
    : status.includes("FAILED")
      ? "bg-red-100 text-red-700"
      : status.includes("PENDING")
        ? "bg-amber-100 text-amber-700"
        : "bg-stone-100 text-stone-600";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colorClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function InfoSection(props: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-100 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-stone-800">{props.title}</h3>
      <div className="space-y-3.5">{props.children}</div>
    </section>
  );
}

function Field(props: { label: string; value: string | null | undefined; multiline?: boolean }) {
  if (!props.value) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
        {props.label}
      </p>
      <p className={`mt-1 text-sm leading-6 text-stone-700 ${props.multiline ? "whitespace-pre-wrap" : "truncate"}`}>
        {props.value}
      </p>
    </div>
  );
}

function FormField(props: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-xs font-semibold text-stone-500">{props.label}</span>
      {props.children}
    </label>
  );
}

function StateCard(props: { icon: string; title: string; body: string }) {
  return (
    <div className="max-w-xs rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-8 text-center">
      <p className="text-3xl text-stone-300">{props.icon}</p>
      <p className="mt-3 text-base font-semibold text-stone-800">{props.title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-500">{props.body}</p>
    </div>
  );
}

function normalizeAnswerStatus(status: string, answer: string): string | undefined {
  if (status === "FAILED") {
    return answer.trim() ? "EDITED" : undefined;
  }
  return ANSWER_STATUS_OPTIONS.includes(status) ? status : answer.trim() ? "EDITED" : "NONE";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatCategoryPath(path: { category: string; subcategory: string; subsubcategory: string }) {
  return `${path.category} / ${path.subcategory} / ${path.subsubcategory}`;
}

function displaySelectedCategory(
  categories: MemoraCategory[],
  categoryId: string,
  fallbackPath: { category: string; subcategory: string; subsubcategory: string }
) {
  const category = categories.find((entry) => entry.id === categoryId);
  return category ? formatCategoryPath(category.path) : formatCategoryPath(fallbackPath);
}

function proposalLabel(status: string) {
  if (status === "PENDING_REVIEW") return "pending review";
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "rejected";
  return "none";
}
