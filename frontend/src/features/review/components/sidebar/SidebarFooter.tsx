export function SidebarFooter({ onLoggedOut }: { onLoggedOut: () => void }) {
  return (
    <div className="border-t border-stone-200 px-4 py-4">
      <button
        type="button"
        className="flex w-full items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
        onClick={onLoggedOut}
      >
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2.5H13a1 1 0 011 1v9a1 1 0 01-1 1H10" />
      <polyline points="7 11 10 8 7 5" />
      <line x1="10" y1="8" x2="2" y2="8" />
    </svg>
  );
}
