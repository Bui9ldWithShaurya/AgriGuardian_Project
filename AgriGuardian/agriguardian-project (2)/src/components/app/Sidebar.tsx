import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  ScanLine,
  Bot,
  CloudSun,
  BarChart3,
  BellRing,
  FileText,
  Sprout,
  Leaf,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FARMS } from "@/lib/farmData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/detection", label: "Disease Detection", icon: ScanLine },
  { to: "/advisor", label: "AI Advisor", icon: Bot },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/alerts", label: "Smart Alerts", icon: BellRing },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/crops", label: "Crops", icon: Sprout },
] as const;

export function Sidebar() {
  const { setSettingsOpen } = useApp();
  const [farm, setFarm] = useState<string>(FARMS[0]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="truncate font-heading text-base font-extrabold text-sidebar-foreground">
          AgriGuardian
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sidebar-accent-foreground">
          AI
        </span>
      </div>

      <div className="px-4 py-4">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-sidebar-muted-foreground">
          Current Farm
        </p>
        <Select value={farm} onValueChange={setFarm}>
          <SelectTrigger data-testid="farm-selector" className="w-full border-sidebar-border bg-sidebar-accent text-sidebar-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FARMS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent p-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sidebar-primary font-heading text-sm font-bold text-sidebar-primary-foreground">
            DU
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">Demo User</p>
            <p className="truncate text-xs text-sidebar-muted-foreground">demo@agriguardian.ai</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-sidebar-muted-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
            <Link to="/">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
