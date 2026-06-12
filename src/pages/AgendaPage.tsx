import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Play,
  CheckCircle2,
  CreditCard,
  Eye,
  CalendarClock,
  XCircle,
  Plus,
  Hourglass,
  Activity,
  Stethoscope,
  Wallet,
  MoreVertical,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs } from "@/components/common/Tabs";
import { AppointmentStatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { useApp } from "@/store/AppContext";
import { useUI } from "@/store/UIContext";
import { useToast } from "@/store/ToastContext";
import { TODAY } from "@/data/mockAppointments";
import { getPatient } from "@/data/mockPatients";
import { getTreatment } from "@/data/mockTreatments";
import { getDoctor } from "@/data/mockDoctors";
import { formatCurrency, formatDateLong } from "@/utils/format";
import { cn } from "@/utils/cn";
import type { Appointment, AppointmentStatus } from "@/types";

const tabs = [
  { id: "todos", label: "Todos" },
  { id: "esperando", label: "Esperando" },
  { id: "en_tratamiento", label: "En tratamiento" },
  { id: "pendiente_pago", label: "Pendiente de pago" },
  { id: "finalizado", label: "Finalizados" },
];

export function AgendaPage() {
  const { appointments, branchId, startTreatment, finishTreatment, updateAppointmentStatus } = useApp();
  const { openNewIncome } = useUI();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("todos");
  const [payFor, setPayFor] = useState<Appointment | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const today = useMemo(
    () =>
      appointments
        .filter((a) => a.date === TODAY && a.branchId === branchId)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, branchId],
  );

  const stats = useMemo(() => {
    return {
      turnos: today.length,
      esperando: today.filter((a) => ["confirmado", "presente", "programado"].includes(a.status)).length,
      enCurso: today.filter((a) => a.status === "en_tratamiento").length,
      pendientes: today.filter((a) => a.status === "pendiente_pago").length,
      finalizados: today.filter((a) => a.status === "finalizado").length,
    };
  }, [today]);

  const filtered = today.filter((a) => {
    if (tab === "todos") return true;
    if (tab === "esperando") return ["confirmado", "presente", "programado"].includes(a.status);
    return a.status === tab;
  });

  const counts: Record<string, number> = {
    todos: today.length,
    esperando: stats.esperando,
    en_tratamiento: stats.enCurso,
    pendiente_pago: stats.pendientes,
    finalizado: stats.finalizados,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Agenda operativa"
        subtitle={formatDateLong(TODAY)}
        actions={
          <button className="btn-primary" onClick={() => openNewIncome()}>
            <Plus className="h-4 w-4" /> Nuevo ingreso
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatPill icon={CalendarClock} label="Turnos" value={stats.turnos} tone="brand" />
        <StatPill icon={Hourglass} label="En espera" value={stats.esperando} tone="info" />
        <StatPill icon={Activity} label="En curso" value={stats.enCurso} tone="warning" />
        <StatPill icon={Wallet} label="Pagos pendientes" value={stats.pendientes} tone="danger" />
        <StatPill icon={CheckCircle2} label="Finalizados" value={stats.finalizados} tone="positive" />
        <StatPill icon={Stethoscope} label="Profesionales" value={new Set(today.map((a) => a.primaryDoctorId)).size} tone="neutral" />
      </div>

      <Tabs
        tabs={tabs.map((t) => ({ ...t, count: counts[t.id] }))}
        active={tab}
        onChange={setTab}
      />

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CalendarClock}
            title="Sin turnos en esta vista"
            description="No hay atenciones con este estado para la fecha y sucursal seleccionadas."
          />
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((a) => {
            const patient = getPatient(a.patientId);
            const treatment = getTreatment(a.treatmentId);
            const primary = getDoctor(a.primaryDoctorId);
            const secondary = a.secondaryDoctorId ? getDoctor(a.secondaryDoctorId) : undefined;
            return (
              <div key={a.id} className="card p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex items-center gap-3 lg:w-20">
                    <div className="flex items-center gap-1.5 rounded-xl bg-surface-subtle px-2.5 py-1.5 text-sm font-bold text-ink-700">
                      <Clock className="h-3.5 w-3.5 text-brand-500" />
                      {a.time}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink-900">{patient?.fullName}</p>
                      <AppointmentStatusBadge status={a.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {treatment.name} · {a.estimatedDurationMin} min · {formatCurrency(a.price)}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {primary?.fullName}
                      {secondary && ` + ${secondary.fullName}`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <AgendaActions
                      appointment={a}
                      onStart={() => {
                        startTreatment(a.id);
                        toast("info", "Tratamiento iniciado", patient?.fullName);
                      }}
                      onFinish={() => {
                        finishTreatment(a.id);
                        toast("warning", "Tratamiento finalizado", "El pago quedó pendiente");
                      }}
                      onPay={() => setPayFor(a)}
                      onView={() => patient && navigate(`/pacientes/${patient.id}`)}
                      onCancel={() => setCancelId(a.id)}
                      onReschedule={() => toast("info", "Reprogramar turno", "Acción demostrativa")}
                      menuOpen={menuId === a.id}
                      onToggleMenu={() => setMenuId(menuId === a.id ? null : a.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PaymentModal appointment={payFor} onClose={() => setPayFor(null)} />
      <ConfirmDialog
        open={!!cancelId}
        title="Cancelar turno"
        description="¿Confirmás la cancelación de este turno? Esta acción es demostrativa."
        confirmLabel="Cancelar turno"
        tone="danger"
        onConfirm={() => {
          if (cancelId) {
            updateAppointmentStatus(cancelId, "cancelado");
            toast("info", "Turno cancelado");
          }
        }}
        onClose={() => setCancelId(null)}
      />
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Clock;
  label: string;
  value: number;
  tone: "brand" | "info" | "warning" | "danger" | "positive" | "neutral";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    info: "bg-accent-lavender/40 text-brand-700",
    warning: "bg-warning-50 text-warning-600",
    danger: "bg-danger-50 text-danger-600",
    positive: "bg-positive-50 text-positive-600",
    neutral: "bg-surface-subtle text-ink-500",
  };
  return (
    <div className="card flex items-center gap-3 p-3.5">
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-lg font-bold leading-none text-ink-900">{value}</p>
        <p className="mt-1 text-xs text-ink-400">{label}</p>
      </div>
    </div>
  );
}

function AgendaActions({
  appointment: a,
  onStart,
  onFinish,
  onPay,
  onView,
  onCancel,
  onReschedule,
  menuOpen,
  onToggleMenu,
}: {
  appointment: Appointment;
  onStart: () => void;
  onFinish: () => void;
  onPay: () => void;
  onView: () => void;
  onCancel: () => void;
  onReschedule: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  const primaryAction: Record<AppointmentStatus, { label: string; icon: typeof Play; fn: () => void } | null> = {
    confirmado: { label: "Iniciar atención", icon: Play, fn: onStart },
    programado: { label: "Iniciar atención", icon: Play, fn: onStart },
    presente: { label: "Iniciar atención", icon: Play, fn: onStart },
    en_tratamiento: { label: "Finalizar", icon: CheckCircle2, fn: onFinish },
    pendiente_pago: { label: "Registrar pago", icon: CreditCard, fn: onPay },
    finalizado: null,
    cancelado: null,
  };
  const main = primaryAction[a.status];

  return (
    <div className="relative flex items-center gap-2">
      {main && (
        <button className="btn-primary px-3 py-1.5 text-xs" onClick={main.fn}>
          <main.icon className="h-3.5 w-3.5" /> {main.label}
        </button>
      )}
      <button className="btn-outline px-3 py-1.5 text-xs" onClick={onView}>
        <Eye className="h-3.5 w-3.5" /> Ficha
      </button>
      <button className="btn-ghost px-2 py-1.5" onClick={onToggleMenu}>
        <MoreVertical className="h-4 w-4" />
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-ink-900/5 bg-white shadow-pop animate-fade-in">
          <button
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink-700 hover:bg-surface-muted"
            onClick={() => {
              onReschedule();
              onToggleMenu();
            }}
          >
            <CalendarClock className="h-4 w-4" /> Reprogramar
          </button>
          {a.status !== "cancelado" && a.status !== "finalizado" && (
            <button
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger-600 hover:bg-danger-50"
              onClick={() => {
                onCancel();
                onToggleMenu();
              }}
            >
              <XCircle className="h-4 w-4" /> Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
