import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  hint?: string;
  accent?: "brand" | "positive" | "warning" | "danger" | "neutral";
}

const accentMap: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  brand: "bg-brand-50 text-brand-600",
  positive: "bg-positive-50 text-positive-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
  neutral: "bg-surface-subtle text-ink-500",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  hint,
  accent = "brand",
}: MetricCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="card min-w-0 overflow-hidden p-4 transition hover:shadow-pop sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <p className="min-w-0 text-xs font-semibold uppercase tracking-wide text-ink-400">
          {label}
        </p>
        {Icon && (
          <span className={cn("shrink-0 rounded-xl p-2", accentMap[accent])}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2 min-w-0 break-words text-xl font-bold leading-tight tracking-tight text-ink-900 [overflow-wrap:anywhere] sm:text-2xl">{value}</p>
      {(delta !== undefined || hint) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {delta !== undefined && (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
                positive
                  ? "bg-positive-50 text-positive-600"
                  : "bg-danger-50 text-danger-600",
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {deltaLabel ??
                `${positive ? "+" : ""}${delta.toLocaleString("es-AR")}%`}
            </span>
          )}
          {hint && <span className="min-w-0 break-words text-ink-400 [overflow-wrap:anywhere]">{hint}</span>}
        </div>
      )}
    </div>
  );
}
