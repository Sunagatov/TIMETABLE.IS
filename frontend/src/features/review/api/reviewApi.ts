import { httpClient } from "../../../shared/api/httpClient";
import type {
  MemoraCategory,
  MemoraItem,
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
  return httpClient.get("/api/categories");
}
