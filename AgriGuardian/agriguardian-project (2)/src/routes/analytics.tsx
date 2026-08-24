import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpDown,
  Droplets,
  Leaf,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, Panel } from "@/components/app/Primitives";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — AgriGuardian AI" },
      {
        name: "description",
        content:
          "Season trends for crop health, water usage and disease incidence across your plots.",
      },
      { property: "og:title", content: "Analytics — AgriGuardian AI" },
      {
        property: "og:description",
        content: "Visualise yield, water and health trends over the season.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const HEALTH = [58, 61, 64, 62, 68, 71, 69, 73, 76, 74, 78, 76];
const WATER = [42, 39, 45, 38, 34, 30, 33, 28, 26, 29, 24, 22];

const SERIES = MONTHS.map((month, i) => ({
  month,
  health: HEALTH[i]!,
  water: WATER[i]!,
}));

const TIMEFRAMES = [
  { key: "1M", months: 1 },
  { key: "3M", months: 3 },
  { key: "6M", months: 6 },
  { key: "1Y", months: 12 },
  { key: "All", months: 12 },
] as const;

const HEALTH_TARGET = 75;
const WATER_TARGET = 30;

type TimeframeKey = (typeof TIMEFRAMES)[number]["key"];
type ViewType = "line" | "bar";

const KPIS = [
  {
    icon: TrendingUp,
    label: "Yield Forecast",
    value: "4.2 t/ha",
    badge: "+12% YoY",
    tone: "success" as const,
    spark: [3.2, 3.4, 3.5, 3.7, 3.8, 4.0, 4.2],
    tint: "from-primary/12",
  },
  {
    icon: Droplets,
    label: "Water Saved",
    value: "34%",
    badge: "vs fixed schedule",
    tone: "muted" as const,
    spark: [12, 17, 20, 24, 27, 31, 34],
    tint: "from-chart-2/15",
  },
  {
    icon: Leaf,
    label: "Disease Events",
    value: "3",
    badge: "3 events treated",
    tone: "muted" as const,
    spark: [2, 1, 3, 2, 1, 1, 0],
    tint: "from-caution/15",
  },
  {
    icon: Activity,
    label: "Avg Health",
    value: "72",
    badge: "+4 pts vs Q2",
    tone: "success" as const,
    spark: [62, 64, 66, 68, 70, 71, 72],
    tint: "from-warning/15",
  },
];

const PLOTS = [
  { id: "a4", label: "Plot A4", crop: "Tomato", score: 76, acreage: "12 ha", updated: "8 min ago", risk: "Early Blight watch" },
  { id: "b1", label: "Plot B1", crop: "Maize", score: 84, acreage: "18 ha", updated: "12 min ago", risk: "No active risk" },
  { id: "b2", label: "Plot B2", crop: "Onion", score: 68, acreage: "7 ha", updated: "21 min ago", risk: "Low nutrient" },
  { id: "c2", label: "Plot C2", crop: "Cotton", score: 59, acreage: "9 ha", updated: "35 min ago", risk: "Moisture stress" },
];

function scoreTone(score: number) {
  if (score >= 80) return { text: "text-success", ring: "var(--success)", label: "Healthy" };
  if (score >= 60) return { text: "text-warning-foreground", ring: "var(--warning)", label: "Watch" };
  return { text: "text-destructive", ring: "var(--destructive)", label: "At risk" };
}

function Sparkline({ data, stroke }: { data: number[]; stroke: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-full">
      <polyline
        points={pts}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; dataKey?: string; value?: number; color?: string }>;
  label?: string;
  unit?: string | undefined;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-heading font-bold text-popover-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="mt-0.5 flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.dataKey}</span>
          <span className="font-bold text-popover-foreground">
            {p.value}
            {p.dataKey === "health" ? "/100" : (unit ?? "")}
          </span>
        </p>
      ))}
    </div>
  );
}

function ChartControls({
  timeframe,
  setTimeframe,
  view,
  setView,
}: {
  timeframe: TimeframeKey;
  setTimeframe: (k: TimeframeKey) => void;
  view: ViewType;
  setView: (v: ViewType) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-0.5 rounded-full bg-muted p-0.5">
        {TIMEFRAMES.map(({ key }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTimeframe(key)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
              timeframe === key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-0.5 rounded-full bg-muted p-0.5">
        {(["line", "bar"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize transition-colors ${
              view === v
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

function TrendCard({
  title,
  subtitle,
  dataKey,
  color,
  target,
  targetLabel,
  unit,
}: {
  title: string;
  subtitle: string;
  dataKey: "health" | "water";
  color: string;
  target: number;
  targetLabel: string;
  unit?: string | undefined;
}) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("1Y");
  const [view, setView] = useState<ViewType>("line");
  const months = TIMEFRAMES.find((t) => t.key === timeframe)?.months ?? 12;
  const data = SERIES.slice(-Math.max(months, 2));

  return (
    <Panel className="p-6 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-heading text-base font-extrabold">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <ChartControls
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          view={view}
          setView={setView}
        />
      </div>

      <div className="mt-5 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {view === "line" ? (
            <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip unit={unit} />} />
              <ReferenceLine
                y={target}
                stroke={color}
                strokeDasharray="5 5"
                label={{
                  value: targetLabel,
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#fill-${dataKey})`}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ fill: "var(--muted)" }} />
              <ReferenceLine y={target} stroke={color} strokeDasharray="5 5" />
              <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function CombinedCard() {
  return (
    <Panel className="p-6 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-heading text-base font-extrabold">Health vs Water Usage</p>
          <p className="text-sm text-muted-foreground">
            Overlay view to spot irrigation and health correlations
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Health
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-caution" /> Water
          </span>
        </div>
      </div>
      <div className="mt-5 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={SERIES} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="water" fill="var(--caution)" radius={[6, 6, 0, 0]} opacity={0.55} />
            <Line
              type="monotone"
              dataKey="health"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function PlotCard({ plot }: { plot: (typeof PLOTS)[number] }) {
  const tone = scoreTone(plot.score);
  return (
    <Panel className="p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className="grid h-20 w-20 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(${tone.ring} ${plot.score * 3.6}deg, var(--muted) 0deg)`,
          }}
        >
          <div className="grid h-15 w-15 place-items-center rounded-full bg-card">
            <span className={`font-heading text-xl font-extrabold ${tone.text}`}>{plot.score}</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-heading text-base font-extrabold">
            {plot.label} — {plot.crop}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {plot.acreage}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {plot.updated}
            </span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
              {tone.label}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{plot.risk}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" asChild className="mt-4 w-full justify-between">
        <Link to="/crops">
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </Panel>
  );
}

function AnalyticsPage() {
  const [sort, setSort] = useState<"high" | "low">("high");
  const [crop, setCrop] = useState<string>("all");

  const plots = useMemo(() => {
    const filtered = crop === "all" ? PLOTS : PLOTS.filter((p) => p.crop === crop);
    return [...filtered].sort((a, b) => (sort === "high" ? b.score - a.score : a.score - b.score));
  }, [crop, sort]);

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Season-long trends across health, water and disease incidence"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ icon: Icon, label, value, badge, tone, spark, tint }) => (
          <Panel
            key={label}
            className={`bg-gradient-to-br ${tint} to-card p-6 transition-shadow hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-accent">
                <Icon className="h-4 w-4 text-accent-foreground" />
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                  tone === "success"
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {badge}
              </span>
            </div>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className="font-heading text-2xl font-extrabold">{value}</p>
            <div className="mt-2">
              <Sparkline data={spark} stroke="var(--primary)" />
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TrendCard
          title="Crop Health Score"
          subtitle="Monthly average, last 12 months"
          dataKey="health"
          color="var(--primary)"
          target={HEALTH_TARGET}
          targetLabel="Target 75"
        />
        <TrendCard
          title="Water Usage"
          subtitle="Thousand litres per month"
          dataKey="water"
          color="var(--caution)"
          target={WATER_TARGET}
          targetLabel="Target 30k"
          unit="k L"
        />
      </div>

      <div className="mt-4">
        <CombinedCard />
      </div>

      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-extrabold">Plot Comparison</h2>
            <p className="text-sm text-muted-foreground">Health scores across active plots</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger className="h-9 w-36" aria-label="Filter by crop">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All crops</SelectItem>
                {PLOTS.map((p) => (
                  <SelectItem key={p.crop} value={p.crop}>
                    {p.crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSort(sort === "high" ? "low" : "high")}
            >
              <ArrowUpDown className="h-4 w-4" />
              {sort === "high" ? "Highest first" : "Lowest first"}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {plots.map((p) => (
            <PlotCard key={p.id} plot={p} />
          ))}
        </div>
      </section>
    </>
  );
}
