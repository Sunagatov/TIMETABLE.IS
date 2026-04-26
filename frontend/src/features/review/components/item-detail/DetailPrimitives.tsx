import type { ReactNode } from "react";

export function MobileBack({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center border-b border-stone-100 px-5 py-3 lg:hidden">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-stone-500 transition hover:bg-stone-100"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="10 3 5 8 10 13" />
        </svg>
        Back
      </button>
    </div>
  );
}

export function ToolbarBtn(props: {
  tone: "approve" | "edit" | "neutral" | "danger";
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const cls =
    props.tone === "approve"
      ? "bg-emerald-600 text-white hover:bg-emerald-500"
      : props.tone === "edit"
        ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
        : props.tone === "danger"
          ? "text-red-500 hover:bg-red-50"
          : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50";

  return (
    <button
      type="button"
      disabled={props.busy || props.disabled}
      onClick={props.onClick}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${cls}`}
    >
      {props.busy ? "..." : props.children}
    </button>
  );
}

export function GhostBtn(props: { busy: boolean; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      disabled={props.busy || props.disabled}
      onClick={props.onClick}
      className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 disabled:opacity-50"
    >
      {props.busy ? "..." : props.children}
    </button>
  );
}

const STATUS_LABELS: Record<string, string> = {
  AI_PROCESSED_UNREVIEWED: "Ready to review",
  HUMAN_APPROVED: "Approved",
  HUMAN_EDITED_APPROVED: "Edited & approved",
  AI_PROCESSING_FAILED: "AI failed",
  TRANSCRIPTION_FAILED: "Transcription failed",
  REJECTED: "Rejected",
  RECEIVED: "Received",
  DELETED: "Deleted",
};

export function StatusPill({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status.replace(/_/g, " ");
  const cls = status.includes("APPROVED")
    ? "bg-emerald-100 text-emerald-700"
    : status.includes("FAILED")
      ? "bg-red-100 text-red-700"
      : status.includes("PENDING")
        ? "bg-amber-100 text-amber-700"
        : "bg-stone-100 text-stone-600";
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

export function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1">
      <span className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">{label}</span>
      <span className="text-[10px] font-semibold text-stone-600">{value}</span>
    </div>
  );
}

export function KV({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{label}</p>
      <p className={`mt-0.5 text-sm text-stone-600 ${multiline ? "whitespace-pre-wrap leading-6" : ""}`}>{value}</p>
    </div>
  );
}

export function KVPair({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      <p className="text-stone-400">{label}</p>
      <p className="truncate font-mono text-stone-600">{value}</p>
    </>
  );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-stone-500">{label}</span>
      {children}
    </label>
  );
}

export function CenterState({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="max-w-xs rounded-2xl border border-dashed border-stone-200 p-10 text-center">
      <p className="text-3xl text-stone-200">{icon}</p>
      <p className="mt-3 font-semibold text-stone-700">{title}</p>
      <p className="mt-2 text-sm text-stone-400">{body}</p>
    </div>
  );
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 7.5 5.5 11 12 4.5" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 1.5L11.5 4.5L4.5 11.5H1.5V8.5L8.5 1.5Z" />
    </svg>
  );
}

export function RetryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 7A5.5 5.5 0 1 0 3 3L1.5 1.5V5H5" />
    </svg>
  );
}
