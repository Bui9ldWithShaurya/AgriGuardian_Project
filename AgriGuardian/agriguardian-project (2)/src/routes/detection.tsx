import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  FileText,
  Leaf,
  Loader2,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  Wifi,
  Images,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { loadModel, predictLeafDisease, formatDiseaseResult } from "@/lib/leafModel";
import type { Prediction } from "@/lib/leafModel";
import { getTreatment } from "@/lib/treatments";
import { PageHeader, Panel, SectionLabel } from "@/components/app/Primitives";
import { StatusBadge, type Severity } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import sampleHealthy from "@/assets/sample-healthy.jpg";
import sampleEarlyBlight from "@/assets/sample-early-blight.jpg";
import sampleLateBlight from "@/assets/sample-late-blight.jpg";
import sampleRust from "@/assets/sample-rust.jpg";

const DEMO_SAMPLES: { label: string; src: string }[] = [
  { label: "Healthy Tomato", src: sampleHealthy },
  { label: "Early Blight", src: sampleEarlyBlight },
  { label: "Late Blight", src: sampleLateBlight },
  { label: "Common Rust", src: sampleRust },
];



export const Route = createFileRoute("/detection")({
  head: () => ({
    meta: [
      { title: "Disease Detection — Smart Farmer" },
      {
        name: "description",
        content:
          "Scan a leaf photo with an on-device EfficientNetB3 model to detect crop disease, severity and treatment steps.",
      },
      { property: "og:title", content: "Disease Detection — Smart Farmer" },
      {
        property: "og:description",
        content: "On-device AI leaf disease detection with treatment and prevention guidance.",
      },
    ],
  }),
  component: DetectionPage,
});

type ModelStatus = "loading" | "ready" | "error";

type DetectionResult = {
  headline: string;
  detail: string;
  isHealthy: boolean;
  confidencePct: string;
  crop: string;
  disease: string;
  className: string;
  severity: Severity;
  alternatives: Prediction[];
};

function severityFor(isHealthy: boolean, confidence: number): Severity {
  if (isHealthy) return "none";
  if (confidence >= 0.85) return "severe";
  if (confidence >= 0.6) return "moderate";
  return "mild";
}

function DetectionPage() {
  const { t, lang } = useApp();
  const [modelStatus, setModelStatus] = useState<ModelStatus>("loading");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lowConfidence, setLowConfidence] = useState(false);
  const [stats, setStats] = useState({ scans: 0, healthy: 0, issues: 0 });
  const [dragActive, setDragActive] = useState(false);
  const [feedUrl, setFeedUrl] = useState<string>(
    (import.meta.env["VITE_ESP32_IMAGE_URL"] as string | undefined) ?? "",
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);


  // Real model load — progress reflects actual request state, not a fake timer.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadModel();
        if (mounted) setModelStatus("ready");
      } catch (e) {
        console.error("model load failed", e);
        if (mounted) setModelStatus("error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const runAnalysis = useCallback(async () => {
    const img = imgElRef.current;
    if (!img) return;
    setAnalyzing(true);
    setResult(null);
    setError(null);
    setProgress(8);
    // Staged progress driven by real inference phases (indeterminate duration).
    const tick = setInterval(() => setProgress((p) => (p < 90 ? p + 3 : p)), 220);
    try {
      if (!img.complete || img.naturalWidth === 0) await img.decode();
      setProgress(30);
      const { topPrediction, allPredictions } = await predictLeafDisease(img);

      setProgress(96);
      const formatted = formatDiseaseResult(topPrediction);
      setLowConfidence(topPrediction.confidence < 0.5);
      setResult({
        ...formatted,
        className: topPrediction.className,
        severity: severityFor(formatted.isHealthy, topPrediction.confidence),
        alternatives: allPredictions.slice(1, 4),
      });
      setStats((s) => ({
        scans: s.scans + 1,
        healthy: s.healthy + (formatted.isHealthy ? 1 : 0),
        issues: s.issues + (formatted.isHealthy ? 0 : 1),
      }));
      setProgress(100);
    } catch (err) {
      console.error("inference failed", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      clearInterval(tick);
      setAnalyzing(false);
    }
  }, []);

  const acceptFile = (file: File | undefined) => {
    if (!file) return;
    setResult(null);
    setError(null);
    setLowConfidence(false);
    setProgress(0);
    setImageUrl(URL.createObjectURL(file));
  };

  const loadSample = (src: string) => {
    setResult(null);
    setError(null);
    setLowConfidence(false);
    setProgress(0);
    setImageUrl(src);
  };

  const loadFromFeed = () => {
    const url = feedUrl.trim();
    if (!url) return;
    setResult(null);
    setError(null);
    setLowConfidence(false);
    setProgress(0);
    setImageUrl(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`);
  };


  const reset = () => {
    setImageUrl(null);
    setResult(null);
    setError(null);
    setLowConfidence(false);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const treatment = useMemo(() => {
    if (!result) return null;
    return result.isHealthy ? t("healthyTip") : (getTreatment(result.className, lang) ?? t("healthyTip"));
  }, [result, lang, t]);

  const steps = [
    { key: "step1", at: 25 },
    { key: "step2", at: 55 },
    { key: "step3", at: 85 },
  ];

  return (
    <div>
      <PageHeader
        title={t("detectionTitle")}
        subtitle={t("detectionSub")}
        actions={
          <>
            <Button
              variant="outline"
              onClick={reset}
              disabled={!imageUrl && !result}
              data-testid="reset-btn"
            >
              <RotateCcw className="h-4 w-4" />
              {t("reset")}
            </Button>
            <Button onClick={() => fileRef.current?.click()} data-testid="select-image-btn">
              <Upload className="h-4 w-4" />
              {t("selectImage")}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: input column */}
        <div className="space-y-4 lg:col-span-2">
          <input type="hidden" data-testid="model-status" value={modelStatus} />


          <Panel
            className={`overflow-hidden border-2 border-dashed p-4 transition-colors ${
              dragActive ? "border-primary bg-accent/50" : "border-border"
            }`}
          >
            <button
              type="button"
              data-testid="upload-dropzone"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                acceptFile(e.dataTransfer.files?.[0]);
              }}
              className="flex w-full flex-col items-center gap-3 rounded-lg px-4 py-8 text-center"
            >
              {imageUrl ? (
                <img
                  ref={imgElRef}
                  src={imageUrl}
                  alt="Selected leaf preview"
                  crossOrigin="anonymous"
                  className="max-h-56 w-full rounded-lg object-contain"
                  data-testid="image-preview"
                />
              ) : (
                <>
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-primary">
                    <Leaf className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <p className="font-heading text-base font-bold">{t("uploadZone")}</p>
                  <p className="text-xs text-muted-foreground">{t("uploadZoneHint")}</p>
                </>
              )}
            </button>
          </Panel>

          {imageUrl && !analyzing && (
            <Button
              className="w-full"
              size="lg"
              onClick={runAnalysis}
              disabled={modelStatus !== "ready"}
              data-testid="analyze-btn"
            >
              <Sparkles className="h-4 w-4" />
              {t("analyzeBtn")}
            </Button>
          )}

          <Panel className="space-y-3 p-4">
            <SectionLabel icon={Wifi}>
              {lang === "hi" ? "ESP32 कैमरा फीड" : "ESP32 camera feed"}
            </SectionLabel>
            <div className="flex gap-2">
              <Input
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
                placeholder="http://192.168.4.1/capture"
                data-testid="esp32-url-input"
              />
              <Button
                variant="outline"
                onClick={loadFromFeed}
                disabled={!feedUrl.trim()}
                data-testid="esp32-fetch-btn"
              >
                <Wifi className="h-4 w-4" />
                {lang === "hi" ? "लाएँ" : "Fetch"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {lang === "hi"
                ? "डिवाइस से नवीनतम फ्रेम लाकर उसी मॉडल से विश्लेषण करें।"
                : "Pull the latest frame from the device and analyze it with the same model."}
            </p>
          </Panel>



          <Panel className="p-4">
            <SectionLabel icon={Images}>
              {lang === "hi" ? "डेमो सैंपल" : "Demo samples"}
            </SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_SAMPLES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => loadSample(s.src)}
                  className="overflow-hidden rounded-xl border border-border text-left transition-colors hover:border-primary"
                >
                  <img
                    src={s.src}
                    alt={s.label}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="h-24 w-full object-cover"
                  />
                  <span className="block px-2 py-1.5 text-xs font-semibold">{s.label}</span>
                </button>
              ))}
            </div>
          </Panel>




          <Panel className="p-4">
            <SectionLabel icon={ClipboardList}>{t("statsTitle")}</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t("scansRun"), value: stats.scans },
                { label: t("healthyFound"), value: stats.healthy },
                { label: t("issuesFound"), value: stats.issues },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-muted p-3">
                  <p className="font-heading text-2xl font-extrabold">{s.value}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right: results panel */}
        <Panel className="min-h-[420px] p-5 lg:col-span-3">
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex h-full flex-col items-center justify-center gap-4 py-12"
              >
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-heading text-lg font-bold">{t("analyzing")}</p>
                <Progress value={progress} className="w-full max-w-sm" />
                <ul className="w-full max-w-sm space-y-2">
                  {steps.map((s) => {
                    const done = progress >= s.at;
                    return (
                      <li
                        key={s.key}
                        className={`flex items-center gap-2 text-sm ${
                          done ? "font-semibold text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-border" />
                        )}
                        {t(s.key)}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center"
                data-testid="detection-error"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-destructive">
                  <AlertTriangle className="h-7 w-7 text-destructive-foreground" />
                </div>
                <p className="font-heading text-lg font-bold">{t("errorTitle")}</p>
                <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={runAnalysis}>
                  <RotateCcw className="h-4 w-4" />
                  {t("analyzeBtn")}
                </Button>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
                data-testid="detection-result"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                        result.isHealthy
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {result.isHealthy ? (
                        <ShieldCheck className="h-5 w-5" />
                      ) : (
                        <Stethoscope className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-heading text-xl font-extrabold">
                        {result.headline}
                      </h2>
                      <p className="truncate text-sm text-muted-foreground">
                        {result.isHealthy
                          ? result.crop
                          : `${result.crop} • ${result.disease || result.className}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-2xl font-extrabold text-primary">
                      {result.confidencePct}%
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t("confidence")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    severity={result.severity}
                    label={`${t("severity")}: ${t(
                      result.severity === "none"
                        ? "sevNone"
                        : result.severity === "mild"
                          ? "sevMild"
                          : result.severity === "moderate"
                            ? "sevModerate"
                            : "sevSevere",
                    )}`}
                  />
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {result.isHealthy ? t("healthyBadge") : t("diseaseBadge")}
                  </span>
                </div>

                {lowConfidence && (
                  <div
                    className="flex items-start gap-2 rounded-lg bg-warning p-3 text-sm text-warning-foreground"
                    data-testid="low-confidence-warning"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{t("lowConfidence")}</span>
                  </div>
                )}

                <section>
                  <SectionLabel icon={Stethoscope}>{t("diagnosis")}</SectionLabel>
                  <p className="text-sm leading-relaxed">{result.detail}</p>
                </section>

                <section>
                  <SectionLabel icon={ClipboardList}>{t("treatmentPlan")}</SectionLabel>
                  <div className="rounded-lg border border-border bg-muted p-4 text-sm leading-relaxed">
                    {treatment}
                  </div>
                </section>

                {result.alternatives.length > 0 && (
                  <section>
                    <SectionLabel icon={Search}>{t("topMatches")}</SectionLabel>
                    <ul className="space-y-1.5">
                      {result.alternatives.map((p) => (
                        <li
                          key={p.classIndex}
                          className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-sm"
                        >
                          <span className="min-w-0 truncate">{p.className.replace(/_/g, " ")}</span>
                          <span className="shrink-0 font-semibold text-muted-foreground">
                            {(p.confidence * 100).toFixed(1)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.print();
                    toast.success(t("generateReport"));
                  }}
                >
                  <FileText className="h-4 w-4" />
                  {t("generateReport")}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-muted">
                  <Leaf className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-heading text-lg font-bold">{t("emptyState")}</p>
                <p className="max-w-xs text-sm text-muted-foreground">{t("emptySub")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => acceptFile(e.target.files?.[0])}
        className="hidden"
        data-testid="file-input"
      />
    </div>
  );
}
