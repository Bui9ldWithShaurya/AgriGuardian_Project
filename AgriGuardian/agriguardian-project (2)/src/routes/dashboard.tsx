import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Play,
  TriangleAlert,
  Droplets,
  Thermometer,
  Sun,
  Waves,
  FlaskConical,
  Sprout,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/Primitives";
import { Button } from "@/components/ui/button";
import { SENSORS, CROP_LIBRARY } from "@/lib/farmData";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farm Overview — AgriGuardian AI" },
      {
        name: "description",
        content:
          "Live sensor readings, crop health score and AI recommendations for your farm in one dashboard.",
      },
      { property: "og:title", content: "Farm Overview — AgriGuardian AI" },
      {
        property: "og:description",
        content: "Live sensor data and AI insights for Green Valley Farm.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const SENSOR_STYLE: Record<string, { icon: typeof Droplets; bar: string; tint: string }> = {
  moisture: { icon: Droplets, bar: "bg-primary", tint: "bg-accent text-accent-foreground" },
  soilTemp: { icon: Thermometer, bar: "bg-caution", tint: "bg-caution/15 text-caution" },
  airTemp: { icon: Thermometer, bar: "bg-caution", tint: "bg-caution/15 text-caution" },
  humidity: { icon: Waves, bar: "bg-chart-2", tint: "bg-chart-2/15 text-chart-2" },
  ph: { icon: FlaskConical, bar: "bg-primary", tint: "bg-accent text-accent-foreground" },
  light: { icon: Sun, bar: "bg-warning", tint: "bg-warning/20 text-warning-foreground" },
};

function StatusTag({ status }: { status: string }) {
  const cls =
    status === "OPTIMAL"
      ? "bg-success/15 text-success"
      : status === "HIGH"
        ? "bg-warning/25 text-warning-foreground"
        : "bg-caution/15 text-caution";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest ${cls}`}>
      {status}
    </span>
  );
}

function Gauge({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-40 w-40 place-items-center">
      <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
        <circle cx="60" cy="60" r={r} className="stroke-muted" strokeWidth="12" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={r}
          className="stroke-primary"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-heading text-4xl font-extrabold">{score}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Good
        </p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const tomato = CROP_LIBRARY[0]!;
  const [scenario, setScenario] = useState(false);

  return (
    <>
      <PageHeader
        title="Farm Overview"
        subtitle="Live sensor data and AI insights for Green Valley Farm"
      />

      <div className="mb-6 grid gap-4 rounded-xl border border-warning/40 bg-warning/10 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="flex min-w-0 gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-heading text-sm font-extrabold">Demo Scenario Available</p>
              <span className="rounded-full bg-warning/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-warning-foreground">
                Interactive
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Watch AgriGuardian AI respond to a complex event: Early Blight outbreak combined with
              dropping soil moisture and upcoming rain.
            </p>
          </div>
        </div>
        <Button
          className="shrink-0 bg-warning font-bold text-warning-foreground hover:bg-warning/90"
          onClick={() => {
            setScenario(true);
            toast.success("Scenario running — AI is re-evaluating field conditions");
          }}
        >
          <Play className="h-4 w-4" />
          Run Scenario
        </Button>
      </div>

      {scenario && (
        <Panel className="mb-6 border-destructive p-4">
          <p className="font-heading text-sm font-extrabold text-destructive">
            Scenario active: Early Blight + moisture drop
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            AI response: hold Thursday irrigation (90% rain probability), apply copper fungicide in
            Sector B within 48 hours, and increase canopy airflow by pruning lower leaves.
          </p>
        </Panel>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — telemetry + active crop */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {SENSORS.map((s) => {
              const style = SENSOR_STYLE[s.key] ?? SENSOR_STYLE["moisture"]!;
              const Icon = style.icon;
              return (
                <Panel key={s.key} className="rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`grid h-9 w-9 place-items-center rounded-full ${style.tint}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <StatusTag status={s.status} />
                  </div>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="font-heading text-2xl font-extrabold">
                    {s.value}
                    <span className="ml-1 text-sm font-bold text-muted-foreground">{s.unit}</span>
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${style.bar}`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </Panel>
              );
            })}
          </div>

          <Panel className="rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-primary" />
              <p className="font-heading text-base font-extrabold">Active Crop: {tomato.name}</p>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Growth Stage
                </p>
                <p className="mt-1 font-heading text-lg font-extrabold">{tomato.stage}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Progress
                </p>
                <p className="mt-1 font-heading text-lg font-extrabold">
                  Day {tomato.day} of {tomato.cycle}
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(tomato.day / tomato.cycle) * 100}%` }}
                  />
                </div>
              </div>
              <div className="rounded-xl bg-accent p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent-foreground">
                  Expected Yield
                </p>
                <p className="font-heading text-2xl font-extrabold text-accent-foreground">
                  4.2 Tons/ha
                </p>
                <p className="text-xs font-semibold text-success">+12% vs last season</p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right column — health score + recommendations */}
        <div className="space-y-6">
          <Panel className="rounded-2xl p-5">
            <p className="font-heading text-base font-extrabold">AI Health Score</p>
            <div className="mt-4 grid place-items-center">
              <Gauge score={76} />
            </div>
            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Disease Risk</dt>
                <dd className="font-bold">Low</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Nutrient Level</dt>
                <dd className="font-bold">Moderate</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Growth Rate</dt>
                <dd className="font-bold">Normal</dd>
              </div>
            </dl>
          </Panel>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <h2 className="font-heading text-lg font-extrabold">AI Recommendations</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  tag: "Irrigation",
                  conf: "88% Confidence",
                  text: "Schedule 20L/m² irrigation for Sector B before 10 AM tomorrow.",
                },
                {
                  tag: "Fertilizer",
                  conf: "92% Confidence",
                  text: "Apply NPK 10-26-26 to boost fruiting stage in tomatoes.",
                },
              ].map((r) => (
                <Panel key={r.tag} className="rounded-2xl p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      {r.tag}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">{r.conf}</span>
                  </div>
                  <p className="mt-3 text-sm">{r.text}</p>
                </Panel>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
