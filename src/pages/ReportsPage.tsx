import { useState } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  PieChart,
  Users,
  Wallet,
  Boxes,
  LineChart,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ChartCard } from "@/components/common/ChartCard";
import { Select } from "@/components/common/Controls";
import { EbitdaLineChart, DonutChart, SimpleBarChart } from "@/components/charts";
import { dashboardData } from "@/data/mockDashboard";
import { pnlRows } from "@/data/mockPnL";
import { downloadCsv } from "@/utils/csv";
import { useToast } from "@/store/ToastContext";
import { formatCurrency, formatPercent } from "@/utils/format";
import { ebitdaMargin } from "@/utils/calculations";
import { cn } from "@/utils/cn";

const reportCards = [
  { id: "ventas", title: "Ventas por período", icon: BarChart3 },
  { id: "categoria", title: "Facturación por categoría", icon: PieChart },
  { id: "profesional", title: "Facturación por profesional", icon: Users },
  { id: "comisiones", title: "Comisiones médicas", icon: Wallet },
  { id: "ticket", title: "Ticket promedio", icon: TrendingUp },
  { id: "edad", title: "Pacientes por edad", icon: Users },
  { id: "medios", title: "Medios de pago", icon: Wallet },
  { id: "egresos", title: "Egresos", icon: BarChart3 },
  { id: "ebitda", title: "EBITDA y P&L", icon: LineChart },
  { id: "inventario", title: "Inventario", icon: Boxes },
  { id: "precios", title: "Evolución de precios", icon: LineChart },
];

export function ReportsPage() {
  const toast = useToast();
  const [active, setActive] = useState("ebitda");
  const d = dashboardData;
  const last = pnlRows[pnlRows.length - 1];
  const prev = pnlRows[pnlRows.length - 2];

  const exportReport = () => {
    const rows: (string | number)[][] = [
      ["Mes", "Ventas", "EBITDA", "Margen bruto", "Resultado operativo"],
      ...pnlRows.map((r) => [r.month, r.sales, r.ebitda, r.grossMargin, r.operatingResult]),
    ];
    downloadCsv("reporte-clinora.csv", rows);
    toast("success", "Reporte exportado", "Archivo CSV descargado.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reportes"
        subtitle="Análisis financiero y operativo"
        actions={
          <button className="btn-secondary" onClick={exportReport}>
            <Download className="h-4 w-4" /> Exportar
          </button>
        }
      />

      <div className="card flex flex-wrap gap-2 p-3">
        <Select placeholder="Período" options={[
          { value: "jun", label: "Junio 2026" },
          { value: "q2", label: "Q2 2026" },
          { value: "ytd", label: "Año a la fecha" },
        ]} />
        <Select placeholder="Sucursal" options={[
          { value: "palermo", label: "Sede Palermo" },
          { value: "belgrano", label: "Sede Belgrano" },
        ]} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reportCards.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(r.id)}
            className={cn(
              "card flex items-center gap-3 p-4 text-left transition hover:shadow-pop",
              active === r.id && "ring-2 ring-brand-400",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <r.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-ink-900">{r.title}</span>
          </button>
        ))}
      </div>

      {active === "ebitda" && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="EBITDA Junio" value={formatCurrency(last.ebitda)} delta={formatPercent(((last.ebitda - prev.ebitda) / prev.ebitda) * 100)} />
            <Kpi label="Margen EBITDA" value={`${ebitdaMargin(last.ebitda, last.sales)}%`} />
            <Kpi label="Margen bruto" value={`${ebitdaMargin(last.grossMargin, last.sales)}%`} />
            <Kpi label="Resultado operativo" value={formatCurrency(last.operatingResult)} />
          </div>

          <ChartCard title="Evolución del EBITDA" subtitle="Enero a Junio 2026">
            <EbitdaLineChart data={pnlRows.map((r) => ({ month: r.month, ebitda: r.ebitda }))} />
          </ChartCard>

          <div className="card overflow-x-auto">
            <h3 className="mb-4 px-5 pt-5 font-semibold text-ink-900">Resultados financieros (P&L)</h3>
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 bg-surface-muted/60 text-xs uppercase text-ink-400">
                  <th className="px-4 py-3 text-left">Concepto</th>
                  {pnlRows.map((r) => (
                    <th key={r.month} className="px-3 py-3 text-right">{r.month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ["Ventas", "sales"],
                  ["Costo de mercadería", "cogs"],
                  ["Honorarios médicos", "medicalFees"],
                  ["Margen bruto", "grossMargin"],
                  ["Salarios", "salaries"],
                  ["Gastos administrativos", "admin"],
                  ["Marketing", "marketing"],
                  ["Comercialización", "commercialization"],
                  ["Impuestos", "taxes"],
                  ["Servicios", "services"],
                  ["Alquiler", "rent"],
                  ["Intereses", "interest"],
                  ["EBITDA", "ebitda"],
                  ["Depreciación", "depreciation"],
                  ["Amortización", "amortization"],
                  ["Resultado operativo", "operatingResult"],
                ] as const).map(([label, key]) => (
                  <tr key={key} className={`border-b border-ink-900/5 ${key === "ebitda" || key === "grossMargin" ? "bg-brand-50/40 font-semibold" : ""}`}>
                    <td className="px-4 py-2.5 text-ink-700">{label}</td>
                    {pnlRows.map((r) => (
                      <td key={r.month} className="px-3 py-2.5 text-right text-ink-600">
                        {formatCurrency(r[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ChartCard title="Composición de gastos" subtitle="Junio 2026">
            <DonutChart
              data={[
                { name: "Salarios", value: last.salaries },
                { name: "Impuestos", value: last.taxes },
                { name: "Honorarios", value: last.medicalFees },
                { name: "Marketing", value: last.marketing },
                { name: "Servicios", value: last.services },
                { name: "Alquiler", value: last.rent },
              ]}
            />
          </ChartCard>
        </>
      )}

      {active !== "ebitda" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title={reportCards.find((r) => r.id === active)?.title ?? "Reporte"}>
            {active === "categoria" ? (
              <DonutChart data={d.byCategory.map((c) => ({ name: c.name, value: c.value, color: c.color }))} />
            ) : active === "ventas" ? (
              <SimpleBarChart data={d.monthly.map((m) => ({ label: m.month, value: m.revenueArs }))} />
            ) : active === "medios" ? (
              <DonutChart data={d.paymentMethods.map((p) => ({ name: p.label, value: p.value }))} />
            ) : (
              <SimpleBarChart data={d.monthly.map((m) => ({ label: m.month, value: m.treatments }))} />
            )}
          </ChartCard>
          <div className="card p-5">
            <h3 className="font-semibold text-ink-900">KPIs del reporte</h3>
            <div className="mt-4 space-y-3">
              <Kpi label="Facturación del período" value={formatCurrency(d.kpis.revenueMonth)} />
              <Kpi label="Ticket promedio" value={formatCurrency(d.kpis.avgTicket)} />
              <Kpi label="Pacientes atendidos" value={String(d.kpis.patientsServed)} />
            </div>
            <button className="btn-outline mt-5 w-full" onClick={exportReport}>
              <Download className="h-4 w-4" /> Exportar CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink-900">{value}</p>
      {delta && <p className="mt-0.5 text-xs font-semibold text-positive-600">{delta}</p>}
    </div>
  );
}
