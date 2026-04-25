import { describe, expect, it } from "vitest";
import { updateCascadeFilter } from "./FilterControls";

describe("updateCascadeFilter", () => {
  it("clears dependent lower-level values when category changes", () => {
    expect(updateCascadeFilter({
      category: "Work",
      subcategory: "Planning",
      subsubcategory: "Roadmap"
    }, "category", "Personal")).toEqual({
      category: "Personal",
      subcategory: "",
      subsubcategory: ""
    });
  });

  it("clears subsubcategory when subcategory changes", () => {
    expect(updateCascadeFilter({
      category: "Work",
      subcategory: "Planning",
      subsubcategory: "Roadmap"
    }, "subcategory", "Notes")).toEqual({
      category: "Work",
      subcategory: "Notes",
      subsubcategory: ""
    });
  });
});
