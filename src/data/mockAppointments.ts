import type { Appointment, AppointmentStatus, PaymentMethodType, BranchId } from "@/types";
import { patients } from "./mockPatients";
import { treatments, getTreatment } from "./mockTreatments";
import { primaryDoctors, secondaryDoctors } from "./mockDoctors";
import { findCommissionRule } from "./mockCommissions";
import { resolveCommission } from "@/utils/calculations";
import { createRng, intBetween, pick, chance } from "./seededRandom";

export const TODAY = "2026-06-11";

const paymentMethods: PaymentMethodType[] = [
  "transferencia_profesional",
  "transferencia_clinica",
  "tarjeta",
  "efectivo_ars",
  "efectivo_usd",
];

function commissionFor(treatmentId: string, secondaryId?: string): number {
  if (!secondaryId) return 0;
  const treatment = getTreatment(treatmentId);
  const rule = findCommissionRule(secondaryId, treatmentId);
  return resolveCommission(treatment, rule).amount;
}

// ---- Today's agenda (12 appointments) ----
const todaySpecs: Array<{
  time: string;
  patientIdx: number;
  treatmentId: string;
  primary: string;
  secondary?: string;
  status: AppointmentStatus;
  branchId: BranchId;
}> = [
  { time: "08:30", patientIdx: 0, treatmentId: "trt-8", primary: "doc-1", secondary: "doc-5", status: "finalizado", branchId: "palermo" },
  { time: "09:00", patientIdx: 3, treatmentId: "trt-1", primary: "doc-2", secondary: "doc-3", status: "finalizado", branchId: "palermo" },
  { time: "09:45", patientIdx: 5, treatmentId: "trt-4", primary: "doc-3", secondary: "doc-6", status: "pendiente_pago", branchId: "palermo" },
  { time: "10:30", patientIdx: 8, treatmentId: "trt-15", primary: "doc-7", secondary: "doc-5", status: "en_tratamiento", branchId: "palermo" },
  { time: "11:00", patientIdx: 12, treatmentId: "trt-2", primary: "doc-1", secondary: "doc-6", status: "en_tratamiento", branchId: "palermo" },
  { time: "11:30", patientIdx: 15, treatmentId: "trt-12", primary: "doc-4", status: "presente", branchId: "belgrano" },
  { time: "12:15", patientIdx: 18, treatmentId: "trt-9", primary: "doc-8", secondary: "doc-6", status: "presente", branchId: "belgrano" },
  { time: "14:00", patientIdx: 21, treatmentId: "trt-5", primary: "doc-3", secondary: "doc-5", status: "confirmado", branchId: "palermo" },
  { time: "14:45", patientIdx: 24, treatmentId: "trt-22", primary: "doc-2", secondary: "doc-7", status: "confirmado", branchId: "belgrano" },
  { time: "15:30", patientIdx: 27, treatmentId: "trt-11", primary: "doc-7", secondary: "doc-5", status: "confirmado", branchId: "palermo" },
  { time: "16:15", patientIdx: 30, treatmentId: "trt-16", primary: "doc-8", secondary: "doc-6", status: "confirmado", branchId: "belgrano" },
  { time: "17:00", patientIdx: 33, treatmentId: "trt-7", primary: "doc-1", secondary: "doc-3", status: "cancelado", branchId: "palermo" },
];

const todayAppointments: Appointment[] = todaySpecs.map((s, i) => {
  const treatment = getTreatment(s.treatmentId);
  const finished = s.status === "finalizado";
  return {
    id: `apt-today-${i + 1}`,
    date: TODAY,
    time: s.time,
    patientId: patients[s.patientIdx].id,
    treatmentId: s.treatmentId,
    primaryDoctorId: s.primary,
    secondaryDoctorId: s.secondary,
    status: s.status,
    price: treatment.price,
    currency: "ARS",
    estimatedDurationMin: treatment.durationMin,
    realDurationMin: finished || s.status === "pendiente_pago" ? treatment.durationMin + (i % 3) * 5 : undefined,
    startedAt: ["en_tratamiento", "pendiente_pago", "finalizado"].includes(s.status) ? `${TODAY}T${s.time}:00` : undefined,
    finishedAt: finished ? `${TODAY}T${s.time}:00` : undefined,
    commission: commissionFor(s.treatmentId, s.secondary),
    paymentMethod: finished ? paymentMethods[i % paymentMethods.length] : undefined,
    branchId: s.branchId,
    notes: undefined,
  };
});

// ---- Historical appointments (150) ----
function dateMonthsBack(monthsAgo: number, day: number): string {
  const base = new Date(2026, 5, 1);
  base.setMonth(base.getMonth() - monthsAgo);
  base.setDate(day);
  return base.toISOString().slice(0, 10);
}

const historical: Appointment[] = Array.from({ length: 150 }, (_, i) => {
  const rng = createRng(20000 + i);
  const treatment = pick(rng, treatments.filter((t) => t.categoryId !== "giftcards"));
  const patient = patients[intBetween(rng, 0, patients.length - 1)];
  const primary = pick(rng, primaryDoctors);
  const hasSecondary = treatment.baseCommissionPct > 0 && chance(rng, 0.75);
  const secondaryPool = secondaryDoctors.filter((d) => d.id !== primary.id);
  const secondary = hasSecondary ? pick(rng, secondaryPool) : undefined;
  const monthsAgo = intBetween(rng, 0, 5);
  const day = intBetween(rng, 1, 27);
  const realDuration = treatment.durationMin + intBetween(rng, -5, 15);
  const hour = intBetween(rng, 8, 18);
  const minute = pick(rng, ["00", "15", "30", "45"]);

  return {
    id: `apt-h-${i + 1}`,
    date: dateMonthsBack(monthsAgo, day),
    time: `${String(hour).padStart(2, "0")}:${minute}`,
    patientId: patient.id,
    treatmentId: treatment.id,
    primaryDoctorId: primary.id,
    secondaryDoctorId: secondary?.id,
    status: "finalizado" as AppointmentStatus,
    price: treatment.price,
    currency: "ARS",
    estimatedDurationMin: treatment.durationMin,
    realDurationMin: realDuration,
    finishedAt: `${dateMonthsBack(monthsAgo, day)}T${String(hour).padStart(2, "0")}:${minute}:00`,
    commission: commissionFor(treatment.id, secondary?.id),
    paymentMethod: pick(rng, paymentMethods),
    branchId: patient.branchId,
  };
});

export const appointments: Appointment[] = [...todayAppointments, ...historical];
export const todayAgenda = todayAppointments;
