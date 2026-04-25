import type {
  ApprovedFilters,
  FailuresFilters,
  ItemStatus,
  ItemType,
  ListSort,
  NeedsReviewFilters,
  Priority
} from "./types/reviewTypes";

export const ALL_FILTER_VALUE = "ALL" as const;
export const DEFAULT_LIST_SORT: ListSort = "createdAt-desc";

export const REVIEW_LIST_SORT_OPTIONS: ListSort[] = [
  "createdAt-desc",
  "createdAt-asc",
  "title-asc",
  "title-desc",
  "category-asc",
  "category-desc"
];

export const ITEM_TYPE_FILTER_OPTIONS: Array<ItemType | typeof ALL_FILTER_VALUE> = [
  ALL_FILTER_VALUE,
  "IDEA",
  "THOUGHT",
  "QUESTION",
  "REMINDER",
  "OTHER"
];

export const PRIORITY_FILTER_OPTIONS: Array<Priority | typeof ALL_FILTER_VALUE> = [
  ALL_FILTER_VALUE,
  "URGENT_IMPORTANT",
  "URGENT_NOT_IMPORTANT",
  "NOT_URGENT_IMPORTANT",
  "NOT_URGENT_NOT_IMPORTANT",
  "NOT_APPLICABLE"
];

export const FAILURE_STATUS_FILTER_OPTIONS: Array<
  Extract<ItemStatus, "TRANSCRIPTION_FAILED" | "AI_PROCESSING_FAILED"> | typeof ALL_FILTER_VALUE
> = [ALL_FILTER_VALUE, "TRANSCRIPTION_FAILED", "AI_PROCESSING_FAILED"];

export const APPROVED_STATUS_FILTER_OPTIONS: Array<
  Extract<ItemStatus, "HUMAN_APPROVED" | "HUMAN_EDITED_APPROVED"> | typeof ALL_FILTER_VALUE
> = [ALL_FILTER_VALUE, "HUMAN_APPROVED", "HUMAN_EDITED_APPROVED"];

export const REVIEW_API_PATHS = {
  needsReview: "/api/review/needs-review",
  failures: "/api/review/failures",
  approved: "/api/items/approved",
  categories: "/api/categories",
  item: (itemId: string) => `/api/items/${itemId}`,
  category: (categoryId: string) => `/api/categories/${categoryId}`,
  reviewAction: (itemId: string, action: string) => `/api/review/${itemId}/${action}`
} as const;

export const DEFAULT_NEEDS_REVIEW_FILTERS: NeedsReviewFilters = {
  keyword: "",
  type: ALL_FILTER_VALUE,
  priority: ALL_FILTER_VALUE,
  category: "",
  subcategory: "",
  createdFrom: "",
  createdTo: "",
  sort: DEFAULT_LIST_SORT
};

export const DEFAULT_FAILURE_FILTERS: FailuresFilters = {
  keyword: "",
  type: ALL_FILTER_VALUE,
  priority: ALL_FILTER_VALUE,
  status: ALL_FILTER_VALUE,
  category: "",
  subcategory: "",
  createdFrom: "",
  createdTo: "",
  sort: DEFAULT_LIST_SORT
};

export const DEFAULT_APPROVED_FILTERS: ApprovedFilters = {
  keyword: "",
  type: ALL_FILTER_VALUE,
  priority: ALL_FILTER_VALUE,
  status: ALL_FILTER_VALUE,
  category: "",
  subcategory: "",
  createdFrom: "",
  createdTo: "",
  sort: DEFAULT_LIST_SORT
};
