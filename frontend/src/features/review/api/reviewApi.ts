import { httpClient } from "../../../shared/api/httpClient";
import type {
  CreateCategoryRequest,
  ListParams,
  MemoraCategory,
  MemoraItem,
  RenameCategoryRequest,
  UpdateItemRequest
} from "../types/reviewTypes";

export function buildQuery(params: ListParams): string {
  const entries = (Object.entries(params) as [string, string | undefined][]).filter(
    ([, v]) => Boolean(v) && v !== "ALL"
  ) as [string, string][];
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries).toString();
}

export async function fetchNeedsReview(params: ListParams = {}): Promise<MemoraItem[]> {
  return httpClient.get(`/api/review/needs-review${buildQuery(params)}`);
}

export async function fetchFailures(params: ListParams = {}): Promise<MemoraItem[]> {
  return httpClient.get(`/api/review/failures${buildQuery(params)}`);
}

export async function fetchApproved(params: ListParams = {}): Promise<MemoraItem[]> {
  return httpClient.get(`/api/items/approved${buildQuery(params)}`);
}

export async function fetchItem(itemId: string): Promise<MemoraItem> {
  return httpClient.get(`/api/items/${itemId}`);
}

export async function updateItem(itemId: string, request: UpdateItemRequest): Promise<MemoraItem> {
  return httpClient.patch(`/api/items/${itemId}`, request);
}

export async function approveItem(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/approve`);
}

export async function editAndApproveItem(
  itemId: string,
  request: UpdateItemRequest
): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/edit-and-approve`, request);
}

export async function approveCategoryProposal(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/category-proposal/approve`);
}

export async function rejectCategoryProposal(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/category-proposal/reject`);
}

export async function rejectItem(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/reject`);
}

export async function trashItem(itemId: string): Promise<MemoraItem> {
  return httpClient.delete(`/api/review/${itemId}/trash`);
}

export async function retryItem(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/retry`);
}

export async function regenerateCleanedText(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/regenerate-cleaned-text`);
}

export async function regenerateAnswer(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/regenerate-answer`);
}

export async function regenerateCategoryProposal(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/regenerate-category-proposal`);
}

export async function regenerateAll(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/regenerate-all`);
}

export async function fetchCategories(): Promise<MemoraCategory[]> {
  return httpClient.get<MemoraCategory[]>("/api/categories");
}

export async function createCategory(request: CreateCategoryRequest): Promise<MemoraCategory> {
  return httpClient.post<MemoraCategory>("/api/categories", request);
}

export async function renameCategory(
  categoryId: string,
  request: RenameCategoryRequest
): Promise<MemoraCategory> {
  return httpClient.patch<MemoraCategory>(`/api/categories/${categoryId}`, request);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return httpClient.delete<void>(`/api/categories/${categoryId}`);
}
