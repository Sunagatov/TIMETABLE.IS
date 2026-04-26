import type {
  ApprovedFilters,
  FailuresFilters,
  ListSort,
  NeedsReviewFilters
} from "./types/reviewTypes";

type FilterOption = {
  value: string;
  label: string;
};

export const ALL_FILTER_VALUE = "ALL" as const;
export const DEFAULT_LIST_SORT: ListSort = "createdAt-desc";

export const REVIEW_LIST_SORT_OPTIONS: FilterOption[] = [
  { value: "createdAt-desc", label: "Newest" },
  { value: "createdAt-asc", label: "Oldest" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "category-asc", label: "Category A-Z" },
  { value: "category-desc", label: "Category Z-A" }
];

export const ITEM_TYPE_FILTER_OPTIONS: FilterOption[] = [
  { value: ALL_FILTER_VALUE, label: "All types" },
  { value: "IDEA", label: "Idea" },
  { value: "THOUGHT", label: "Thought" },
  { value: "QUESTION", label: "Question" },
  { value: "REMINDER", label: "Reminder" },
  { value: "OTHER", label: "Other" }
];

export const PRIORITY_FILTER_OPTIONS: FilterOption[] = [
  { value: ALL_FILTER_VALUE, label: "All priorities" },
  { value: "URGENT_IMPORTANT", label: "Urgent + important" },
  { value: "URGENT_NOT_IMPORTANT", label: "Urgent only" },
  { value: "NOT_URGENT_IMPORTANT", label: "Important only" },
  { value: "NOT_URGENT_NOT_IMPORTANT", label: "Low priority" },
  { value: "NOT_APPLICABLE", label: "Not applicable" }
];

export const FAILURE_STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: ALL_FILTER_VALUE, label: "All statuses" },
  { value: "TRANSCRIPTION_FAILED", label: "Transcription failed" },
  { value: "AI_PROCESSING_FAILED", label: "AI processing failed" }
];

export const APPROVED_STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: ALL_FILTER_VALUE, label: "All statuses" },
  { value: "HUMAN_APPROVED", label: "Approved" },
  { value: "HUMAN_EDITED_APPROVED", label: "Edited + approved" }
];

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
