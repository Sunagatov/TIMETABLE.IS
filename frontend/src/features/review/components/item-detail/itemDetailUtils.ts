import type { CategoryPath, MemoraCategory, MemoraItem, UpdateItemRequest } from "../../types/reviewTypes";

export type DetailView = "needs-review" | "failures" | "approved";

export type ItemDetailFormState = {
  title: string;
  cleanedText: string;
  rawTranscript: string;
  type: string;
  priority: string;
  categoryId: string;
  answer: string;
  answerStatus: string;
};

export const ANSWER_STATUS_OPTIONS = ["NONE", "GENERATED", "EDITED", "REJECTED", "DELETED"];
export const TYPE_OPTIONS = ["IDEA", "THOUGHT", "QUESTION", "REMINDER", "OTHER"];
export const PRIORITY_OPTIONS = [
  "URGENT_IMPORTANT",
  "URGENT_NOT_IMPORTANT",
  "NOT_URGENT_IMPORTANT",
  "NOT_URGENT_NOT_IMPORTANT",
  "NOT_APPLICABLE"
];

export const EMPTY_FORM_STATE: ItemDetailFormState = {
  title: "",
  cleanedText: "",
  rawTranscript: "",
  type: "OTHER",
  priority: "NOT_APPLICABLE",
  categoryId: "",
  answer: "",
  answerStatus: "NONE"
};

export function formStateFromItem(item: MemoraItem, categories: MemoraCategory[]): ItemDetailFormState {
  const matchingCategory = categories.find((category) => samePath(category.path, item.categoryPath));
  return {
    title: item.title,
    cleanedText: item.cleanedText,
    rawTranscript: item.rawTranscript ?? "",
    type: item.type,
    priority: item.priority,
    categoryId: matchingCategory?.id ?? "",
    answer: item.answer ?? "",
    answerStatus: item.answerStatus
  };
}

export function buildUpdateItemRequest(
  formState: ItemDetailFormState,
  categories: MemoraCategory[]
): UpdateItemRequest {
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
}

export function normalizeAnswerStatus(status: string, answer: string): string | undefined {
  if (status === "FAILED") return answer.trim() ? "EDITED" : undefined;
  return ANSWER_STATUS_OPTIONS.includes(status) ? status : answer.trim() ? "EDITED" : "NONE";
}

export function isQuestionItem(item: MemoraItem): boolean {
  return item.type === "QUESTION" || item.aiType === "QUESTION";
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function formatCategoryPath(path: CategoryPath) {
  return `${path.category} / ${path.subcategory} / ${path.subsubcategory}`;
}

export function proposalLabel(status: string) {
  if (status === "PENDING_REVIEW") return "pending review";
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "rejected";
  return "none";
}

export function priorityLabel(priority: string): string {
  if (priority === "URGENT_IMPORTANT") return "Urgent & important";
  if (priority === "URGENT_NOT_IMPORTANT") return "Urgent, not important";
  if (priority === "NOT_URGENT_IMPORTANT") return "Important";
  if (priority === "NOT_URGENT_NOT_IMPORTANT") return "Low priority";
  return priority;
}

export function samePath(left: CategoryPath, right: CategoryPath): boolean {
  return left.category === right.category &&
    left.subcategory === right.subcategory &&
    left.subsubcategory === right.subsubcategory;
}
