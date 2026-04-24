export type CategoryPath = {
  category: string;
  subcategory: string;
  subsubcategory: string;
};

export type TelegramVoiceTrace = {
  telegramUserId: string;
  telegramChatId: string;
  telegramMessageId: string;
  telegramFileId: string | null;
  telegramFileUniqueId: string | null;
  durationSeconds: number | null;
  mimeType: string | null;
};

export type MemoraItem = {
  id: string;
  sourceType: string;
  rawInputText: string | null;
  rawTranscript: string | null;
  aiTitle: string;
  aiCleanedText: string;
  aiType: string;
  aiCategoryPath: CategoryPath;
  aiPriority: string;
  title: string;
  cleanedText: string;
  type: string;
  categoryPath: CategoryPath;
  priority: string;
  status: string;
  retryCountTranscription: number;
  retryCountAi: number;
  failureStage: string | null;
  failureReason: string | null;
  telegramTrace: TelegramVoiceTrace | null;
  createdAt: string;
  updatedAt: string;
};

export type MemoraCategory = {
  id: string;
  path: CategoryPath;
  createdAt: string;
  updatedAt: string;
};

export type CategoryPathRequest = {
  category: string;
  subcategory: string;
  subsubcategory: string;
};

export type CategoryPathFilter = {
  category: string;
  subcategory: string;
  subsubcategory: string;
};

export type CreateCategoryRequest = {
  path: CategoryPathRequest;
};

export type RenameCategoryRequest = {
  path: CategoryPathRequest;
};

export type UpdateItemRequest = {
  title?: string;
  cleanedText?: string;
  rawTranscript?: string;
  type?: string;
  categoryPath?: CategoryPathRequest;
  priority?: string;
};

export type ListSort =
  | "createdAt-desc"
  | "createdAt-asc"
  | "title-asc"
  | "title-desc"
  | "category-asc"
  | "category-desc";

export type ApprovedSort = ListSort;

export type ListParams = {
  keyword?: string;
  type?: string;
  priority?: string;
  status?: string;
  category?: string;
  subcategory?: string;
  subsubcategory?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
};

export type NeedsReviewFilters = {
  keyword: string;
  type: string;
  priority: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
  dateFrom: string;
  dateTo: string;
  sort: ListSort;
};

export type FailuresFilters = {
  keyword: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
  dateFrom: string;
  dateTo: string;
};

export type ApprovedFilters = {
  keyword: string;
  type: string;
  priority: string;
  status: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
  dateFrom: string;
  dateTo: string;
  sort: ListSort;
};
