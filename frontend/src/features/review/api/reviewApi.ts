import { httpClient } from "../../../shared/api/httpClient";
import type { MemoraItemSummary } from "../types/MemoraItemSummary";

export async function fetchNeedsReview(): Promise<MemoraItemSummary[]> {
  return httpClient.get("/api/review/needs-review");
}

export async function fetchFailures(): Promise<MemoraItemSummary[]> {
  return httpClient.get("/api/review/failures");
}

export async function fetchApproved(): Promise<MemoraItemSummary[]> {
  return httpClient.get("/api/items/approved");
}
