import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#FAF8F5] text-[#2E2A22] md:flex">
      <Sidebar />
      <main className="flex min-h-dvh flex-1 flex-col pb-24 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
