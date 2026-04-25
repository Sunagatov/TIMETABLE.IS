import { describe, expect, it } from "vitest";
import {
  buildUpdateItemRequest,
  formStateFromItem,
  getUpdateRequestValidationError,
  normalizeAnswerStatus
} from "./itemDetailUtils";
import type { MemoraCategory, MemoraItem } from "../../types/reviewTypes";

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
      type: "QUESTION" as const,
      priority: "NOT_APPLICABLE" as const,
      categoryId: "cat-1",
      answer: "Do not keep this",
      answerStatus: "REJECTED" as const
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
      type: "QUESTION" as const,
      priority: "NOT_APPLICABLE" as const,
      categoryId: "cat-1",
      answer: "Keep this",
      answerStatus: "EDITED" as const
    }, categories)).toMatchObject({
      answer: "Keep this",
      answerStatus: "EDITED",
      categoryPath: categories[0].path
    });
  });

  it("does not send generated or edited answer status without answer text", () => {
    const base = {
      title: "Title",
      cleanedText: "Text",
      rawTranscript: "",
      type: "QUESTION" as const,
      priority: "NOT_APPLICABLE" as const,
      categoryId: "cat-1",
      answer: "   ",
      answerStatus: "GENERATED" as const
    };

    expect(buildUpdateItemRequest(base, categories)).toMatchObject({
      answer: undefined,
      answerStatus: undefined
    });
    expect(getUpdateRequestValidationError(base)).toBe("Generated or edited answers require answer text.");
  });
});

describe("normalizeAnswerStatus", () => {
  it("normalizes failed answer state to edited only when answer text exists", () => {
    expect(normalizeAnswerStatus("FAILED", "Recovered answer")).toBe("EDITED");
    expect(normalizeAnswerStatus("FAILED", "")).toBeUndefined();
  });
});

describe("formStateFromItem", () => {
  it("maps the current item category path to categoryId", () => {
    expect(formStateFromItem(sampleItem(), categories).categoryId).toBe("cat-1");
  });
});

function sampleItem(): MemoraItem {
  return {
    id: "item-1",
    sourceType: "TELEGRAM_TEXT",
    rawInputText: "Raw",
    rawTranscript: null,
    aiTitle: "AI title",
    aiCleanedText: "AI text",
    aiType: "THOUGHT",
    aiCategoryPath: categories[0].path,
    proposedCategoryPath: null,
    proposedCategoryStatus: "NONE",
    aiPriority: "NOT_APPLICABLE",
    aiAnswer: null,
    title: "Title",
    cleanedText: "Text",
    type: "THOUGHT",
    categoryPath: categories[0].path,
    priority: "NOT_APPLICABLE",
    answer: null,
    answerStatus: "NONE",
    answerFailureStage: null,
    answerFailureReason: null,
    status: "AI_PROCESSED_UNREVIEWED",
    retryCountTranscription: 0,
    retryCountAi: 0,
    failureStage: null,
    failureReason: null,
    telegramTrace: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  };
}
