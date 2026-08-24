import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, TriangleAlert, Info, CheckCircle2, ShieldAlert, Droplets } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/Primitives";
import { Button } from "@/components/ui/button";
import { ALERTS, type AlertSeverity } from "@/lib/farmData";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Smart Alerts — AgriGuardian AI" },
      {
        name: "description",
        content:
          "Severity-ranked farm alerts for moisture, disease, heat and irrigation with one-tap AI actions.",
      },
      { property: "og:title", content: "Smart Alerts — AgriGuardian AI" },
      {
        property: "og:description",
        content: "Critical, warning and info alerts across every plot on your farm.",
      },
    ],
  }),
  component: AlertsPage,
});

const META: Record<
  AlertSeverity,
  { icon: typeof Info; ring: string; chip: string; label: string }
> = {
  critical: {
    icon: ShieldAlert,
    ring: "border-destructive",
    chip: "bg-destructive text-destructive-foreground",
    label: "Critical",
  },
  warning: {
    icon: TriangleAlert,
    ring: "border-warning",
    chip: "bg-warning text-warning-foreground",
    label: "Warning",
  },
  info: {
    icon: Info,
    ring: "border-border",
    chip: "bg-accent text-accent-foreground",
    label: "Info",
  },
  success: {
    icon: CheckCircle2,
    ring: "border-success",
    chip: "bg-success text-success-foreground",
    label: "Resolved",
  },
};

const FILTERS = ["all", "critical", "warning", "info", "success"] as const;

function AlertsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visible = ALERTS.filter(
    (a) => !dismissed.includes(a.id) && (filter === "all" || a.severity === filter),
  );
  const counts = {
    critical: ALERTS.filter((a) => a.severity === "critical").length,
    warning: ALERTS.filter((a) => a.severity === "warning").length,
    info: ALERTS.filter((a) => a.severity === "info").length,
  };

  return (
    <>
      <PageHeader
        title="Smart Alerts"
        subtitle="Prioritized notifications from every sensor and AI model"
        actions={
          <Button variant="outline" onClick={() => setDismissed(ALERTS.map((a) => a.id))}>
            Mark all read
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {(
          [
            ["Critical", counts.critical, "text-destructive"],
            ["Warnings", counts.warning, "text-warning"],
            ["Informational", counts.info, "text-primary"],
          ] as const
        ).map(([label, n, color]) => (
          <Panel key={label} className="p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className={`font-heading text-3xl font-extrabold ${color}`}>{n}</p>
          </Panel>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="grid place-items-center p-12 text-center">
          <div>
            <BellRing className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-heading text-base font-extrabold">You're all caught up</p>
            <p className="mt-1 text-sm text-muted-foreground">No alerts match this filter.</p>
          </div>
        </Panel>
      ) : (
        <div className="space-y-3">
          {visible.map((a) => {
            const m = META[a.severity];
            const Icon = m.icon;
            return (
              <Panel key={a.id} className={`border-l-4 p-5 ${m.ring}`}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="flex min-w-0 gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading text-sm font-extrabold">{a.title}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${m.chip}`}
                        >
                          {m.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.plot} · {a.time}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDismissed((d) => [...d, a.id])}
                    className="shrink-0 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Dismiss
                  </button>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-3 text-sm">
                  {a.metrics.map((mt) => (
                    <div key={mt.label} className="min-w-0">
                      <dt className="truncate text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        {mt.label}
                      </dt>
                      <dd className="truncate font-heading font-extrabold">{mt.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4">
                  {a.action === "Open Disease Detection View" ? (
                    <Button size="sm" asChild>
                      <Link to="/detection">{a.action}</Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => toast.success(`${a.action} — queued for ${a.plot}`)}
                    >
                      {a.action === "Trigger Irrigation Now" && (
                        <Droplets className="h-3.5 w-3.5" />
                      )}
                      {a.action}
                    </Button>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}
