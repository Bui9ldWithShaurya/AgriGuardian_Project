import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, ScanLine, Bot, BellRing } from "lucide-react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { SettingsDialog } from "./SettingsDialog";

const MOBILE_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/detection", label: "Detect", icon: ScanLine },
  { to: "/advisor", label: "Advisor", icon: Bot },
  { to: "/alerts", label: "Alerts", icon: BellRing },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // The landing page is full-bleed and renders without the app chrome.
  if (pathname === "/") return <>{children}</>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-card lg:hidden">
        {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <SettingsDialog />
    </div>
  );
}
