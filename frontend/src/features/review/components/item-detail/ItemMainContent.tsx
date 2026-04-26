import type { MemoraItem } from "../../types/reviewTypes";

type Props = {
  item: MemoraItem;
  isQuestion: boolean;
};

export function ItemMainContent({ item, isQuestion }: Props) {
  const displayAnswer = item.answer || item.aiAnswer;
  return (
    <>
      {item.cleanedText && (
        <section className="mt-7 rounded-[28px] border border-stone-200 bg-stone-50/80 px-7 py-7 shadow-[0_1px_0_rgba(28,25,23,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Improved AI text</p>
          <p className="mt-4 whitespace-pre-wrap text-[20px] leading-9 text-stone-900">
            {item.cleanedText}
          </p>
        </section>
      )}
      {isQuestion && displayAnswer && (
        <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/60 p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">Current answer</p>
          <p className="text-base leading-7 text-stone-700">{displayAnswer}</p>
          {item.answerStatus && (
            <p className="mt-2 text-xs text-stone-400">{item.answerStatus.toLowerCase()}</p>
          )}
        </div>
      )}
    </>
  );
}
