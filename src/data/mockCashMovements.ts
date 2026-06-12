import type { CashMovement, PaymentMethodType } from "@/types";
import { DEMO_FX_RATE } from "@/utils/format";
import { appointments } from "./mockAppointments";
import { getPatient } from "./mockPatients";
import { getTreatment } from "./mockTreatments";
import { getCategory } from "./mockCategories";
import { expenses } from "./mockExpenses";
import { expenseCategoryLabels } from "@/utils/labels";
import { createRng, intBetween, pick } from "./seededRandom";

const users = ["Recepción Palermo", "Recepción Belgrano", "Dra. Valentina Ruiz"];

const incomeMovements: CashMovement[] = appointments
  .filter((a) => a.status === "finalizado")
  .map((a, i) => {
    const rng = createRng(40000 + i);
    const patient = getPatient(a.patientId);
    const treatment = getTreatment(a.treatmentId);
    const method: PaymentMethodType = a.paymentMethod ?? "efectivo_ars";
    const currency = method === "efectivo_usd" ? "USD" : "ARS";
    const amount = currency === "USD" ? Math.round(a.price / DEMO_FX_RATE) : a.price;
    return {
      id: `cash-in-${i + 1}`,
      date: a.date,
      time: a.time,
      type: "ingreso" as const,
      concept: patient?.fullName ?? "Paciente",
      category: getCategory(treatment.categoryId).name,
      paymentMethod: method,
      amount,
      currency,
      amountArs: a.price,
      user: pick(rng, users),
      status: "confirmado" as const,
      branchId: a.branchId,
    };
  });

const egressMovements: CashMovement[] = expenses.slice(0, 60).map((e, i) => ({
  id: `cash-out-${i + 1}`,
  date: e.date,
  time: `${String(intBetween(createRng(41000 + i), 8, 19)).padStart(2, "0")}:00`,
  type: "egreso" as const,
  concept: e.concept,
  category: expenseCategoryLabels[e.category],
  paymentMethod: e.paymentMethod,
  amount: e.amount,
  currency: e.currency,
  amountArs: e.amountArs,
  user: pick(createRng(42000 + i), users),
  status: e.status === "pagado" ? ("confirmado" as const) : ("pendiente" as const),
  branchId: e.branchId,
}));

export const cashMovements: CashMovement[] = [...incomeMovements, ...egressMovements].sort(
  (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.time < b.time ? 1 : -1),
);
