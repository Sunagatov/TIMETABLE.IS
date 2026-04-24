import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  MemoraCategory,
  MemoraItem,
  UpdateItemRequest
} from "../types/reviewTypes";

type View = "needs-review" | "failures" | "approved";

type Props = {
  view: View;
  item: MemoraItem | undefined;
  categories: MemoraCategory[];
  busyAction: string | null;
  onApprove: (itemId: string) => Promise<void>;
  onEditAndApprove: (itemId: string, request: UpdateItemRequest) => Promise<void>;
  onSave: (itemId: string, request: UpdateItemRequest) => Promise<void>;
  onReject: (itemId: string) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
  onRetry: (itemId: string) => Promise<void>;
};

type FormState = {
  title: string;
  cleanedText: string;
  rawTranscript: string;
  type: string;
  priority: string;
  categoryId: string;
};

export function ItemDetailPanel({
  view,
  item,
  categories,
  busyAction,
  onApprove,
  onEditAndApprove,
  onSave,
  onReject,
  onDelete,
  onRetry
}: Props) {
  const [formState, setFormState] = useState<FormState>({
    title: "",
    cleanedText: "",
    rawTranscript: "",
    type: "OTHER",
    priority: "NOT_APPLICABLE",
    categoryId: ""
  });

  useEffect(() => {
    if (!item) {
      return;
    }

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
      categoryId: matchingCategory?.id ?? ""
    });
  }, [categories, item]);

  const request = useMemo<UpdateItemRequest>(() => {
    const category = categories.find((entry) => entry.id === formState.categoryId);

    return {
      title: formState.title,
      cleanedText: formState.cleanedText,
      rawTranscript: formState.rawTranscript || undefined,
      type: formState.type,
      priority: formState.priority,
      categoryPath: category?.path
    };
  }, [categories, formState]);

  if (!item) {
    return (
      <section className="flex h-screen items-center justify-center bg-white p-10">
        <div className="max-w-md rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm leading-6 text-stone-500">
          Select an item to inspect backend data, compare AI output, and take review actions.
        </div>
      </section>
    );
  }

  return (
    <section className="h-screen overflow-y-auto bg-white">
      <div className="mx-auto max-w-5xl p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
              {item.memoraId}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-stone-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {item.status.replace(/_/g, " ")} · {item.sourceType.replace(/_/g, " ")}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
            <p>Created {formatDate(item.createdAt)}</p>
            <p className="mt-1">Updated {formatDate(item.updatedAt)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_1.25fr]">
          <div className="space-y-6">
            <InfoCard title="AI Output">
              <Field label="AI Title" value={item.aiTitle} />
              <Field label="AI Cleaned Text" value={item.aiCleanedText} multiline />
              <Field label="AI Type" value={item.aiType} />
              <Field
                label="AI Category"
                value={formatCategoryPath(item.aiCategoryPath)}
              />
              <Field label="AI Priority" value={item.aiPriority} />
            </InfoCard>

            <InfoCard title="Original Capture">
              <Field label="Raw Input Text" value={item.rawInputText} multiline />
              <Field label="Raw Transcript" value={item.rawTranscript} multiline />
              {item.failureStage || item.failureReason ? (
                <>
                  <Field label="Failure Stage" value={item.failureStage} />
                  <Field label="Failure Reason" value={item.failureReason} multiline />
                </>
              ) : null}
            </InfoCard>

            {item.telegramTrace ? (
              <InfoCard title="Telegram Trace">
                <Field label="User ID" value={item.telegramTrace.telegramUserId} />
                <Field label="Chat ID" value={item.telegramTrace.telegramChatId} />
                <Field label="Message ID" value={item.telegramTrace.telegramMessageId} />
                <Field label="File ID" value={item.telegramTrace.telegramFileId} />
                <Field label="File Unique ID" value={item.telegramTrace.telegramFileUniqueId} />
                <Field
                  label="Media"
                  value={
                    item.telegramTrace.durationSeconds || item.telegramTrace.mimeType
                      ? `${item.telegramTrace.durationSeconds ?? "?"}s · ${item.telegramTrace.mimeType ?? "unknown"}`
                      : null
                  }
                />
              </InfoCard>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-[#fcfaf6] p-6">
            <h3 className="text-lg font-semibold text-stone-900">Current Editable Values</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Edit the current human-facing values. The frontend submits backend-supported fields
              only and does not own status rules.
            </p>

            <div className="mt-6 space-y-4">
              <FormField label="Title">
                <input
                  value={formState.title}
                  onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
                />
              </FormField>

              <FormField label="Cleaned Text">
                <textarea
                  rows={8}
                  value={formState.cleanedText}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, cleanedText: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
                />
              </FormField>

              <FormField label="Raw Transcript">
                <textarea
                  rows={5}
                  value={formState.rawTranscript}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, rawTranscript: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
                />
              </FormField>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField label="Type">
                  <select
                    value={formState.type}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, type: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
                  >
                    {["IDEA", "THOUGHT", "REMINDER", "OTHER"].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Priority">
                  <select
                    value={formState.priority}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, priority: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
                  >
                    {[
                      "URGENT_IMPORTANT",
                      "URGENT_NOT_IMPORTANT",
                      "NOT_URGENT_IMPORTANT",
                      "NOT_URGENT_NOT_IMPORTANT",
                      "NOT_APPLICABLE"
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Category Path">
                  <select
                    value={formState.categoryId}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, categoryId: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {formatCategoryPath(category.path)}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {view === "needs-review" ? (
                <>
                  <ActionButton
                    label="Approve As Is"
                    busy={busyAction === "approve"}
                    onClick={() => onApprove(item.id)}
                    tone="primary"
                  />
                  <ActionButton
                    label="Edit Then Approve"
                    busy={busyAction === "edit-approve"}
                    onClick={() => onEditAndApprove(item.id, request)}
                    tone="accent"
                  />
                  <ActionButton
                    label="Reject"
                    busy={busyAction === "reject"}
                    onClick={() => onReject(item.id)}
                    tone="secondary"
                  />
                  <ActionButton
                    label="Delete"
                    busy={busyAction === "delete"}
                    onClick={() => onDelete(item.id)}
                    tone="danger"
                  />
                </>
              ) : null}

              {view === "failures" ? (
                <>
                  <ActionButton
                    label="Retry"
                    busy={busyAction === "retry"}
                    onClick={() => onRetry(item.id)}
                    tone="primary"
                  />
                  <ActionButton
                    label="Delete"
                    busy={busyAction === "delete"}
                    onClick={() => onDelete(item.id)}
                    tone="danger"
                  />
                </>
              ) : null}

              {view === "approved" ? (
                <ActionButton
                  label="Save Changes"
                  busy={busyAction === "save"}
                  onClick={() => onSave(item.id, request)}
                  tone="primary"
                />
              ) : null}
            </div>

            <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
              <p>Retry counts</p>
              <p className="mt-2">Transcription: {item.retryCountTranscription}</p>
              <p className="mt-1">AI: {item.retryCountAi}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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

function ActionButton(props: {
  label: string;
  busy: boolean;
  onClick: () => Promise<void>;
  tone: "primary" | "accent" | "secondary" | "danger";
}) {
  const toneClass =
    props.tone === "primary"
      ? "bg-stone-900 text-white hover:bg-stone-700"
      : props.tone === "accent"
        ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
        : props.tone === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "border border-stone-300 bg-white text-stone-900 hover:bg-stone-100";

  return (
    <button
      type="button"
      disabled={props.busy}
      onClick={() => void props.onClick()}
      className={`rounded-2xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
    >
      {props.busy ? "Working..." : props.label}
    </button>
  );
}

function InfoCard(props: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-stone-900">{props.title}</h3>
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function Field(props: { label: string; value: string | null; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
        {props.label}
      </p>
      <p className={`mt-2 text-sm leading-6 text-stone-700 ${props.multiline ? "whitespace-pre-wrap" : ""}`}>
        {props.value || "—"}
      </p>
    </div>
  );
}

function FormField(props: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block font-medium text-stone-700">{props.label}</span>
      {props.children}
    </label>
  );
}
