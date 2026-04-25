import { CategoryTree } from "../CategoryTree";
import type { ReviewView } from "../../hooks/useReviewWorkspaceState";
import type {
  CategoryPathFilter,
  CreateCategoryRequest,
  MemoraCategory,
  RenameCategoryRequest
} from "../../types/reviewTypes";
import { CategoryManager } from "./CategoryManager";
import { ReviewNavigation } from "./ReviewNavigation";
import { SidebarFooter } from "./SidebarFooter";

type Props = {
  view: ReviewView;
  onChange: (next: ReviewView) => void;
  onLoggedOut: () => void;
  categories: MemoraCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  categoryFilter: CategoryPathFilter;
  onCategoryFilterChange: (next: CategoryPathFilter) => void;
  busyAction: string | null;
  counts: {
    needsReview: number;
    failures: number;
    approved: number;
  };
  onCreateCategory: (request: CreateCategoryRequest) => Promise<void>;
  onRenameCategory: (categoryId: string, request: RenameCategoryRequest) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
};

export function ReviewSidebar(props: Props) {
  return (
    <aside className="flex h-full flex-col bg-[#111110]">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-stone-950">
          M
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-stone-100">Memora</p>
          <p className="text-[11px] leading-tight text-stone-500">Review workspace</p>
        </div>
      </div>
      <div className="mx-3 mb-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-3 py-2.5">
        <p className="text-[11px] leading-4 text-stone-400">
          Review AI-processed knowledge before it becomes trusted. Approve, edit, or reject each item.
        </p>
      </div>
      <ReviewNavigation view={props.view} counts={props.counts} onChange={props.onChange} />
      <div className="mx-3 mt-4 border-t border-white/8" />
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <CategoryTree
          categories={props.categories}
          loading={props.categoriesLoading}
          errorMessage={props.categoriesError}
          filter={props.categoryFilter}
          onSelect={props.onCategoryFilterChange}
          onClearFilter={() => props.onCategoryFilterChange({ category: "", subcategory: "", subsubcategory: "" })}
          dark
        />
        <CategoryManager
          categories={props.categories}
          categoryFilter={props.categoryFilter}
          onCategoryFilterChange={props.onCategoryFilterChange}
          busyAction={props.busyAction}
          onCreateCategory={props.onCreateCategory}
          onRenameCategory={props.onRenameCategory}
          onDeleteCategory={props.onDeleteCategory}
        />
      </div>
      <SidebarFooter onLoggedOut={props.onLoggedOut} />
    </aside>
  );
}
