import { cn } from "@/utils/cn";
import type { AppointmentStatus, InventoryStatus } from "@/types";
import { appointmentStatusLabels, inventoryStatusLabels } from "@/utils/labels";

type Tone = "neutral" | "info" | "positive" | "warning" | "danger" | "brand";

const toneMap: Record<Tone, string> = {
  neutral: "bg-surface-subtle text-ink-500",
  info: "bg-brand-50 text-brand-700",
  brand: "bg-brand-100 text-brand-700",
  positive: "bg-positive-50 text-positive-700",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const apptTone: Record<AppointmentStatus, Tone> = {
  confirmado: "info",
  programado: "info",
  presente: "brand",
  en_tratamiento: "warning",
  pendiente_pago: "danger",
  finalizado: "positive",
  cancelado: "neutral",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge tone={apptTone[status]}>{appointmentStatusLabels[status]}</Badge>;
}

const invTone: Record<InventoryStatus, Tone> = {
  normal: "positive",
  bajo: "warning",
  sin_stock: "danger",
  sobrestock: "info",
};

export function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  return <Badge tone={invTone[status]}>{inventoryStatusLabels[status]}</Badge>;
}
