import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sprout, Droplets, Thermometer, Bot } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/Primitives";
import { CROP_LIBRARY } from "@/lib/farmData";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Management — AgriGuardian AI" },
      {
        name: "description",
        content:
          "Track growth stages, water needs and AI agronomy insights for every crop in your rotation.",
      },
      { property: "og:title", content: "Crop Management — AgriGuardian AI" },
      {
        property: "og:description",
        content: "Stage-by-stage playbooks for tomato, wheat, rice, cotton and more.",
      },
    ],
  }),
  component: CropsPage,
});

function CropsPage() {
  const [selected, setSelected] = useState(CROP_LIBRARY[0]!.key);
  const crop = CROP_LIBRARY.find((c) => c.key === selected) ?? CROP_LIBRARY[0]!;

  return (
    <>
      <PageHeader
        title="Crop Management"
        subtitle="Growth stages, water demand and AI agronomy notes per crop"
      />

      <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="space-y-2">
          {CROP_LIBRARY.map((c) => {
            const active = c.key === selected;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelected(c.key)}
                className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  active
                    ? "border-primary bg-accent"
                    : "border-border bg-card hover:bg-accent/50"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-extrabold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.stage}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    c.status === "ACTIVE"
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.status}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <Panel className="p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <h2 className="truncate font-heading text-2xl font-extrabold">{crop.name}</h2>
                <p className="truncate text-sm italic text-muted-foreground">
                  {crop.scientific}
                </p>
              </div>
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>{crop.stage}</span>
                <span>
                  Day {crop.day} / {crop.cycle}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(crop.day / crop.cycle) * 100}%` }}
                />
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border p-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Droplets className="h-3.5 w-3.5" /> Water Need
                </dt>
                <dd className="font-heading text-lg font-extrabold">{crop.water}</dd>
              </div>
              <div className="rounded-xl border border-border p-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Thermometer className="h-3.5 w-3.5" /> Ideal Temp
                </dt>
                <dd className="font-heading text-lg font-extrabold">{crop.temp}</dd>
              </div>
              <div className="rounded-xl border border-border p-3">
                <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Cycle Length
                </dt>
                <dd className="font-heading text-lg font-extrabold">{crop.cycle} days</dd>
              </div>
            </dl>
          </Panel>

          <Panel className="p-6">
            <p className="flex items-center gap-2 font-heading text-base font-extrabold">
              <Bot className="h-4 w-4 text-primary" />
              AI Insight
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{crop.insight}</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
