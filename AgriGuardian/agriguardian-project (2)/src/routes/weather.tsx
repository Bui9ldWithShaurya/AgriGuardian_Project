import { createFileRoute } from "@tanstack/react-router";
import {
  CloudRain,
  CloudSun,
  Sun,
  Wind,
  Droplets,
  MapPin,
  Gauge,
  Thermometer,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/Primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather — AgriGuardian AI" },
      {
        name: "description",
        content:
          "Hyperlocal 7-day farm weather forecast with AI irrigation guidance for every day ahead.",
      },
      { property: "og:title", content: "Weather — AgriGuardian AI" },
      {
        property: "og:description",
        content: "7-day hyperlocal forecast tied to your irrigation plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeatherPage,
});

const DAYS: {
  day: string;
  icon: typeof Sun;
  hi: number;
  lo: number;
  rain: number;
  highlight?: boolean;
}[] = [
  { day: "Today", icon: Sun, hi: 33, lo: 22, rain: 35 },
  { day: "Tomorrow", icon: CloudRain, hi: 32, lo: 21, rain: 20 },
  { day: "Thursday", icon: CloudRain, hi: 28, lo: 19, rain: 90, highlight: true },
  { day: "Friday", icon: CloudRain, hi: 29, lo: 20, rain: 40 },
  { day: "Saturday", icon: CloudSun, hi: 31, lo: 21, rain: 10 },
  { day: "Sunday", icon: Sun, hi: 34, lo: 22, rain: 0 },
  { day: "Monday", icon: Sun, hi: 35, lo: 23, rain: 5 },
];

const HOURLY = [
  12, 18, 45, 52, 30, 22, 38, 16, 44, 41, 8, 62, 20, 55, 10, 14, 58, 50, 24, 30, 18, 12, 34, 48,
];

function HeroStat({ icon: Icon, label, value }: { icon: typeof Sun; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-foreground/75">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 font-heading text-lg font-extrabold text-primary-foreground">{value}</p>
    </div>
  );
}

function WeatherPage() {
  return (
    <>
      <PageHeader title="Weather Module" subtitle="Hyperlocal forecast tied to your irrigation plan" />

      <p className="-mt-4 mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        Punjab, India
      </p>

      <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Hero gradient card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-chart-2 to-chart-4 p-6 shadow-lg sm:p-8">
          <CloudRain className="pointer-events-none absolute -right-6 top-6 h-64 w-64 text-primary-foreground/10" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-heading text-xl font-extrabold text-primary-foreground">
                Partly Cloudy
              </p>
              <p className="mt-1 font-heading text-7xl font-extrabold leading-none tracking-tight text-primary-foreground">
                31°
              </p>
            </div>
            <div className="shrink-0 rounded-2xl bg-primary-foreground/15 px-5 py-4 text-center backdrop-blur-sm">
              <p className="text-xs font-semibold text-primary-foreground/80">Precipitation</p>
              <p className="font-heading text-2xl font-extrabold text-primary-foreground">35%</p>
            </div>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-primary-foreground/12 p-5 backdrop-blur-sm sm:grid-cols-4">
            <HeroStat icon={Wind} label="Wind" value="14 km/h" />
            <HeroStat icon={Droplets} label="Humidity" value="67%" />
            <HeroStat icon={Sun} label="UV Index" value="7" />
            <HeroStat icon={Thermometer} label="Feels Like" value="34°" />
          </div>
        </div>

        {/* AI irrigation advice */}
        <Panel className="rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground">
              <Droplets className="h-5 w-5" />
            </span>
            <p className="font-heading text-base font-extrabold">AI Irrigation Advice</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Based on the upcoming forecast and your current soil moisture (42%), we recommend
            adjusting your schedule.
          </p>

          <div className="mt-5 rounded-xl bg-accent/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent-foreground">
                Action Plan
              </p>
              <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold tracking-widest text-success">
                88% CONFIDENCE
              </span>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="font-bold">Today:</dt>
                <dd>Irrigate 30L/m²</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-caution">Thursday:</dt>
                <dd>SKIP (90% rain prob)</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">Friday:</dt>
                <dd>Resume if no rain</dd>
              </div>
            </dl>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              className="font-bold"
              onClick={() => toast.success("Irrigation plan accepted")}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              className="font-bold"
              onClick={() => toast("Open the AI Advisor to modify this plan")}
            >
              Modify
            </Button>
          </div>
        </Panel>
      </div>

      <h2 className="mb-4 font-heading text-xl font-extrabold">7-Day Forecast</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {DAYS.map(({ day, icon: Icon, hi, lo, rain, highlight }) => (
          <Panel
            key={day}
            className={`rounded-2xl p-4 text-center transition-shadow hover:shadow-md ${
              highlight ? "border-chart-2 ring-1 ring-chart-2/40" : ""
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              {day}
            </p>
            <Icon
              className={`mx-auto my-3 h-7 w-7 ${rain >= 40 ? "text-chart-2" : "text-warning"}`}
            />
            <p className="font-heading text-xl font-extrabold">
              {hi}° <span className="text-base text-muted-foreground">{lo}°</span>
            </p>
            <p
              className={`mt-2 text-xs font-semibold ${
                rain >= 60 ? "text-chart-2" : "text-muted-foreground"
              }`}
            >
              {rain}% Rain
            </p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-6 rounded-2xl p-6">
        <p className="flex items-center gap-2 font-heading text-base font-extrabold text-primary">
          <Gauge className="h-4 w-4" />
          Hourly Probability Chart
        </p>
        <div className="mt-6 flex h-40 items-end gap-1.5 border-t border-border pt-4">
          {HOURLY.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-chart-2/45"
              style={{ height: `${Math.max(6, v)}%` }}
              title={`${i}:00 — ${v}% chance`}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[11px] font-semibold text-muted-foreground">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </Panel>
    </>
  );
}
