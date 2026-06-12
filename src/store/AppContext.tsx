import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Appointment,
  AppointmentStatus,
  BranchId,
  Patient,
  PaymentMethodType,
} from "@/types";
import { appointments as seedAppointments } from "@/data/mockAppointments";
import { patients as seedPatients } from "@/data/mockPatients";
import { DEMO_FX_RATE } from "@/utils/format";

export interface NewPatientInput {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
}

export interface NewAppointmentInput {
  patientId: string;
  treatmentId: string;
  primaryDoctorId: string;
  secondaryDoctorId?: string;
  price: number;
  estimatedDurationMin: number;
  commission: number;
  time: string;
}

interface AppContextValue {
  branchId: BranchId;
  setBranchId: (id: BranchId) => void;
  fxRate: number;
  setFxRate: (rate: number) => void;
  appointments: Appointment[];
  patients: Patient[];
  addPatient: (input: NewPatientInput) => Patient;
  addAppointment: (input: NewAppointmentInput) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  startTreatment: (id: string) => void;
  finishTreatment: (id: string) => void;
  registerPayment: (id: string, method: PaymentMethodType) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

let patientSeq = 1000;
let appointmentSeq = 1000;

export function AppProvider({ children }: { children: ReactNode }) {
  const [branchId, setBranchId] = useState<BranchId>("palermo");
  const [fxRate, setFxRate] = useState<number>(DEMO_FX_RATE);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [patients, setPatients] = useState<Patient[]>(seedPatients);

  const value = useMemo<AppContextValue>(() => {
    const addPatient = (input: NewPatientInput): Patient => {
      const patient: Patient = {
        id: `pat-new-${patientSeq++}`,
        dni: input.dni,
        firstName: input.firstName,
        lastName: input.lastName,
        fullName: `${input.firstName} ${input.lastName}`,
        birthDate: input.birthDate,
        phone: input.phone,
        email: input.email,
        address: input.address,
        city: input.city,
        notes: input.notes,
        status: "nuevo",
        createdAt: new Date().toISOString().slice(0, 10),
        branchId,
      };
      setPatients((prev) => [patient, ...prev]);
      return patient;
    };

    const addAppointment = (input: NewAppointmentInput): Appointment => {
      const appt: Appointment = {
        id: `apt-new-${appointmentSeq++}`,
        date: "2026-06-11",
        time: input.time,
        patientId: input.patientId,
        treatmentId: input.treatmentId,
        primaryDoctorId: input.primaryDoctorId,
        secondaryDoctorId: input.secondaryDoctorId,
        status: "en_tratamiento",
        price: input.price,
        currency: "ARS",
        estimatedDurationMin: input.estimatedDurationMin,
        startedAt: new Date().toISOString(),
        commission: input.commission,
        branchId,
      };
      setAppointments((prev) => [appt, ...prev]);
      return appt;
    };

    const updateAppointmentStatus = (id: string, status: AppointmentStatus) =>
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );

    const startTreatment = (id: string) =>
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "en_tratamiento", startedAt: new Date().toISOString() }
            : a,
        ),
      );

    const finishTreatment = (id: string) =>
      setAppointments((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          const real = a.estimatedDurationMin + Math.round((Math.random() - 0.3) * 10);
          return {
            ...a,
            status: "pendiente_pago",
            finishedAt: new Date().toISOString(),
            realDurationMin: Math.max(5, real),
          };
        }),
      );

    const registerPayment = (id: string, method: PaymentMethodType) =>
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "finalizado", paymentMethod: method } : a,
        ),
      );

    return {
      branchId,
      setBranchId,
      fxRate,
      setFxRate,
      appointments,
      patients,
      addPatient,
      addAppointment,
      updateAppointmentStatus,
      startTreatment,
      finishTreatment,
      registerPayment,
    };
  }, [branchId, fxRate, appointments, patients]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
