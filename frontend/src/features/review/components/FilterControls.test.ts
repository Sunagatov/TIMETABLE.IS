import { describe, expect, it } from "vitest";
import { updateCascadeFilter } from "./FilterControls";

describe("updateCascadeFilter", () => {
  it("clears dependent lower-level values when category changes", () => {
    expect(updateCascadeFilter({
      category: "Work",
      subcategory: "Planning"
    }, "category", "Personal")).toEqual({
      category: "Personal",
      subcategory: ""
    });
  });

  it("keeps category and updates subcategory", () => {
    expect(updateCascadeFilter({
      category: "Work",
      subcategory: "Planning"
    }, "subcategory", "Notes")).toEqual({
      category: "Work",
      subcategory: "Notes"
    });
  });
});
