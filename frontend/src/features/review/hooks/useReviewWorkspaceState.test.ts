import { describe, expect, it } from "vitest";
import { toListParams } from "./useReviewWorkspaceState";

describe("toListParams", () => {
  it("strips empty values and ALL while preserving backend date param names", () => {
    expect(
      toListParams({
        keyword: "test",
        type: "ALL",
        priority: "",
        createdFrom: "2026-01-01",
        createdTo: "2026-01-31",
        sort: "createdAt-desc"
      })
    ).toEqual({
      keyword: "test",
      createdFrom: "2026-01-01",
      createdTo: "2026-01-31",
      sort: "createdAt-desc"
    });
  });
});
