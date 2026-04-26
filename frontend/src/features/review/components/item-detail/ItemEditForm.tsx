import type { Dispatch, SetStateAction } from "react";
import type { MemoraCategory, MemoraItem, UpdateItemRequest } from "../../types/reviewTypes";
import type { ItemType, Priority } from "../../types/reviewTypes";
import { FormField } from "./DetailPrimitives";
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
  validationError: string | null;
  formState: ItemDetailFormState;
  setFormState: Dispatch<SetStateAction<ItemDetailFormState>>;
  request: UpdateItemRequest;
  onEditAndApprove: (itemId: string, request: UpdateItemRequest) => Promise<void>;
  onRegenerateAnswer: (itemId: string) => Promise<void>;
};

export function ItemEditForm(props: Props) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/50">

      {/* Content section */}
      <div className="p-5">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Content</p>
        <div className="space-y-4">
          <FormField label="Title">
            <input
              value={props.formState.title}
              onChange={(event) => props.setFormState((state) => ({ ...state, title: event.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
            />
          </FormField>
          <FormField label="Cleaned text">
            <textarea
              rows={7}
              value={props.formState.cleanedText}
              onChange={(event) => props.setFormState((state) => ({ ...state, cleanedText: event.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
            />
          </FormField>
        </div>
      </div>

      {/* Metadata section */}
      <div className="border-t border-stone-200 bg-white/60 p-5">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Metadata</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField
            label="Type"
            value={props.formState.type}
            options={TYPE_OPTIONS}
            onChange={(type) => props.setFormState((state) => ({ ...state, type: type as ItemType }))}
          />
          <SelectField
            label="Priority"
            value={props.formState.priority}
            options={PRIORITY_OPTIONS}
            onChange={(priority) => props.setFormState((state) => ({ ...state, priority: priority as Priority }))}
          />
          <FormField label="Category">
            <select
              value={props.formState.categoryId}
              onChange={(event) => props.setFormState((state) => ({ ...state, categoryId: event.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
            >
              <option value="">Select…</option>
              {props.categories.map((category) => (
                <option key={category.id} value={category.id}>{formatCategoryPath(category.path)}</option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      {/* Answer section (questions only) */}
      {props.isQuestion && (
        <div className="border-t border-stone-200 p-5">
          <AnswerEditor
            item={props.item}
            busy={props.busy}
            busyAction={props.busyAction}
            answerFailureMessage={props.answerFailureMessage}
            formState={props.formState}
            setFormState={props.setFormState}
            onRegenerateAnswer={props.onRegenerateAnswer}
          />
        </div>
      )}

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
