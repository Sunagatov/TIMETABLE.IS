export type CategoryPath = {
  category: string;
  subcategory: string;
};

export type SourceType = "TELEGRAM_TEXT" | "TELEGRAM_VOICE";
export type ItemType = "IDEA" | "THOUGHT" | "QUESTION" | "REMINDER" | "OTHER";
export type Priority =
  | "URGENT_IMPORTANT"
  | "URGENT_NOT_IMPORTANT"
  | "NOT_URGENT_IMPORTANT"
  | "NOT_URGENT_NOT_IMPORTANT"
  | "NOT_APPLICABLE";
export type ItemStatus =
  | "RECEIVED"
  | "AI_PROCESSED_UNREVIEWED"
  | "TRANSCRIPTION_FAILED"
  | "AI_PROCESSING_FAILED"
  | "HUMAN_APPROVED"
  | "HUMAN_EDITED_APPROVED"
  | "REJECTED"
  | "DELETED";
export type AnswerStatus = "NONE" | "GENERATED" | "EDITED" | "REJECTED" | "DELETED" | "FAILED";
export type ProposedCategoryStatus = "NONE" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export type TelegramVoiceTrace = {
  telegramUserId: string;
  telegramChatId: string;
  telegramMessageId: string;
  telegramFileId: string | null;
  telegramFileUniqueId: string | null;
  durationSeconds: number | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
};

export type MemoraItem = {
  id: string;
  sourceType: SourceType;
  rawInputText: string | null;
  rawTranscript: string | null;
  aiTitle: string;
  aiCleanedText: string;
  aiType: ItemType;
  aiCategoryPath: CategoryPath;
  proposedCategoryPath: CategoryPath | null;
  proposedCategoryStatus: ProposedCategoryStatus;
  aiPriority: Priority;
  aiAnswer: string | null;
  title: string;
  cleanedText: string;
  type: ItemType;
  categoryPath: CategoryPath;
  priority: Priority;
  answer: string | null;
  answerStatus: AnswerStatus;
  answerFailureStage: string | null;
  answerFailureReason: string | null;
  status: ItemStatus;
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
};

export type CategoryPathFilter = {
  category: string;
  subcategory: string;
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
  type?: ItemType;
  categoryPath?: CategoryPathRequest;
  priority?: Priority;
  answer?: string;
  answerStatus?: AnswerStatus;
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
  type?: ItemType;
  priority?: Priority;
  status?: ItemStatus;
  category?: string;
  subcategory?: string;
  createdFrom?: string;
  createdTo?: string;
  sort?: string;
};

export type NeedsReviewFilters = {
  keyword: string;
  type: ItemType | "ALL";
  priority: Priority | "ALL";
  category: string;
  subcategory: string;
  createdFrom: string;
  createdTo: string;
  sort: ListSort;
};

export type FailuresFilters = {
  keyword: string;
  type: ItemType | "ALL";
  priority: Priority | "ALL";
  status: Extract<ItemStatus, "TRANSCRIPTION_FAILED" | "AI_PROCESSING_FAILED"> | "ALL";
  category: string;
  subcategory: string;
  createdFrom: string;
  createdTo: string;
  sort: ListSort;
};

export type ApprovedFilters = {
  keyword: string;
  type: ItemType | "ALL";
  priority: Priority | "ALL";
  status: Extract<ItemStatus, "HUMAN_APPROVED" | "HUMAN_EDITED_APPROVED"> | "ALL";
  category: string;
  subcategory: string;
  createdFrom: string;
  createdTo: string;
  sort: ListSort;
};
