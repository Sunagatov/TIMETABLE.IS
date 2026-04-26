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
  const saveLabel = props.view === "needs-review" ? "Save & approve below" : "Save changes below";

  return (
    <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_18px_50px_rgba(28,25,23,0.08)]">
      <div className="border-b border-stone-200 bg-[linear-gradient(135deg,rgba(251,191,36,0.10),rgba(255,255,255,1)_42%,rgba(245,240,232,0.85))] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Editor</p>
            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-stone-950">Refine this item before it ships</h2>
            <p className="mt-1 text-sm text-stone-500">Clean up the main content first, then verify the classification in the side panel.</p>
          </div>
          <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
            {saveLabel}
          </div>
        </div>
      </div>

      <div className="xl:grid xl:grid-cols-[minmax(0,1.7fr)_320px]">
        <div className="p-5 sm:p-6">
          <div className="space-y-5">
            <FormField label="Title">
              <input
                value={props.formState.title}
                onChange={(event) => props.setFormState((state) => ({ ...state, title: event.target.value }))}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100"
              />
            </FormField>
            <FormField label="Cleaned text">
              <textarea
                rows={10}
                value={props.formState.cleanedText}
                onChange={(event) => props.setFormState((state) => ({ ...state, cleanedText: event.target.value }))}
                className="min-h-[280px] w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100"
              />
            </FormField>
            {props.isQuestion && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50/40 p-4 sm:p-5">
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
        </div>

        <aside className="border-t border-stone-200 bg-stone-50/70 p-5 sm:p-6 xl:border-l xl:border-t-0">
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Metadata</p>
              <p className="mt-1 text-sm text-stone-500">These fields control how the item is classified in search and review.</p>
            </div>
            <div className="space-y-4">
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
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                >
                  <option value="">Select…</option>
                  {props.categories.map((category) => (
                    <option key={category.id} value={category.id}>{formatCategoryPath(category.path)}</option>
                  ))}
                </select>
              </FormField>
            </div>
            {props.validationError && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {props.validationError}
              </div>
            )}
          </div>
        </aside>
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
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
      >
        {props.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </FormField>
  );
}
