import type { Dispatch, SetStateAction } from "react";
import type { MemoraItem } from "../../types/reviewTypes";
import type { AnswerStatus } from "../../types/reviewTypes";
import { FormField } from "./DetailPrimitives";
import type { ItemDetailFormState } from "./itemDetailUtils";
import { ANSWER_STATUS_OPTIONS } from "./itemDetailUtils";

type ActionTone = "neutral" | "warning" | "danger";

type Props = {
  item: MemoraItem;
  busy: boolean;
  busyAction: string | null;
  answerFailureMessage: string | null;
  formState: ItemDetailFormState;
  setFormState: Dispatch<SetStateAction<ItemDetailFormState>>;
  onRegenerateAnswer: (itemId: string) => Promise<void>;
};

export function AnswerEditor({
  item,
  busy,
  busyAction,
  answerFailureMessage,
  formState,
  setFormState,
  onRegenerateAnswer
}: Props) {
  const answerStatusOptions =
    formState.answerStatus === "FAILED" ? ["FAILED", ...ANSWER_STATUS_OPTIONS] : ANSWER_STATUS_OPTIONS;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">Answer</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void onRegenerateAnswer(item.id)}
          className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-200 disabled:opacity-50"
        >
          {busyAction === "regen-answer" ? "..." : "Regenerate"}
        </button>
      </div>
      <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Status">
            <select
              value={formState.answerStatus}
              onChange={(event) => setFormState((state) => ({ ...state, answerStatus: event.target.value as AnswerStatus }))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
            >
              {answerStatusOptions.map((option) => (
                <option key={option} value={option} disabled={option === "FAILED"}>{option}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Answer text">
            <textarea
              rows={4}
              value={formState.answer}
              onChange={(event) => setFormState((state) => ({ ...state, answer: event.target.value }))}
              placeholder="Edit or verify…"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
            />
          </FormField>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {answerActions(item).map(({ label, tone, action }) => (
            <button
              key={label}
              type="button"
              disabled={busy}
              onClick={() => setFormState(action)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${answerActionClass(tone)}`}
            >
              {label}
            </button>
          ))}
        </div>
        {answerFailureMessage && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {answerFailureMessage}
          </p>
        )}
      </div>
    </div>
  );
}

function answerActionClass(tone: ActionTone): string {
  switch (tone) {
    case "danger": return "border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300";
    case "warning": return "border border-amber-200 bg-white text-amber-700 hover:bg-amber-50 hover:border-amber-300";
    default: return "border border-stone-200 bg-white text-stone-600 hover:border-stone-400";
  }
}

function answerActions(item: MemoraItem): Array<{
  label: string;
  tone: ActionTone;
  action: (state: ItemDetailFormState) => ItemDetailFormState;
}> {
  return [
    {
      label: "Use AI",
      tone: "neutral",
      action: (state) => ({ ...state, answerStatus: "GENERATED", answer: item.aiAnswer ?? state.answer })
    },
    {
      label: "Mark edited",
      tone: "neutral",
      action: (state) => ({ ...state, answerStatus: "EDITED" })
    },
    {
      label: "Clear",
      tone: "neutral",
      action: (state) => ({ ...state, answerStatus: "NONE", answer: "" })
    },
    {
      label: "Reject",
      tone: "warning",
      action: (state) => ({ ...state, answerStatus: "REJECTED", answer: "" })
    },
    {
      label: "Delete",
      tone: "danger",
      action: (state) => ({ ...state, answerStatus: "DELETED", answer: "" })
    }
  ];
}
