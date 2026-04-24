import type { MemoraItemSummary } from "../types/MemoraItemSummary";

type Props = {
  item: MemoraItemSummary;
};

export function ReviewItemCard({ item }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {item.memoraId}
          </p>
          <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
          {item.status}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-700">{item.cleanedText}</p>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-800">Type</dt>
          <dd>{item.type}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-800">Category</dt>
          <dd>
            {item.category} / {item.subcategory} / {item.subsubcategory}
          </dd>
        </div>
      </dl>
    </article>
  );
}
