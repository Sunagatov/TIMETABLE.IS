import { describe, expect, it, vi } from "vitest";
import { buildQuery, fetchApproved, fetchFailures, fetchNeedsReview } from "./reviewApi";

describe("buildQuery", () => {
  it("strips empty values and ALL sentinels", () => {
    expect(buildQuery({ keyword: "", type: "ALL", priority: "URGENT_IMPORTANT" })).toBe("?priority=URGENT_IMPORTANT");
  });

  it("preserves createdFrom and createdTo names", () => {
    expect(buildQuery({ createdFrom: "2026-01-01", createdTo: "2026-01-31" })).toBe("?createdFrom=2026-01-01&createdTo=2026-01-31");
  });
});

describe("view endpoints", () => {
  it("uses the backend-backed list endpoints", async () => {
    const calls: string[] = [];
    vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
      calls.push(String(input));
      return Promise.resolve(new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } }));
    });

    await fetchNeedsReview();
    await fetchFailures();
    await fetchApproved();

    expect(calls.map((call) => new URL(call).pathname)).toEqual([
      "/api/review/needs-review",
      "/api/review/failures",
      "/api/items/approved"
    ]);
    vi.unstubAllGlobals();
  });
});
