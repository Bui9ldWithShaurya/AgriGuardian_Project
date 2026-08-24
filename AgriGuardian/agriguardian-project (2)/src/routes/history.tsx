import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { localizeDigits } from "@/lib/i18n";
import { fetchSensorData, type SensorReading } from "@/lib/api";
import { PageHeader, Panel } from "@/components/app/Primitives";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Reading History — Smart Farmer" },
      {
        name: "description",
        content: "Recent field sensor readings with soil moisture, temperature, humidity and risk.",
      },
      { property: "og:title", content: "Reading History — Smart Farmer" },
      {
        property: "og:description",
        content: "Browse the most recent field sensor readings and advisories.",
      },
    ],
  }),
  component: HistoryPage,
});

const RISK_STYLE: Record<string, string> = {
  urgent: "bg-destructive text-destructive-foreground",
  caution: "bg-warning text-warning-foreground",
  normal: "bg-success text-success-foreground",
};

function HistoryPage() {
  const { t, lang, crop } = useApp();
  const [rows, setRows] = useState<SensorReading[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchSensorData({ crop });
        if (active) setRows([...(data.history ?? [])].reverse());
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      active = false;
    };
  }, [crop]);

  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(lang === "hi" ? "hi-IN" : "en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PageHeader title={t("historyTitle")} subtitle={t("historySub")} />

      {rows.length === 0 ? (
        <Panel className="p-10 text-center text-sm text-muted-foreground" data-testid="history-empty">
          {t("noHistory")}
        </Panel>
      ) : (
        <Panel className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t("colTime")}</th>
                <th className="px-4 py-3">{t("colSoil")}</th>
                <th className="px-4 py-3">{t("colTemp")}</th>
                <th className="px-4 py-3">{t("colHum")}</th>
                <th className="px-4 py-3">{t("colRisk")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap">{fmtTime(r.timestamp)}</td>
                  <td className="px-4 py-3">{localizeDigits(Math.round(r.soil_moisture), lang)}%</td>
                  <td className="px-4 py-3">{localizeDigits(Math.round(r.temperature), lang)}°C</td>
                  <td className="px-4 py-3">{localizeDigits(Math.round(r.humidity), lang)}%</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest ${
                        RISK_STYLE[r.risk_level ?? "normal"] ?? RISK_STYLE["normal"]
                      }`}
                    >
                      {t(
                        r.risk_level === "urgent"
                          ? "riskUrgent"
                          : r.risk_level === "caution"
                            ? "riskCaution"
                            : "riskNormal",
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </motion.div>
  );
}
