import type { MemoraItem } from "../../types/reviewTypes";
import { KVPair } from "./DetailPrimitives";

export function TelegramTraceSection({ item }: { item: MemoraItem }) {
  if (!item.telegramTrace) return null;
  return (
    <section className="mt-5 rounded-xl bg-stone-50 p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Telegram trace</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        <KVPair label="User ID" value={item.telegramTrace.telegramUserId} />
        <KVPair label="Chat ID" value={item.telegramTrace.telegramChatId} />
        <KVPair label="Message ID" value={item.telegramTrace.telegramMessageId} />
        <KVPair label="File ID" value={item.telegramTrace.telegramFileId} />
        <KVPair label="File unique ID" value={item.telegramTrace.telegramFileUniqueId} />
        {item.telegramTrace.durationSeconds && <KVPair label="Duration" value={`${item.telegramTrace.durationSeconds}s`} />}
        <KVPair label="MIME" value={item.telegramTrace.mimeType} />
      </div>
    </section>
  );
}
