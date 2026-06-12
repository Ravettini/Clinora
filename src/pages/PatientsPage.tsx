import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Plus, Eye } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { FilterBar, SearchInput, Select } from "@/components/common/Controls";
import { Badge } from "@/components/common/StatusBadge";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { useApp } from "@/store/AppContext";
import { useUI } from "@/store/UIContext";
import { getPatientStats } from "@/data/patientStats";
import { primaryDoctors } from "@/data/mockDoctors";
import { calcAge, formatCurrency, formatDate } from "@/utils/format";
import type { Patient } from "@/types";

export function PatientsPage() {
  const { patients, appointments } = useApp();
  const { openNewIncome } = useUI();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dniSearch, setDniSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const age = calcAge(p.birthDate);
      if (search && !p.fullName.toLowerCase().includes(search.toLowerCase())) return false;
      if (dniSearch && !p.dni.replace(/\./g, "").includes(dniSearch.replace(/\./g, ""))) return false;
      if (ageFilter === "joven" && age >= 35) return false;
      if (ageFilter === "adulto" && (age < 35 || age >= 50)) return false;
      if (ageFilter === "maduro" && age < 50) return false;
      if (visitFilter === "30" && (!p.lastVisit || p.lastVisit < "2026-05-12")) return false;
      if (visitFilter === "90" && (!p.lastVisit || p.lastVisit < "2026-03-13")) return false;
      if (doctorFilter && p.usualDoctorId !== doctorFilter) return false;
      return true;
    });
  }, [patients, search, dniSearch, ageFilter, visitFilter, doctorFilter]);

  const columns = [
    { key: "dni", header: "DNI", render: (p: Patient) => <span className="font-mono text-xs">{p.dni}</span> },
    { key: "name", header: "Paciente", render: (p: Patient) => <span className="font-semibold text-ink-900">{p.fullName}</span> },
    { key: "age", header: "Edad", render: (p: Patient) => `${calcAge(p.birthDate)} años` },
    { key: "phone", header: "Teléfono", render: (p: Patient) => <span className="text-xs">{p.phone}</span> },
    { key: "email", header: "Mail", render: (p: Patient) => <span className="text-xs text-ink-400">{p.email || "—"}</span> },
    { key: "lastVisit", header: "Última visita", render: (p: Patient) => p.lastVisit ? formatDate(p.lastVisit) : "—" },
    {
      key: "treatments",
      header: "Tratamientos",
      align: "center" as const,
      render: (p: Patient) => getPatientStats(p.id, appointments).treatmentsCount,
    },
    {
      key: "spent",
      header: "Total gastado",
      align: "right" as const,
      render: (p: Patient) => formatCurrency(getPatientStats(p.id, appointments).totalSpent),
    },
    {
      key: "status",
      header: "Estado",
      render: (p: Patient) => (
        <Badge tone={p.status === "activo" ? "positive" : p.status === "nuevo" ? "brand" : "neutral"}>
          {p.status === "activo" ? "Activo" : p.status === "nuevo" ? "Nuevo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (p: Patient) => (
        <button
          className="btn-ghost px-2 py-1 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/pacientes/${p.id}`);
          }}
        >
          <Eye className="h-3.5 w-3.5" /> Ver
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pacientes"
        subtitle={`${patients.length} pacientes registrados`}
        actions={
          <>
            <button className="btn-secondary" onClick={() => openNewIncome()}>
              <Plus className="h-4 w-4" /> Nuevo ingreso
            </button>
            <button className="btn-primary" onClick={() => setFormOpen(true)}>
              <UserPlus className="h-4 w-4" /> Nuevo paciente
            </button>
          </>
        }
      />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre…" />
        <SearchInput value={dniSearch} onChange={setDniSearch} placeholder="Buscar por DNI…" className="max-w-[160px]" />
        <Select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          placeholder="Edad"
          options={[
            { value: "joven", label: "Menor de 35" },
            { value: "adulto", label: "35 a 49" },
            { value: "maduro", label: "50 o más" },
          ]}
        />
        <Select
          value={visitFilter}
          onChange={(e) => setVisitFilter(e.target.value)}
          placeholder="Última visita"
          options={[
            { value: "30", label: "Últimos 30 días" },
            { value: "90", label: "Últimos 90 días" },
          ]}
        />
        <Select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          placeholder="Profesional"
          options={primaryDoctors.map((d) => ({ value: d.id, label: d.fullName }))}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(p) => p.id}
        onRowClick={(p) => navigate(`/pacientes/${p.id}`)}
        renderMobileCard={(p) => {
          const stats = getPatientStats(p.id, appointments);
          return (
            <div className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ink-900">{p.fullName}</p>
                  <p className="text-xs text-ink-400">DNI {p.dni} · {calcAge(p.birthDate)} años</p>
                </div>
                <Badge tone={p.status === "activo" ? "positive" : "brand"}>
                  {p.status}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink-500">
                <span>{stats.treatmentsCount} tratamientos</span>
                <span className="text-right font-semibold text-ink-900">{formatCurrency(stats.totalSpent)}</span>
              </div>
            </div>
          );
        }}
      />

      <PatientFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
