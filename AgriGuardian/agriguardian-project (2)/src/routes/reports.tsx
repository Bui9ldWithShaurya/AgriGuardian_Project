import { createFileRoute } from "@tanstack/react-router";
import { Printer, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/Primitives";
import { Button } from "@/components/ui/button";
import { SENSORS, ALERTS } from "@/lib/farmData";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AgriGuardian AI" },
      {
        name: "description",
        content:
          "Generate printable farm health reports covering sensors, disease scans, irrigation and yield.",
      },
      { property: "og:title", content: "Reports — AgriGuardian AI" },
      {
        property: "og:description",
        content: "Season summary reports ready to print or share.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Farm health summary, ready to print or share"
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Report exported as PDF")}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </>
        }
      />

      <Panel className="mx-auto max-w-3xl p-8 sm:p-10">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border pb-6">
          <div className="min-w-0">
            <h2 className="font-heading text-2xl font-extrabold">Farm Health Report</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Green Valley Farm · Generated {today}
            </p>
          </div>
          <FileText className="h-8 w-8 shrink-0 text-primary" />
        </div>

        <section className="pt-6">
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
            Executive Summary
          </h3>
          <p className="mt-2 text-sm leading-relaxed">
            Overall farm health scores 76/100 (Good). Soil conditions are within optimal bands
            across five of six sensors, with air temperature running above the safe threshold for
            tomato pollination. One critical disease alert (Early Blight, 89.3% confidence) is
            active in Plot A4 and treatment has been applied. Projected yield is 4.2 tons/ha, up
            12% against last season.
          </p>
        </section>

        <section className="pt-6">
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
            Sensor Readings
          </h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 font-semibold">Metric</th>
                <th className="py-2 font-semibold">Value</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {SENSORS.map((s) => (
                <tr key={s.key} className="border-b border-border/60">
                  <td className="py-2">{s.label}</td>
                  <td className="py-2 font-semibold">
                    {s.value} {s.unit}
                  </td>
                  <td className="py-2">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="pt-6">
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
            Recent Events
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {ALERTS.slice(0, 5).map((a) => (
              <li key={a.id} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                <span className="min-w-0">
                  <span className="font-semibold">{a.title}</span>
                  <span className="text-muted-foreground"> — {a.plot}</span>
                </span>
                <span className="shrink-0 text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-6">
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
            Recommendations
          </h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
            <li>Hold Thursday irrigation — 12 mm rain forecast at 90% probability.</li>
            <li>Apply NPK 10-26-26 at 120 kg/ha to support the fruiting stage.</li>
            <li>Complete the copper fungicide cycle in Plot A4 (2 of 3 remaining).</li>
            <li>Install shade netting during 12:00–15:00 to reduce heat stress.</li>
          </ol>
        </section>

        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          Generated by AgriGuardian AI · Data sourced from on-farm IoT sensors and AI vision models.
        </p>
      </Panel>
    </>
  );
}
