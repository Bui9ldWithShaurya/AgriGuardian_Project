import { CheckCircle2, AlertTriangle, TriangleAlert, ShieldAlert } from "lucide-react";

export type Severity = "none" | "mild" | "moderate" | "severe";

const STYLES: Record<Severity, { cls: string; Icon: typeof CheckCircle2; key: string }> = {
  none: { cls: "bg-success text-success-foreground", Icon: CheckCircle2, key: "sevNone" },
  mild: { cls: "bg-warning text-warning-foreground", Icon: TriangleAlert, key: "sevMild" },
  moderate: { cls: "bg-caution text-caution-foreground", Icon: AlertTriangle, key: "sevModerate" },
  severe: { cls: "bg-destructive text-destructive-foreground", Icon: ShieldAlert, key: "sevSevere" },
};

export function StatusBadge({
  severity,
  label,
  className = "",
}: {
  severity: Severity;
  label: string;
  className?: string;
}) {
  const s = STYLES[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest ${s.cls} ${className}`}
    >
      <s.Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function severityKey(severity: Severity) {
  return STYLES[severity].key;
}
