import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-28 md:max-w-2xl md:pb-32">
        <div key={location.pathname} className="animate-page-in">
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}