import { useMemo, useState } from "react";
import type {
  ApprovedFilters,
  CategoryPathFilter,
  FailuresFilters,
  ListParams,
  NeedsReviewFilters
} from "../types/reviewTypes";

export type ReviewView = "needs-review" | "failures" | "approved";
export type MobilePanel = "sidebar" | "list" | "detail";

export const DEFAULT_NR_FILTERS: NeedsReviewFilters = {
  keyword: "",
  type: "ALL",
  priority: "ALL",
  category: "",
  subcategory: "",
  createdFrom: "",
  createdTo: "",
  sort: "createdAt-desc"
};

export const DEFAULT_FAIL_FILTERS: FailuresFilters = {
  keyword: "",
  type: "ALL",
  priority: "ALL",
  status: "ALL",
  category: "",
  subcategory: "",
  createdFrom: "",
  createdTo: "",
  sort: "createdAt-desc"
};

export const DEFAULT_APPROVED_FILTERS: ApprovedFilters = {
  keyword: "",
  type: "ALL",
  priority: "ALL",
  status: "ALL",
  category: "",
  subcategory: "",
  createdFrom: "",
  createdTo: "",
  sort: "createdAt-desc"
};

export function useReviewWorkspaceState() {
  const [view, setView] = useState<ReviewView>("needs-review");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [nrFilters, setNrFilters] = useState<NeedsReviewFilters>(DEFAULT_NR_FILTERS);
  const [failFilters, setFailFilters] = useState<FailuresFilters>(DEFAULT_FAIL_FILTERS);
  const [approvedFilters, setApprovedFilters] = useState<ApprovedFilters>(DEFAULT_APPROVED_FILTERS);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("list");

  const nrParams = useMemo(() => toListParams(nrFilters), [nrFilters]);
  const failParams = useMemo(() => toListParams(failFilters), [failFilters]);
  const approvedParams = useMemo(() => toListParams(approvedFilters), [approvedFilters]);

  const activeCategoryFilter = activeCategoryForView(view, nrFilters, failFilters, approvedFilters);

  function setActiveCategoryFilter(next: CategoryPathFilter) {
    if (view === "needs-review") {
      setNrFilters((filters) => ({ ...filters, ...next }));
    } else if (view === "failures") {
      setFailFilters((filters) => ({ ...filters, ...next }));
    } else {
      setApprovedFilters((filters) => ({ ...filters, ...next }));
    }
  }

  return {
    view,
    setView,
    selectedItemId,
    setSelectedItemId,
    busyAction,
    setBusyAction,
    actionError,
    setActionError,
    nrFilters,
    setNrFilters,
    failFilters,
    setFailFilters,
    approvedFilters,
    setApprovedFilters,
    mobilePanel,
    setMobilePanel,
    nrParams,
    failParams,
    approvedParams,
    activeCategoryFilter,
    setActiveCategoryFilter
  };
}

export function toListParams(filters: Record<string, string>): ListParams {
  const params: ListParams = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== "ALL") {
      (params as Record<string, string>)[key] = value;
    }
  }
  return params;
}

function activeCategoryForView(
  view: ReviewView,
  nrFilters: NeedsReviewFilters,
  failFilters: FailuresFilters,
  approvedFilters: ApprovedFilters
): CategoryPathFilter {
  const filters = view === "needs-review" ? nrFilters : view === "failures" ? failFilters : approvedFilters;
  return {
    category: filters.category,
    subcategory: filters.subcategory
  };
}
