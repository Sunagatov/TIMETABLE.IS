import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApproved, fetchFailures, fetchNeedsReview } from "../api/reviewApi";
import { ReviewSidebar } from "../components/ReviewSidebar";
import { ReviewWorkspaceShell } from "../components/ReviewWorkspaceShell";

type View = "needs-review" | "failures" | "approved";

type Props = {
  onLoggedOut: () => void | Promise<void>;
};

export function ReviewWorkspacePage({ onLoggedOut }: Props) {
  const [view, setView] = useState<View>("needs-review");

  const needsReview = useQuery({
    queryKey: ["review", "needs-review"],
    queryFn: fetchNeedsReview
  });

  const failures = useQuery({
    queryKey: ["review", "failures"],
    queryFn: fetchFailures
  });

  const approved = useQuery({
    queryKey: ["review", "approved"],
    queryFn: fetchApproved
  });

  const items =
    view === "needs-review"
      ? needsReview.data ?? []
      : view === "failures"
        ? failures.data ?? []
        : approved.data ?? [];

  const title =
    view === "needs-review" ? "Needs Review" : view === "failures" ? "Failures" : "Approved";

  const description =
    view === "needs-review"
      ? "Unapproved items waiting for human review."
      : view === "failures"
        ? "Items that failed at a processing stage."
        : "Human-approved items.";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-[280px_1fr]">
        <ReviewSidebar view={view} onChange={setView} onLoggedOut={() => void onLoggedOut()} />
        <ReviewWorkspaceShell title={title} description={description} items={items} />
      </div>
    </main>
  );
}
