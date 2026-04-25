import { useQuery } from "@tanstack/react-query";
import { fetchApproved, fetchCategories, fetchFailures, fetchItem, fetchNeedsReview } from "../api/reviewApi";
import type { ListParams } from "../types/reviewTypes";

export function useReviewQueries(params: {
  nrParams: ListParams;
  failParams: ListParams;
  approvedParams: ListParams;
  selectedItemId: string | null;
}) {
  const needsReview = useQuery({
    queryKey: ["review", "needs-review", params.nrParams],
    queryFn: () => fetchNeedsReview(params.nrParams)
  });
  const failures = useQuery({
    queryKey: ["review", "failures", params.failParams],
    queryFn: () => fetchFailures(params.failParams)
  });
  const approved = useQuery({
    queryKey: ["review", "approved", params.approvedParams],
    queryFn: () => fetchApproved(params.approvedParams)
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });
  const selectedItem = useQuery({
    queryKey: ["item", params.selectedItemId],
    queryFn: () => fetchItem(params.selectedItemId!),
    enabled: Boolean(params.selectedItemId)
  });

  return { needsReview, failures, approved, categories, selectedItem };
}
