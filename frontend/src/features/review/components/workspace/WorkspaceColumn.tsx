import type { MobilePanel } from "../../hooks/useReviewWorkspaceState";

export function WorkspaceColumn({
  panel,
  activePanel,
  children
}: {
  panel: MobilePanel;
  activePanel: MobilePanel;
  children: React.ReactNode;
}) {
  return (
    <div className={`${activePanel === panel ? "flex" : "hidden"} h-[calc(100dvh-4rem)] flex-col lg:flex lg:h-screen`}>
      {children}
    </div>
  );
}
