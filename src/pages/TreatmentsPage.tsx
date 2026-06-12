import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { FilterBar, SearchInput, Select } from "@/components/common/Controls";
import { Segmented } from "@/components/common/Tabs";
import { AppointmentStatusBadge } from "@/components/common/StatusBadge";
import { useApp } from "@/store/AppContext";
import { useUI } from "@/store/UIContext";
import { getPatient } from "@/data/mockPatients";
import { getTreatment } from "@/data/mockTreatments";
import { getDoctor } from "@/data/mockDoctors";
import { getCategory, categories } from "@/data/mockCategories";
import { paymentMethodLabels } from "@/utils/labels";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Appointment } from "@/types";

type ViewMode = "table" | "cards" | "calendar";

export function TreatmentsPage() {
  const { appointments, branchId } = useApp();
  const { openNewIncome } = useUI();
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [doctor] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => a.branchId === branchId)
      .filter((a) => {
        const patient = getPatient(a.patientId);
        const treatment = getTreatment(a.treatmentId);
        if (search && !patient?.fullName.toLowerCase().includes(search.toLowerCase())) return false;
        if (category && treatment.categoryId !== category) return false;
        if (doctor && a.primaryDoctorId !== doctor && a.secondaryDoctorId !== doctor) return false;
        if (status && a.status !== status) return false;
        if (method && a.paymentMethod !== method) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [appointments, branchId, search, category, doctor, status, method]);

  const columns = [
    { key: "date", header: "Fecha", render: (a: Appointment) => formatDate(a.date) },
    { key: "patient", header: "Paciente", render: (a: Appointment) => getPatient(a.patientId)?.fullName ?? "—" },
    { key: "treatment", header: "Tratamiento", render: (a: Appointment) => getTreatment(a.treatmentId).name },
    { key: "category", header: "Categoría", render: (a: Appointment) => getCategory(getTreatment(a.treatmentId).categoryId).name },
    { key: "primary", header: "Principal", render: (a: Appointment) => getDoctor(a.primaryDoctorId)?.fullName?.replace("Dra. ", "") ?? "—" },
    { key: "secondary", header: "Secundario", render: (a: Appointment) => getDoctor(a.secondaryDoctorId)?.fullName?.replace("Dra. ", "") ?? "—" },
    { key: "duration", header: "Duración", render: (a: Appointment) => `${a.realDurationMin ?? a.estimatedDurationMin} min` },
    { key: "price", header: "Monto", align: "right" as const, render: (a: Appointment) => formatCurrency(a.price) },
    { key: "commission", header: "Comisión", align: "right" as const, render: (a: Appointment) => formatCurrency(a.commission) },
    { key: "status", header: "Estado", render: (a: Appointment) => <AppointmentStatusBadge status={a.status} /> },
    { key: "method", header: "Pago", render: (a: Appointment) => a.paymentMethod ? paymentMethodLabels[a.paymentMethod] : "—" },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tratamientos"
        subtitle={`${filtered.length} registros`}
        actions={
          <>
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "table", label: "Tabla" },
                { value: "cards", label: "Tarjetas" },
                { value: "calendar", label: "Calendario" },
              ]}
            />
            <button className="btn-primary" onClick={() => openNewIncome()}>
              <Plus className="h-4 w-4" /> Nuevo ingreso
            </button>
          </>
        }
      />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar paciente…" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoría" options={categories.map((c) => ({ value: c.id, label: c.name }))} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Estado" options={[
          { value: "en_tratamiento", label: "En tratamiento" },
          { value: "pendiente_pago", label: "Pendiente de pago" },
          { value: "finalizado", label: "Finalizado" },
          { value: "cancelado", label: "Cancelado" },
        ]} />
        <Select value={method} onChange={(e) => setMethod(e.target.value)} placeholder="Medio de pago" options={Object.entries(paymentMethodLabels).map(([v, l]) => ({ value: v, label: l }))} />
      </FilterBar>

      {view === "table" && (
        <DataTable columns={columns} data={filtered} rowKey={(a) => a.id} />
      )}

      {view === "cards" && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, 30).map((a) => {
            const patient = getPatient(a.patientId);
            const treatment = getTreatment(a.treatmentId);
            return (
              <div key={a.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink-900">{patient?.fullName}</p>
                    <p className="text-sm text-ink-500">{treatment.name}</p>
                  </div>
                  <AppointmentStatusBadge status={a.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-ink-400">{formatDate(a.date)}</span>
                  <span className="font-bold text-brand-700">{formatCurrency(a.price)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "calendar" && (
        <div className="card p-5">
          <p className="mb-4 text-sm font-semibold text-ink-700">Junio 2026</p>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-400">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const iso = `2026-06-${String(day).padStart(2, "0")}`;
              const count = filtered.filter((a) => a.date === iso).length;
              const isToday = day === 11;
              return (
                <div
                  key={day}
                  className={`min-h-[52px] rounded-lg border p-1.5 text-xs ${
                    isToday ? "border-brand-400 bg-brand-50" : "border-ink-900/5 bg-white"
                  }`}
                >
                  <span className={`font-semibold ${isToday ? "text-brand-700" : "text-ink-500"}`}>{day}</span>
                  {count > 0 && (
                    <span className="mt-1 block rounded bg-brand-100 px-1 py-0.5 text-[10px] font-bold text-brand-700">
                      {count} turnos
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
