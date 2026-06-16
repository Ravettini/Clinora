import type { PnLRow } from "@/types";
import { content } from "./content";

const raw = content.pnlRaw;

export const pnlRows: PnLRow[] = raw.map((r) => {
  const grossMargin = r.sales - r.cogs - r.medicalFees;
  const ebitda =
    grossMargin -
    r.salaries -
    r.admin -
    r.marketing -
    r.commercialization -
    r.taxes -
    r.services -
    r.rent -
    r.interest;
  const operatingResult = ebitda - r.depreciation - r.amortization;
  return { ...r, grossMargin, ebitda, operatingResult };
});
