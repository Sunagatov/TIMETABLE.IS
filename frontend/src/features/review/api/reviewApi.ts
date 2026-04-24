import { httpClient } from "../../../shared/api/httpClient";
import type {
  CreateCategoryRequest,
  MemoraCategory,
  MemoraItem,
  RenameCategoryRequest,
  UpdateItemRequest
} from "../types/reviewTypes";

export async function fetchNeedsReview(): Promise<MemoraItem[]> {
  return httpClient.get("/api/review/needs-review");
}

export async function fetchFailures(): Promise<MemoraItem[]> {
  return httpClient.get("/api/review/failures");
}

export async function fetchApproved(): Promise<MemoraItem[]> {
  return httpClient.get("/api/items/approved");
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

export async function rejectItem(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/reject`);
}

export async function trashItem(itemId: string): Promise<MemoraItem> {
  return httpClient.delete(`/api/review/${itemId}/trash`);
}

export async function retryItem(itemId: string): Promise<MemoraItem> {
  return httpClient.post(`/api/review/${itemId}/retry`);
}

export async function fetchCategories(): Promise<MemoraCategory[]> {
  return httpClient.get<MemoraCategory[]>("/api/categories");
}

export async function createCategory(
  request: CreateCategoryRequest
): Promise<MemoraCategory> {
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
