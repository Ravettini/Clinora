import type { PnLRow } from "@/types";

const raw = [
  { month: "Ene", sales: 21850000, cogs: 2050000, medicalFees: 3450000, salaries: 4200000, admin: 980000, marketing: 720000, commercialization: 520000, taxes: 1820000, services: 430000, rent: 1180000, interest: 380000, depreciation: 350000, amortization: 180000 },
  { month: "Feb", sales: 22980000, cogs: 2160000, medicalFees: 3620000, salaries: 4350000, admin: 1010000, marketing: 760000, commercialization: 540000, taxes: 1910000, services: 450000, rent: 1180000, interest: 410000, depreciation: 350000, amortization: 180000 },
  { month: "Mar", sales: 24560000, cogs: 2280000, medicalFees: 3850000, salaries: 4480000, admin: 1080000, marketing: 880000, commercialization: 600000, taxes: 2050000, services: 470000, rent: 1220000, interest: 430000, depreciation: 350000, amortization: 180000 },
  { month: "Abr", sales: 25320000, cogs: 2340000, medicalFees: 3980000, salaries: 4600000, admin: 1120000, marketing: 920000, commercialization: 640000, taxes: 2120000, services: 490000, rent: 1220000, interest: 450000, depreciation: 350000, amortization: 180000 },
  { month: "May", sales: 26780000, cogs: 2460000, medicalFees: 4180000, salaries: 4720000, admin: 1190000, marketing: 1010000, commercialization: 690000, taxes: 2240000, services: 510000, rent: 1280000, interest: 480000, depreciation: 350000, amortization: 180000 },
  { month: "Jun", sales: 28450000, cogs: 2560000, medicalFees: 4400000, salaries: 4800000, admin: 1250000, marketing: 1100000, commercialization: 720000, taxes: 2350000, services: 530000, rent: 1300000, interest: 500000, depreciation: 350000, amortization: 180000 },
];

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
