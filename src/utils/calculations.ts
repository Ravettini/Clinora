import type {
  CommissionRule,
  InventoryItem,
  InventoryStatus,
  PnLRow,
  Treatment,
} from "@/types";

export function getInventoryStatus(item: InventoryItem): InventoryStatus {
  if (item.stock <= 0) return "sin_stock";
  if (item.stock < item.minStock) return "bajo";
  if (item.stock > item.minStock * 4) return "sobrestock";
  return "normal";
}

export function resolveCommission(
  treatment: Treatment,
  rule: CommissionRule | undefined,
): { type: "porcentaje" | "fijo"; value: number; amount: number } {
  if (!rule) {
    const amount = Math.round((treatment.price * treatment.baseCommissionPct) / 100);
    return { type: "porcentaje", value: treatment.baseCommissionPct, amount };
  }
  if (rule.type === "fijo") {
    return { type: "fijo", value: rule.fixedAmount ?? 0, amount: rule.fixedAmount ?? 0 };
  }
  const pct = rule.pct ?? treatment.baseCommissionPct;
  return { type: "porcentaje", value: pct, amount: Math.round((treatment.price * pct) / 100) };
}

export function avgTicket(total: number, count: number): number {
  if (count === 0) return 0;
  return Math.round(total / count);
}

export function revenuePerHour(amount: number, durationMin: number): number {
  if (durationMin === 0) return 0;
  return Math.round((amount / durationMin) * 60);
}

export function categoryShare(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 1000) / 10;
}

export function ebitdaFromRow(row: Omit<PnLRow, "ebitda" | "operatingResult">): number {
  return (
    row.grossMargin -
    row.salaries -
    row.admin -
    row.marketing -
    row.commercialization -
    row.taxes -
    row.services -
    row.rent -
    row.interest
  );
}

export function ebitdaMargin(ebitda: number, sales: number): number {
  if (sales === 0) return 0;
  return Math.round((ebitda / sales) * 1000) / 10;
}

export function deltaPercent(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
