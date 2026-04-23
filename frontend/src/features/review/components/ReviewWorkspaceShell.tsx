import type { MemoraItemSummary } from "../types/MemoraItemSummary";
import { ReviewItemCard } from "./ReviewItemCard";

type Props = {
  title: string;
  description: string;
  items: MemoraItemSummary[];
};

export function ReviewWorkspaceShell({ title, description, items }: Props) {
  return (
    <section className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </header>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search (placeholder for next slice)"
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
        />
        <button className="rounded-xl border border-slate-300 px-4 py-2">Filters</button>
        <button className="rounded-xl border border-slate-300 px-4 py-2">Sort</button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No items yet.
          </div>
        ) : (
          items.map((item) => <ReviewItemCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}
