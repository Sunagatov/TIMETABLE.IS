import type { Dispatch, SetStateAction } from "react";
import type { MemoraCategory, MemoraItem, UpdateItemRequest } from "../../types/reviewTypes";
import { CheckIcon, FormField } from "./DetailPrimitives";
import { AnswerEditor } from "./AnswerEditor";
import type { DetailView, ItemDetailFormState } from "./itemDetailUtils";
import { formatCategoryPath, PRIORITY_OPTIONS, TYPE_OPTIONS } from "./itemDetailUtils";

type Props = {
  view: DetailView;
  item: MemoraItem;
  categories: MemoraCategory[];
  busy: boolean;
  busyAction: string | null;
  isQuestion: boolean;
  answerFailureMessage: string | null;
  formState: ItemDetailFormState;
  setFormState: Dispatch<SetStateAction<ItemDetailFormState>>;
  request: UpdateItemRequest;
  onEditAndApprove: (itemId: string, request: UpdateItemRequest) => Promise<void>;
  onRegenerateAnswer: (itemId: string) => Promise<void>;
};

export function ItemEditForm(props: Props) {
  return (
    <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50/60 p-5">
      <p className="mb-4 text-sm font-semibold text-stone-700">Edit fields</p>
      <div className="space-y-4">
        <FormField label="Title">
          <input
            value={props.formState.title}
            onChange={(event) => props.setFormState((state) => ({ ...state, title: event.target.value }))}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
          />
        </FormField>
        <FormField label="Cleaned Text">
          <textarea
            rows={7}
            value={props.formState.cleanedText}
            onChange={(event) => props.setFormState((state) => ({ ...state, cleanedText: event.target.value }))}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
          />
        </FormField>
        {props.formState.rawTranscript && (
          <FormField label="Raw Transcript">
            <textarea
              rows={3}
              value={props.formState.rawTranscript}
              onChange={(event) => props.setFormState((state) => ({ ...state, rawTranscript: event.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
            />
          </FormField>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField label="Type" value={props.formState.type} options={TYPE_OPTIONS} onChange={(type) => props.setFormState((state) => ({ ...state, type }))} />
          <SelectField label="Priority" value={props.formState.priority} options={PRIORITY_OPTIONS} onChange={(priority) => props.setFormState((state) => ({ ...state, priority }))} />
          <FormField label="Category">
            <select
              value={props.formState.categoryId}
              onChange={(event) => props.setFormState((state) => ({ ...state, categoryId: event.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
            >
              <option value="">Select...</option>
              {props.categories.map((category) => (
                <option key={category.id} value={category.id}>{formatCategoryPath(category.path)}</option>
              ))}
            </select>
          </FormField>
        </div>
        {props.isQuestion && (
          <AnswerEditor
            item={props.item}
            busy={props.busy}
            busyAction={props.busyAction}
            answerFailureMessage={props.answerFailureMessage}
            formState={props.formState}
            setFormState={props.setFormState}
            onRegenerateAnswer={props.onRegenerateAnswer}
          />
        )}
        {props.view === "needs-review" && (
          <button
            type="button"
            disabled={props.busy}
            onClick={() => void props.onEditAndApprove(props.item.id, props.request)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-55"
          >
            <CheckIcon />
            {props.busyAction === "edit-approve" ? "Approving..." : "Confirm Edit & Approve"}
          </button>
        )}
      </div>
    </div>
  );
}

function SelectField(props: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <FormField label={props.label}>
      <select
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
      >
        {props.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </FormField>
  );
}
