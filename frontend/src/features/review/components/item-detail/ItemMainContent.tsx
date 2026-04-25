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
        <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-stone-700">
          {item.cleanedText}
        </p>
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
