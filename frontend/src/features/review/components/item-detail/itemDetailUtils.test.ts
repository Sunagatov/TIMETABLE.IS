import { describe, expect, it } from "vitest";
import { buildUpdateItemRequest } from "./itemDetailUtils";
import type { MemoraCategory } from "../../types/reviewTypes";

const categories: MemoraCategory[] = [{
  id: "cat-1",
  path: { category: "Work", subcategory: "Planning", subsubcategory: "Roadmap" },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z"
}];

describe("buildUpdateItemRequest", () => {
  it("omits answer text when answer is rejected or deleted", () => {
    const base = {
      title: "Title",
      cleanedText: "Text",
      rawTranscript: "",
      type: "QUESTION",
      priority: "NOT_APPLICABLE",
      categoryId: "cat-1",
      answer: "Do not keep this",
      answerStatus: "REJECTED"
    };

    expect(buildUpdateItemRequest(base, categories)).toMatchObject({
      answer: undefined,
      answerStatus: "REJECTED"
    });
    expect(buildUpdateItemRequest({ ...base, answerStatus: "DELETED" }, categories)).toMatchObject({
      answer: undefined,
      answerStatus: "DELETED"
    });
  });

  it("keeps answer text for generated and edited answers", () => {
    expect(buildUpdateItemRequest({
      title: "Title",
      cleanedText: "Text",
      rawTranscript: "",
      type: "QUESTION",
      priority: "NOT_APPLICABLE",
      categoryId: "cat-1",
      answer: "Keep this",
      answerStatus: "EDITED"
    }, categories)).toMatchObject({
      answer: "Keep this",
      answerStatus: "EDITED",
      categoryPath: categories[0].path
    });
  });
});
