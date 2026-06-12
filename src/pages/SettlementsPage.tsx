import { useMemo, useState } from "react";
import { Download, Check, FileText } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs } from "@/components/common/Tabs";
import { DataTable } from "@/components/common/DataTable";
import { MetricCard } from "@/components/common/MetricCard";
import { Select } from "@/components/common/Controls";
import { useToast } from "@/store/ToastContext";
import { settlements, societyContributions, settlementPeriodLabel } from "@/data/mockSettlements";
import { downloadCsv } from "@/utils/csv";
import { formatCurrency } from "@/utils/format";
import type { Settlement } from "@/types";

const tabs = [
  { id: "secundario", label: "Profesionales secundarios" },
  { id: "principal", label: "Profesionales principales" },
  { id: "historial", label: "Historial" },
];

export function SettlementsPage() {
  const toast = useToast();
  const [tab, setTab] = useState("secundario");
  const [quincena, setQuincena] = useState("primera");
  const [month, setMonth] = useState("5");
  const [selected, setSelected] = useState<Settlement | null>(null);

  const filtered = useMemo(() => {
    return settlements.filter((s) => {
      if (tab === "historial") return true;
      if (tab === "secundario" && s.type !== "secundario") return false;
      if (tab === "principal" && s.type !== "principal") return false;
      if (s.quincena !== quincena) return false;
      if (String(s.month) !== month) return false;
      return true;
    });
  }, [tab, quincena, month]);

  const exportCsv = (s: Settlement) => {
    const rows: (string | number)[][] = [
      ["Fecha", "Paciente", "Tratamiento", "Precio", "Comisión"],
      ...s.lines.map((l) => [l.date, l.patientName, l.treatmentName, l.treatmentPrice, l.commission]),
    ];
    downloadCsv(`liquidacion-${s.doctorName.replace(/\s/g, "-")}.csv`, rows);
    toast("success", "Reporte descargado", "Archivo CSV generado localmente.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Liquidaciones"
        subtitle="Comisiones y aportes quincenales"
      />

      <div className="card flex flex-wrap items-center gap-2 p-3">
        <Select
          value={quincena}
          onChange={(e) => setQuincena(e.target.value)}
          options={[
            { value: "primera", label: "1ª quincena" },
            { value: "segunda", label: "2ª quincena" },
          ]}
        />
        <Select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={[
            { value: "5", label: "Junio 2026" },
            { value: "4", label: "Mayo 2026" },
            { value: "3", label: "Abril 2026" },
          ]}
        />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab !== "historial" && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard label="Tratamientos" value={String(filtered.reduce((s, x) => s + x.treatmentsCount, 0))} accent="brand" />
          <MetricCard label="Facturación generada" value={formatCurrency(filtered.reduce((s, x) => s + x.generatedRevenue, 0))} accent="brand" />
          <MetricCard label="Comisión total" value={formatCurrency(filtered.reduce((s, x) => s + x.totalCommission, 0))} accent="warning" />
          <MetricCard label="Saldo pendiente" value={formatCurrency(filtered.reduce((s, x) => s + x.pending, 0))} accent="danger" />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            columns={[
              { key: "doctor", header: "Profesional", render: (s: Settlement) => <span className="font-semibold">{s.doctorName}</span> },
              { key: "period", header: "Período", render: (s: Settlement) => settlementPeriodLabel(s) },
              { key: "count", header: "Tratamientos", align: "center", render: (s: Settlement) => s.treatmentsCount },
              { key: "commission", header: "Comisión", align: "right", render: (s: Settlement) => formatCurrency(s.totalCommission) },
              { key: "pending", header: "Pendiente", align: "right", render: (s: Settlement) => formatCurrency(s.pending) },
              {
                key: "actions",
                header: "",
                align: "right",
                render: (s: Settlement) => (
                  <div className="flex justify-end gap-1">
                    <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setSelected(s)}>
                      <FileText className="h-3.5 w-3.5" /> Ver
                    </button>
                    <button className="btn-ghost px-2 py-1 text-xs" onClick={() => exportCsv(s)}>
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filtered}
            rowKey={(s) => s.id}
            onRowClick={setSelected}
          />
        </div>

        <div className="card p-5">
          {selected ? (
            <>
              <h3 className="font-semibold text-ink-900">{selected.doctorName}</h3>
              <p className="text-xs text-ink-400">{settlementPeriodLabel(selected)}</p>
              <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
                {selected.lines.slice(0, 8).map((l) => (
                  <div key={l.appointmentId} className="rounded-lg bg-surface-muted px-3 py-2 text-xs">
                    <p className="font-medium text-ink-900">{l.patientName}</p>
                    <p className="text-ink-400">{l.treatmentName} · {formatCurrency(l.commission)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="btn-primary flex-1 text-xs"
                  onClick={() => toast("success", "Liquidación generada")}
                >
                  Generar liquidación
                </button>
                <button
                  className="btn-secondary flex-1 text-xs"
                  onClick={() => toast("success", "Marcada como pagada")}
                >
                  <Check className="h-3.5 w-3.5" /> Pagada
                </button>
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-sm text-ink-400">
              Seleccioná una liquidación para ver el detalle.
            </p>
          )}
        </div>
      </div>

      {tab === "principal" && (
        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-ink-900">Aporte de cada socia a la sociedad</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {societyContributions.map((c) => (
              <div key={c.doctorId} className="rounded-xl bg-surface-muted p-4">
                <p className="text-sm font-semibold text-ink-900">{c.name}</p>
                <div className="mt-2 space-y-1 text-xs text-ink-500">
                  <p>Transferencia clínica: {formatCurrency(c.toClinic)}</p>
                  <p>Tarjeta: {formatCurrency(c.toCard)}</p>
                  <p>Efectivo: {formatCurrency(c.toCash)}</p>
                </div>
                <p className="mt-2 text-sm font-bold text-brand-700">Total: {formatCurrency(c.total)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
