import { format, parseISO, differenceInYears } from "date-fns";
import { es } from "date-fns/locale";
import type { Currency } from "@/types";

export const DEMO_FX_RATE = 1230;

export function formatCurrency(value: number, currency: Currency = "ARS"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, decimals)}%`;
}

export function formatDate(iso: string, pattern = "dd/MM/yyyy"): string {
  try {
    return format(parseISO(iso), pattern, { locale: es });
  } catch {
    return iso;
  }
}

export function formatDateLong(iso: string): string {
  try {
    return format(parseISO(iso), "EEEE d 'de' MMMM, yyyy", { locale: es });
  } catch {
    return iso;
  }
}

export function calcAge(birthDateIso: string): number {
  try {
    return differenceInYears(new Date(), parseISO(birthDateIso));
  } catch {
    return 0;
  }
}

export function arsFrom(amount: number, currency: Currency, fxRate = DEMO_FX_RATE): number {
  return currency === "USD" ? Math.round(amount * fxRate) : amount;
}

export function usdFrom(amountArs: number, fxRate = DEMO_FX_RATE): number {
  return Math.round(amountArs / fxRate);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
