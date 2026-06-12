import { appointments as seedAppointments } from "./mockAppointments";
import { getDoctor } from "./mockDoctors";
import { getTreatment } from "./mockTreatments";
import type { Appointment } from "@/types";

export interface PatientStats {
  treatmentsCount: number;
  totalSpent: number;
  avgTicket: number;
  pendingPayments: number;
  lastTreatment?: string;
  usualDoctorName?: string;
}

export function getPatientAppointments(
  patientId: string,
  allAppointments: Appointment[] = seedAppointments,
) {
  return allAppointments
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPatientStats(
  patientId: string,
  allAppointments: Appointment[] = seedAppointments,
): PatientStats {
  const list = getPatientAppointments(patientId, allAppointments);
  const finalized = list.filter((a) => a.status === "finalizado");
  const totalSpent = finalized.reduce((s, a) => s + a.price, 0);
  const pending = list
    .filter((a) => a.status === "pendiente_pago")
    .reduce((s, a) => s + a.price, 0);

  const doctorCount = new Map<string, number>();
  finalized.forEach((a) => {
    doctorCount.set(a.primaryDoctorId, (doctorCount.get(a.primaryDoctorId) ?? 0) + 1);
  });
  const usual = [...doctorCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  return {
    treatmentsCount: finalized.length,
    totalSpent,
    avgTicket: finalized.length ? Math.round(totalSpent / finalized.length) : 0,
    pendingPayments: pending,
    lastTreatment: finalized[0]
      ? `${getTreatment(finalized[0].treatmentId).name}`
      : undefined,
    usualDoctorName: usual ? getDoctor(usual)?.fullName : undefined,
  };
}
