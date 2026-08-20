import type { ReactNode } from "react";
import { MobileBar } from "./MobileBar";
import { Sidebar } from "./Sidebar";

type Props = {
  children: ReactNode;
  /** Pattern A: no page scroll. B/C scroll inside the content pane. */
  scroll?: "none" | "pane";
};

export function Shell({ children, scroll = "pane" }: Props) {
  return (
    <div className="flex h-dvh bg-paper">
      <MobileBar />
      <Sidebar />
      <div
        className={`min-w-0 flex-1 pt-14 lg:pt-0 ${
          scroll === "none" ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
