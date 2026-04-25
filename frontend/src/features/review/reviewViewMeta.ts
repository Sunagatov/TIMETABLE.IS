export type ReviewView = "needs-review" | "failures" | "approved";

export const REVIEW_VIEW_ORDER: ReviewView[] = ["needs-review", "failures", "approved"];

export const REVIEW_VIEW_META: Record<
  ReviewView,
  {
    title: string;
    description: string;
    accentBorderClass: string;
    accentDotClass: string;
    countClass: string;
    navCountClass: string;
  }
> = {
  "needs-review": {
    title: "Needs Review",
    description: "Unapproved items waiting for human review.",
    accentBorderClass: "border-l-amber-400",
    accentDotClass: "bg-amber-500",
    countClass: "bg-amber-100 text-amber-700",
    navCountClass: "bg-amber-500/20 text-amber-400"
  },
  failures: {
    title: "Failures",
    description: "Items that failed at a processing stage and remain retryable.",
    accentBorderClass: "border-l-red-400",
    accentDotClass: "bg-red-500",
    countClass: "bg-red-100 text-red-700",
    navCountClass: "bg-red-500/20 text-red-400"
  },
  approved: {
    title: "Approved",
    description: "Human-approved items only.",
    accentBorderClass: "border-l-emerald-400",
    accentDotClass: "bg-emerald-500",
    countClass: "bg-emerald-100 text-emerald-700",
    navCountClass: "bg-emerald-500/20 text-emerald-400"
  }
};
