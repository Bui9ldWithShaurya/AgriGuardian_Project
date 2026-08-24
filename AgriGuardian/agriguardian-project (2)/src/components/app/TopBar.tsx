import { useRouterState } from "@tanstack/react-router";
import { Bell, Languages, Moon, Search, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/detection": "Disease Detection",
  "/advisor": "AI Advisor",
  "/weather": "Weather",
  "/analytics": "Analytics",
  "/alerts": "Smart Alerts",
  "/reports": "Reports",
  "/crops": "Crops",
  "/history": "History",
};

export function TopBar() {
  const { toggleLang, lang, theme, toggleTheme } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-1.5 text-sm">
            <li className="hidden truncate font-semibold text-muted-foreground sm:block">
              AgriGuardian
            </li>
            <li className="hidden text-muted-foreground sm:block" aria-hidden>
              ›
            </li>
            <li className="truncate font-heading font-bold">{title}</li>
          </ol>
        </nav>

        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-accent-foreground md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Health: 82/100 Good
        </span>

        <div className="relative hidden w-56 shrink-0 xl:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 pl-9"
            placeholder="Search farm, crops, alerts..."
            aria-label="Search farm, crops, alerts"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleLang}
          data-testid="lang-toggle"
          className="shrink-0"
        >
          <Languages className="h-4 w-4" />
          {lang === "hi" ? "HI" : "EN"}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="shrink-0"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
      </div>
    </header>
  );
}
