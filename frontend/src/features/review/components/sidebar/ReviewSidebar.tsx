import type {
  CategoryPathFilter,
  CreateCategoryRequest,
  MemoraCategory,
  RenameCategoryRequest
} from "../../types/reviewTypes";
import { CategoryManager } from "./CategoryManager";
import { SidebarFooter } from "./SidebarFooter";

type Props = {
  onLoggedOut: () => void;
  categories: MemoraCategory[];
  categoryFilter: CategoryPathFilter;
  onCategoryFilterChange: (next: CategoryPathFilter) => void;
  busyAction: string | null;
  onCreateCategory: (request: CreateCategoryRequest) => Promise<void>;
  onRenameCategory: (categoryId: string, request: RenameCategoryRequest) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
};

export function ReviewSidebar(props: Props) {
  return (
    <aside className="flex h-full flex-col bg-[#faf8f4]">
      <div className="border-b border-stone-200 px-5 py-5">
        <p className="text-lg font-semibold text-stone-950">Tools</p>
        <p className="mt-1 text-sm text-stone-500">Create, rename, or delete category paths.</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
          <CategoryManager
            categories={props.categories}
            categoryFilter={props.categoryFilter}
            onCategoryFilterChange={props.onCategoryFilterChange}
            busyAction={props.busyAction}
            onCreateCategory={props.onCreateCategory}
            onRenameCategory={props.onRenameCategory}
            onDeleteCategory={props.onDeleteCategory}
            tone="light"
          />
        </div>
      </div>
      <SidebarFooter onLoggedOut={props.onLoggedOut} />
    </aside>
  );
}
