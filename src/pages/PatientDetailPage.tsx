import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  FileText,
  StickyNote,
  Sparkles,
} from "lucide-react";
import { Tabs } from "@/components/common/Tabs";
import { Badge } from "@/components/common/StatusBadge";
import { AppointmentStatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/common/DataTable";
import { useApp } from "@/store/AppContext";
import { useUI } from "@/store/UIContext";
import { getPatientAppointments, getPatientStats } from "@/data/patientStats";
import { getTreatment } from "@/data/mockTreatments";
import { getDoctor } from "@/data/mockDoctors";
import { getCategory } from "@/data/mockCategories";
import { paymentMethodLabels } from "@/utils/labels";
import { calcAge, formatCurrency, formatDate } from "@/utils/format";

const tabs = [
  { id: "resumen", label: "Resumen" },
  { id: "tratamientos", label: "Tratamientos" },
  { id: "pagos", label: "Pagos" },
  { id: "documentacion", label: "Documentación" },
  { id: "observaciones", label: "Observaciones" },
];

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { patients, appointments } = useApp();
  const { openNewIncome } = useUI();
  const [tab, setTab] = useState("resumen");

  const patient = patients.find((p) => p.id === id);
  const appts = useMemo(
    () => (id ? getPatientAppointments(id, appointments) : []),
    [id, appointments],
  );
  const stats = id ? getPatientStats(id, appointments) : null;

  if (!patient || !stats) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-500">Paciente no encontrado.</p>
        <Link to="/pacientes" className="btn-primary mt-4 inline-flex">
          Volver a pacientes
        </Link>
      </div>
    );
  }

  const timeline = appts.slice(0, 8).map((a) => {
    const t = getTreatment(a.treatmentId);
    return {
      id: a.id,
      date: a.date,
      title: t.name,
      detail: `${getCategory(t.categoryId).name} · ${formatCurrency(a.price)}`,
      status: a.status,
    };
  });

  return (
    <div className="space-y-5">
      <Link to="/pacientes" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Volver a pacientes
      </Link>

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-brand-50 to-accent-lavender/30 px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold text-white shadow-soft">
                {patient.firstName[0]}
                {patient.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ink-900">{patient.fullName}</h1>
                <p className="text-sm text-ink-500">
                  DNI {patient.dni} · {calcAge(patient.birthDate)} años · {patient.city}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone={patient.status === "activo" ? "positive" : "brand"}>
                    {patient.status}
                  </Badge>
                  {stats.pendingPayments > 0 && (
                    <Badge tone="danger">Deuda {formatCurrency(stats.pendingPayments)}</Badge>
                  )}
                </div>
              </div>
            </div>
            <button className="btn-primary" onClick={() => openNewIncome(patient.id)}>
              <Plus className="h-4 w-4" /> Nuevo ingreso
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-ink-900/5 sm:grid-cols-4">
          <MiniStat label="Tratamientos" value={String(stats.treatmentsCount)} />
          <MiniStat label="Total gastado" value={formatCurrency(stats.totalSpent)} />
          <MiniStat label="Ticket promedio" value={formatCurrency(stats.avgTicket)} />
          <MiniStat label="Profesional habitual" value={stats.usualDoctorName?.replace("Dra. ", "") ?? "—"} />
        </div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "resumen" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card space-y-3 p-5 lg:col-span-1">
            <h3 className="font-semibold text-ink-900">Datos personales</h3>
            <InfoRow icon={Phone} label="Teléfono" value={patient.phone} />
            <InfoRow icon={Mail} label="Email" value={patient.email || "—"} />
            <InfoRow icon={MapPin} label="Dirección" value={`${patient.address}, ${patient.city}`} />
            <InfoRow icon={Calendar} label="Nacimiento" value={`${formatDate(patient.birthDate)} (${calcAge(patient.birthDate)} años)`} />
            <InfoRow icon={Calendar} label="Última visita" value={patient.lastVisit ? formatDate(patient.lastVisit) : "Sin visitas"} />
          </div>
          <div className="card p-5 lg:col-span-2">
            <h3 className="mb-4 font-semibold text-ink-900">Línea de tiempo</h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-ink-400">Sin actividad registrada.</p>
            ) : (
              <div className="space-y-4">
                {timeline.map((item, i) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      {i < timeline.length - 1 && (
                        <div className="mt-1 h-full w-px bg-ink-900/10" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                        <AppointmentStatusBadge status={item.status} />
                      </div>
                      <p className="text-xs text-ink-400">{formatDate(item.date)} · {item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "tratamientos" && (
        <DataTable
          columns={[
            { key: "date", header: "Fecha", render: (a) => formatDate(a.date) },
            { key: "treatment", header: "Tratamiento", render: (a) => getTreatment(a.treatmentId).name },
            { key: "doctor", header: "Profesional", render: (a) => getDoctor(a.primaryDoctorId)?.fullName ?? "—" },
            { key: "price", header: "Monto", align: "right", render: (a) => formatCurrency(a.price) },
            { key: "status", header: "Estado", render: (a) => <AppointmentStatusBadge status={a.status} /> },
          ]}
          data={appts}
          rowKey={(a) => a.id}
        />
      )}

      {tab === "pagos" && (
        <DataTable
          columns={[
            { key: "date", header: "Fecha", render: (a) => formatDate(a.date) },
            { key: "treatment", header: "Concepto", render: (a) => getTreatment(a.treatmentId).name },
            { key: "method", header: "Medio", render: (a) => a.paymentMethod ? paymentMethodLabels[a.paymentMethod] : "—" },
            { key: "price", header: "Importe", align: "right", render: (a) => formatCurrency(a.price) },
            { key: "status", header: "Estado", render: (a) => <AppointmentStatusBadge status={a.status} /> },
          ]}
          data={appts.filter((a) => ["finalizado", "pendiente_pago"].includes(a.status))}
          rowKey={(a) => a.id}
          emptyTitle="Sin pagos registrados"
        />
      )}

      {tab === "documentacion" && (
        <div className="card p-6">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle text-brand-400">
              <FileText className="h-7 w-7" />
            </span>
            <div>
              <p className="font-semibold text-ink-700">Documentación demostrativa</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-ink-400">
                En la versión productiva podrás cargar consentimientos, estudios y fotografías clínicas.
              </p>
            </div>
            <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {["Consentimiento informado.pdf", "Fotografía pre-tratamiento.jpg", "Historia clínica resumen.pdf"].map((f) => (
                <div key={f} className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-surface-muted px-3 py-2.5 text-sm text-ink-600">
                  <FileText className="h-4 w-4 text-brand-500" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "observaciones" && (
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <StickyNote className="mt-0.5 h-5 w-5 text-brand-500" />
            <div>
              <h3 className="font-semibold text-ink-900">Observaciones</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {patient.notes ?? "Sin observaciones registradas para este paciente."}
              </p>
              <p className="mt-4 text-xs text-ink-400">
                Las notas son editables en memoria en la versión productiva.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4 py-3">
      <p className="text-[11px] font-medium text-ink-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-bold text-ink-900">{value}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="font-medium text-ink-700">{value}</p>
      </div>
    </div>
  );
}
