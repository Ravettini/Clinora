import type { Settlement, SettlementLine, Quincena, Appointment } from "@/types";
import { appointments } from "./mockAppointments";
import { getDoctor, secondaryDoctors, primaryDoctors } from "./mockDoctors";
import { getPatient } from "./mockPatients";
import { getTreatment } from "./mockTreatments";
import { findCommissionRule } from "./mockCommissions";
import { resolveCommission } from "@/utils/calculations";

const monthName = (m: number) =>
  ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][m];

function quincenaOf(dateIso: string): Quincena {
  const day = Number(dateIso.slice(8, 10));
  return day <= 15 ? "primera" : "segunda";
}

function inPeriod(a: Appointment, month: number, year: number, q: Quincena): boolean {
  const d = new Date(a.date);
  return d.getMonth() === month && d.getFullYear() === year && quincenaOf(a.date) === q;
}

const periods: Array<{ month: number; year: number; q: Quincena }> = [
  { month: 5, year: 2026, q: "primera" },
  { month: 4, year: 2026, q: "segunda" },
  { month: 4, year: 2026, q: "primera" },
];

let idc = 1;
const secondary: Settlement[] = [];
periods.forEach((p) => {
  secondaryDoctors.slice(0, 5).forEach((doc) => {
    const lines: SettlementLine[] = appointments
      .filter(
        (a) =>
          a.status === "finalizado" &&
          a.secondaryDoctorId === doc.id &&
          inPeriod(a, p.month, p.year, p.q),
      )
      .map((a) => {
        const treatment = getTreatment(a.treatmentId);
        const rule = findCommissionRule(doc.id, a.treatmentId);
        const c = resolveCommission(treatment, rule);
        return {
          appointmentId: a.id,
          date: a.date,
          patientName: getPatient(a.patientId)?.fullName ?? "",
          treatmentName: treatment.name,
          primaryDoctorName: getDoctor(a.primaryDoctorId)?.fullName ?? "",
          treatmentPrice: a.price,
          commissionType: c.type,
          pct: c.type === "porcentaje" ? c.value : undefined,
          commission: c.amount,
        };
      });
    if (lines.length === 0) return;
    const totalCommission = lines.reduce((s, l) => s + l.commission, 0);
    const generatedRevenue = lines.reduce((s, l) => s + l.treatmentPrice, 0);
    const isPaid = p.month < 5;
    secondary.push({
      id: `set-${idc++}`,
      doctorId: doc.id,
      doctorName: doc.fullName,
      type: "secundario",
      quincena: p.q,
      month: p.month,
      year: p.year,
      lines,
      treatmentsCount: lines.length,
      generatedRevenue,
      totalCommission,
      paid: isPaid ? totalCommission : 0,
      pending: isPaid ? 0 : totalCommission,
      status: isPaid ? "pagada" : "generada",
      branchId: doc.branchId,
    });
  });
});

const principal: Settlement[] = [];
[
  { month: 5, year: 2026, q: "primera" as Quincena },
  { month: 4, year: 2026, q: "segunda" as Quincena },
].forEach((p) => {
  primaryDoctors.slice(0, 3).forEach((doc) => {
    const lines: SettlementLine[] = appointments
      .filter(
        (a) =>
          a.status === "finalizado" &&
          a.primaryDoctorId === doc.id &&
          inPeriod(a, p.month, p.year, p.q),
      )
      .map((a) => {
        const treatment = getTreatment(a.treatmentId);
        return {
          appointmentId: a.id,
          date: a.date,
          patientName: getPatient(a.patientId)?.fullName ?? "",
          treatmentName: treatment.name,
          primaryDoctorName: doc.fullName,
          treatmentPrice: a.price,
          commissionType: "porcentaje" as const,
          commission: a.commission,
        };
      });
    if (lines.length === 0) return;
    const generatedRevenue = lines.reduce((s, l) => s + l.treatmentPrice, 0);
    const secondaryCommission = lines.reduce((s, l) => s + l.commission, 0);
    principal.push({
      id: `set-${idc++}`,
      doctorId: doc.id,
      doctorName: doc.fullName,
      type: "principal",
      quincena: p.q,
      month: p.month,
      year: p.year,
      lines,
      treatmentsCount: lines.length,
      generatedRevenue,
      totalCommission: secondaryCommission,
      paid: 0,
      pending: generatedRevenue - secondaryCommission,
      status: "generada",
      branchId: doc.branchId,
    });
  });
});

export const settlements: Settlement[] = [...secondary, ...principal];

export const settlementPeriodLabel = (s: Settlement) =>
  `${s.quincena === "primera" ? "1ª" : "2ª"} quincena · ${monthName(s.month)} ${s.year}`;

// Aporte de cada socia a la sociedad (demostrativo)
export const societyContributions = primaryDoctors.slice(0, 4).map((doc) => {
  const own = appointments.filter(
    (a) => a.status === "finalizado" && a.primaryDoctorId === doc.id,
  );
  const toClinic = own
    .filter((a) => a.paymentMethod === "transferencia_clinica")
    .reduce((s, a) => s + a.price, 0);
  const toCard = own
    .filter((a) => a.paymentMethod === "tarjeta")
    .reduce((s, a) => s + a.price, 0);
  const toCash = own
    .filter((a) => a.paymentMethod?.startsWith("efectivo"))
    .reduce((s, a) => s + a.price, 0);
  return {
    doctorId: doc.id,
    name: doc.fullName,
    toClinic,
    toCard,
    toCash,
    total: toClinic + toCard + toCash,
  };
});
