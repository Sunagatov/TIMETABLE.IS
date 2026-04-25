import { httpClient } from "../../../shared/api/httpClient";
import { ALL_FILTER_VALUE, REVIEW_API_PATHS } from "../reviewConstants";
import type {
  CreateCategoryRequest,
  ListParams,
  MemoraCategory,
  MemoraItem,
  RenameCategoryRequest,
  UpdateItemRequest
} from "../types/reviewTypes";

export function buildQuery(params: Record<string, string | undefined>): string {
  const entries = (Object.entries(params) as [string, string | undefined][]).filter(
    ([key, v]) => key !== "subsubcategory" && Boolean(v) && v !== ALL_FILTER_VALUE
  ) as [string, string][];
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries).toString();
}

export async function fetchNeedsReview(params: ListParams = {}): Promise<MemoraItem[]> {
  return httpClient.get(`${REVIEW_API_PATHS.needsReview}${buildQuery(params)}`);
}

export async function fetchFailures(params: ListParams = {}): Promise<MemoraItem[]> {
  return httpClient.get(`${REVIEW_API_PATHS.failures}${buildQuery(params)}`);
}

export async function fetchApproved(params: ListParams = {}): Promise<MemoraItem[]> {
  return httpClient.get(`${REVIEW_API_PATHS.approved}${buildQuery(params)}`);
}

export async function fetchItem(itemId: string): Promise<MemoraItem> {
  return httpClient.get(REVIEW_API_PATHS.item(itemId));
}

export async function updateItem(itemId: string, request: UpdateItemRequest): Promise<MemoraItem> {
  return httpClient.patch(REVIEW_API_PATHS.item(itemId), request);
}

export async function approveItem(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "approve"));
}

export async function editAndApproveItem(
  itemId: string,
  request: UpdateItemRequest
): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "edit-and-approve"), request);
}

export async function approveCategoryProposal(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "category-proposal/approve"));
}

export async function rejectCategoryProposal(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "category-proposal/reject"));
}

export async function rejectItem(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "reject"));
}

export async function trashItem(itemId: string): Promise<MemoraItem> {
  return httpClient.delete(REVIEW_API_PATHS.reviewAction(itemId, "trash"));
}

export async function retryItem(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "retry"));
}

export async function regenerateCleanedText(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "regenerate-cleaned-text"));
}

export async function regenerateAnswer(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "regenerate-answer"));
}

export async function regenerateCategoryProposal(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "regenerate-category-proposal"));
}

export async function regenerateAll(itemId: string): Promise<MemoraItem> {
  return httpClient.post(REVIEW_API_PATHS.reviewAction(itemId, "regenerate-all"));
}

export async function fetchCategories(): Promise<MemoraCategory[]> {
  return httpClient.get<MemoraCategory[]>(REVIEW_API_PATHS.categories);
}

export async function createCategory(request: CreateCategoryRequest): Promise<MemoraCategory> {
  return httpClient.post<MemoraCategory>(REVIEW_API_PATHS.categories, request);
}

export async function renameCategory(
  categoryId: string,
  request: RenameCategoryRequest
): Promise<MemoraCategory> {
  return httpClient.patch<MemoraCategory>(REVIEW_API_PATHS.category(categoryId), request);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return httpClient.delete<void>(REVIEW_API_PATHS.category(categoryId));
}
