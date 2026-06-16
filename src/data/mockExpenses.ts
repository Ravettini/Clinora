import type { Expense, ExpenseCategory, PaymentMethodType, BranchId } from "@/types";
import { DEMO_FX_RATE } from "@/utils/format";
import { suppliers } from "./mockSuppliers";
import { content } from "./content";
import { createRng, intBetween, pick, chance } from "./seededRandom";

const categoryConcepts = content.expenseConcepts;
const categoryAmounts = content.expenseAmounts;

const allCategories = Object.keys(categoryConcepts) as ExpenseCategory[];
const methods: PaymentMethodType[] = [
  "transferencia_clinica",
  "tarjeta",
  "efectivo_ars",
];

function dateBack(rng: () => number): string {
  const monthsAgo = intBetween(rng, 0, 5);
  const base = new Date(2026, 5, 1);
  base.setMonth(base.getMonth() - monthsAgo);
  base.setDate(intBetween(rng, 1, 27));
  return base.toISOString().slice(0, 10);
}

export const expenses: Expense[] = Array.from({ length: 70 }, (_, i) => {
  const rng = createRng(30000 + i);
  const category = pick(rng, allCategories);
  const [min, max] = categoryAmounts[category];
  const isUsd = category === "mercaderia" && chance(rng, 0.25);
  const baseAmount = intBetween(rng, min / 1000, max / 1000) * 1000;
  const amount = isUsd ? Math.round(baseAmount / DEMO_FX_RATE) : baseAmount;
  const branchId: BranchId = chance(rng, 0.5) ? "palermo" : "belgrano";
  const supplier = pick(rng, suppliers);

  return {
    id: `exp-${i + 1}`,
    date: dateBack(rng),
    category,
    subcategory: undefined,
    concept: pick(rng, categoryConcepts[category]),
    supplier: ["salarios", "impuestos", "servicios"].includes(category) ? "—" : supplier.name,
    amount,
    currency: isUsd ? "USD" : "ARS",
    fxRate: isUsd ? DEMO_FX_RATE : 1,
    amountArs: isUsd ? Math.round(amount * DEMO_FX_RATE) : amount,
    paymentMethod: pick(rng, methods),
    hasReceipt: chance(rng, 0.7),
    notes: chance(rng, 0.2) ? "Comprobante cargado de forma demostrativa." : undefined,
    status: chance(rng, 0.85) ? "pagado" : "pendiente",
    branchId,
  };
});

export const expensesThisMonth = expenses.filter((e) => e.date >= "2026-06-01");
