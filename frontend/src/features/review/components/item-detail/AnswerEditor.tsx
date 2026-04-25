import type { Dispatch, SetStateAction } from "react";
import type { MemoraItem } from "../../types/reviewTypes";
import type { AnswerStatus } from "../../types/reviewTypes";
import { FormField } from "./DetailPrimitives";
import type { ItemDetailFormState } from "./itemDetailUtils";
import { ANSWER_STATUS_OPTIONS } from "./itemDetailUtils";

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
    <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Answer</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void onRegenerateAnswer(item.id)}
          className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-200 disabled:opacity-50"
        >
          {busyAction === "regen-answer" ? "..." : "Regenerate"}
        </button>
      </div>
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
            placeholder="Edit or verify..."
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
          />
        </FormField>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {answerActions(item).map(({ label, action }) => (
          <button
            key={label}
            type="button"
            disabled={busy}
            onClick={() => setFormState(action)}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600 transition hover:border-stone-400 disabled:opacity-50"
          >
            {label}
          </button>
        ))}
      </div>
      {answerFailureMessage && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{answerFailureMessage}</p>
      )}
    </div>
  );
}

function answerActions(item: MemoraItem): Array<{
  label: string;
  action: (state: ItemDetailFormState) => ItemDetailFormState;
}> {
  return [
    {
      label: "Use AI",
      action: (state: ItemDetailFormState) => ({ ...state, answerStatus: "GENERATED", answer: item.aiAnswer ?? state.answer })
    },
    { label: "Mark edited", action: (state: ItemDetailFormState) => ({ ...state, answerStatus: "EDITED" }) },
    { label: "Clear", action: (state: ItemDetailFormState) => ({ ...state, answerStatus: "NONE", answer: "" }) },
    { label: "Reject", action: (state: ItemDetailFormState) => ({ ...state, answerStatus: "REJECTED", answer: "" }) },
    { label: "Delete", action: (state: ItemDetailFormState) => ({ ...state, answerStatus: "DELETED", answer: "" }) }
  ];
}
