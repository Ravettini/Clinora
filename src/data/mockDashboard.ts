import type {
  DashboardData,
  CategoryRevenue,
  DoctorRevenue,
  PaymentMethodDistribution,
  ExpenseDistribution,
  MonthlyMetric,
  ActivityItem,
} from "@/types";
import { appointments } from "./mockAppointments";
import { categories } from "./mockCategories";
import { getTreatment } from "./mockTreatments";
import { doctors } from "./mockDoctors";
import { pnlRows } from "./mockPnL";
import { expenses } from "./mockExpenses";
import { paymentMethodLabels, expenseCategoryLabels } from "@/utils/labels";
import { DEMO_FX_RATE } from "@/utils/format";

const finalized = appointments.filter((a) => a.status === "finalizado");

// By category (all finalized)
const byCategory: CategoryRevenue[] = categories
  .map((cat) => {
    const value = finalized
      .filter((a) => getTreatment(a.treatmentId).categoryId === cat.id)
      .reduce((s, a) => s + a.price, 0);
    return { categoryId: cat.id, name: cat.name, value, color: cat.color };
  })
  .filter((c) => c.value > 0)
  .sort((a, b) => b.value - a.value);

// Payment methods
const paymentMethods: PaymentMethodDistribution[] = (
  ["transferencia_profesional", "transferencia_clinica", "tarjeta", "efectivo_ars", "efectivo_usd"] as const
).map((method) => ({
  method,
  label: paymentMethodLabels[method],
  value: finalized
    .filter((a) => a.paymentMethod === method)
    .reduce((s, a) => s + a.price, 0),
}));

// By primary doctor
const byPrimaryDoctor: DoctorRevenue[] = doctors
  .map((doc) => ({
    doctorId: doc.id,
    name: doc.fullName,
    value: finalized
      .filter((a) => a.primaryDoctorId === doc.id)
      .reduce((s, a) => s + a.price, 0),
  }))
  .filter((d) => d.value > 0)
  .sort((a, b) => b.value - a.value);

// By secondary doctor (stacked, demostrativo)
const bySecondaryDoctor = doctors
  .map((doc) => {
    const items = finalized.filter((a) => a.secondaryDoctorId === doc.id);
    const transferencia = items
      .filter((a) => a.paymentMethod?.startsWith("transferencia"))
      .reduce((s, a) => s + a.price, 0);
    const tarjeta = items
      .filter((a) => a.paymentMethod === "tarjeta")
      .reduce((s, a) => s + a.price, 0);
    const efectivo = items
      .filter((a) => a.paymentMethod?.startsWith("efectivo"))
      .reduce((s, a) => s + a.price, 0);
    return {
      name: doc.fullName.replace("Dra. ", ""),
      transferencia,
      tarjeta,
      efectivo,
      total: transferencia + tarjeta + efectivo,
    };
  })
  .filter((d) => d.total > 0)
  .sort((a, b) => b.total - a.total)
  .map(({ name, transferencia, tarjeta, efectivo }) => ({ name, transferencia, tarjeta, efectivo }));

// Expense distribution
const expenseGroups = new Map<string, number>();
expenses.forEach((e) => {
  expenseGroups.set(e.category, (expenseGroups.get(e.category) ?? 0) + e.amountArs);
});
const expenseDistribution: ExpenseDistribution[] = Array.from(expenseGroups.entries())
  .map(([category, value]) => ({
    category: category as ExpenseDistribution["category"],
    label: expenseCategoryLabels[category as ExpenseDistribution["category"]],
    value,
  }))
  .sort((a, b) => b.value - a.value);

// Monthly metrics from PnL
const monthly: MonthlyMetric[] = pnlRows.map((row, i) => ({
  month: row.month,
  monthIndex: i,
  revenueArs: row.sales,
  revenueUsd: Math.round(row.sales / DEMO_FX_RATE),
  treatments: Math.round(row.sales / 152957),
  expenses: row.sales - row.ebitda,
  ebitda: row.ebitda,
}));

const activity: ActivityItem[] = [
  { id: "act-1", type: "cobro", title: "Pago registrado", detail: "Sofía Benítez · Limpieza facial profunda · $95.000", time: "Hace 8 min" },
  { id: "act-2", type: "tratamiento_fin", title: "Tratamiento finalizado", detail: "Carolina Suárez · Botox tercio superior", time: "Hace 22 min" },
  { id: "act-3", type: "paciente_nuevo", title: "Nuevo paciente registrado", detail: "Daniela Correa · DNI 38.214.905", time: "Hace 41 min" },
  { id: "act-4", type: "tratamiento_inicio", title: "Tratamiento iniciado", detail: "Victoria Molina · Mesoterapia facial", time: "Hace 1 h" },
  { id: "act-5", type: "stock", title: "Alerta de stock", detail: "Toxina botulínica 100 U por debajo del mínimo", time: "Hace 2 h" },
  { id: "act-6", type: "liquidacion", title: "Liquidación generada", detail: "Dra. Camila Ferrero · 1ª quincena Junio", time: "Hace 3 h" },
  { id: "act-7", type: "cobro", title: "Pago dividido registrado", detail: "Julieta Acosta · Tarjeta + Efectivo USD", time: "Hace 4 h" },
  { id: "act-8", type: "stock", title: "Alerta de stock", detail: "Cóctel mesoterapia capilar sin stock", time: "Hace 5 h" },
];

export const dashboardData: DashboardData = {
  kpis: {
    revenueMonth: 28450000,
    revenueArs: 28450000,
    revenueUsd: 23130,
    treatments: 186,
    avgTicket: 152957,
    patientsServed: 142,
    avgAge: 39,
    pendingCommissions: 3820000,
    totalExpenses: 11650000,
    ebitda: 8940000,
  },
  deltas: {
    revenue: 12.4,
    treatments: 9.2,
    avgTicket: 4.6,
    patients: 18,
    avgAge: -1.2,
    commissions: 6.8,
    expenses: -3.1,
    ebitda: 14.7,
  },
  monthly,
  byCategory,
  paymentMethods,
  byPrimaryDoctor,
  bySecondaryDoctor,
  expenseDistribution,
  activity,
};
