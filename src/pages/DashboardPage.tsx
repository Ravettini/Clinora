import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Banknote,
  Activity,
  Receipt,
  Users,
  CalendarHeart,
  HandCoins,
  TrendingDown,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { ChartCard } from "@/components/common/ChartCard";
import { CardSkeleton, Skeleton } from "@/components/common/Skeleton";
import { Select } from "@/components/common/Controls";
import {
  RevenueLineChart,
  DonutChart,
  SimpleBarChart,
  HorizontalBarChart,
  StackedBarChart,
} from "@/components/charts";
import { dashboardData } from "@/data/mockDashboard";
import { primaryDoctors } from "@/data/mockDoctors";
import { terms } from "@/auth/tenants";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/format";
import { useUI } from "@/store/UIContext";
import { cn } from "@/utils/cn";
import type { ActivityItem } from "@/types";

const periods = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mes" },
  { value: "trimestre", label: "Últimos 3 meses" },
  { value: "custom", label: "Rango personalizado" },
];

const activityTone: Record<ActivityItem["type"], string> = {
  cobro: "bg-positive-50 text-positive-600",
  tratamiento_inicio: "bg-brand-50 text-brand-600",
  tratamiento_fin: "bg-brand-50 text-brand-600",
  paciente_nuevo: "bg-accent-lavender/50 text-brand-700",
  liquidacion: "bg-warning-50 text-warning-600",
  stock: "bg-danger-50 text-danger-600",
};

export function DashboardPage() {
  const { openNewIncome } = useUI();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("mes");
  const [doctor, setDoctor] = useState("");

  const d = dashboardData;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [period, doctor]);

  const revenueLine = d.monthly.map((m) => ({
    month: m.month,
    ars: m.revenueArs,
    usd: m.revenueUsd,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Resumen general"
        subtitle="Indicadores principales de la operación"
        actions={
          <button className="btn-primary" onClick={() => openNewIncome()}>
            <Plus className="h-4 w-4" /> Nuevo ingreso
          </button>
        }
      />

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-2 p-3">
        <div className="flex flex-wrap gap-1.5">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                period === p.value
                  ? "bg-brand-600 text-white"
                  : "text-ink-500 hover:bg-surface-subtle",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          {period === "custom" && (
            <div className="flex items-center gap-1.5">
              <input type="date" className="input py-1.5" defaultValue="2026-06-01" />
              <span className="text-ink-400">—</span>
              <input type="date" className="input py-1.5" defaultValue="2026-06-11" />
            </div>
          )}
          <Select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            placeholder={`Todos los ${terms.professionals.toLowerCase()}`}
            options={primaryDoctors.map((p) => ({ value: p.id, label: p.fullName }))}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-accent-lavender/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
              <HelpCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-ink-900">¿Qué significa cada cosa?</p>
              <p className="mt-0.5 text-sm text-ink-500">
                Hay una guía rápida que explica módulos, KPIs, gráficos, estados y flujos de
                la demo.
              </p>
            </div>
          </div>
          <Link to="/guia" className="btn-secondary shrink-0">
            Ver guía de demo
          </Link>
        </div>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label="Facturación del mes" value={formatCurrency(d.kpis.revenueMonth)} icon={DollarSign} delta={d.deltas.revenue} accent="brand" />
          <MetricCard label="Facturación ARS" value={formatCurrency(d.kpis.revenueArs)} icon={Banknote} delta={d.deltas.revenue} accent="brand" />
          <MetricCard label="Equivalente USD" value={`USD ${formatNumber(d.kpis.revenueUsd)}`} icon={DollarSign} deltaLabel="al tipo de cambio demo" delta={0} accent="positive" />
          <MetricCard label={terms.sales} value={formatNumber(d.kpis.treatments)} icon={Activity} delta={d.deltas.treatments} accent="brand" />
          <MetricCard label="Ticket promedio" value={formatCurrency(d.kpis.avgTicket)} icon={Receipt} delta={d.deltas.avgTicket} accent="brand" />
          <MetricCard label={`${terms.patients} atendidos`} value={formatNumber(d.kpis.patientsServed)} icon={Users} deltaLabel={`+${d.deltas.patients} ${terms.patients.toLowerCase()}`} delta={d.deltas.patients} accent="positive" />
          <MetricCard label="Edad promedio" value={`${d.kpis.avgAge} años`} icon={CalendarHeart} delta={d.deltas.avgAge} accent="neutral" />
          <MetricCard label="Comisiones pendientes" value={formatCurrency(d.kpis.pendingCommissions)} icon={HandCoins} delta={d.deltas.commissions} accent="warning" />
          <MetricCard label="Total de egresos" value={formatCurrency(d.kpis.totalExpenses)} icon={TrendingDown} delta={d.deltas.expenses} accent="danger" />
          <MetricCard label="EBITDA estimado" value={formatCurrency(d.kpis.ebitda)} icon={TrendingUp} delta={d.deltas.ebitda} accent="positive" />
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Evolución mensual de facturación"
          subtitle="Últimos 6 meses · ARS y equivalente USD"
          className="lg:col-span-2"
        >
          {loading ? <Skeleton className="h-[260px] w-full" /> : <RevenueLineChart data={revenueLine} />}
        </ChartCard>
        <ChartCard title="Facturación por categoría" subtitle="Participación sobre el total">
          {loading ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <DonutChart data={d.byCategory.map((c) => ({ name: c.name, value: c.value, color: c.color }))} />
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={`Cantidad de ${terms.sales.toLowerCase()} por mes`}>
          {loading ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <SimpleBarChart data={d.monthly.map((m) => ({ label: m.month, value: m.treatments }))} />
          )}
        </ChartCard>
        <ChartCard title="Distribución de medios de pago">
          {loading ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <DonutChart
              data={d.paymentMethods.map((p) => ({ name: p.label, value: p.value }))}
            />
          )}
        </ChartCard>
      </div>

      {/* Charts row 3 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={`Facturación por ${terms.professional.toLowerCase()} principal`}>
          {loading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <HorizontalBarChart
              data={d.byPrimaryDoctor.slice(0, 6).map((p) => ({
                label: p.name.replace("Dra. ", ""),
                value: p.value,
              }))}
            />
          )}
        </ChartCard>
        <ChartCard title={`Facturación de ${terms.professionals.toLowerCase()} secundarios`} subtitle="Por destino del cobro">
          {loading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <StackedBarChart
              data={d.bySecondaryDoctor.slice(0, 6)}
              keys={[
                { key: "transferencia", label: "Transferencia", color: "#7a52b0" },
                { key: "tarjeta", label: "Tarjeta", color: "#a98ed4" },
                { key: "efectivo", label: "Efectivo", color: "#e7c6d4" },
              ]}
            />
          )}
        </ChartCard>
      </div>

      {/* Charts row 4 + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Distribución de gastos" subtitle="Egresos acumulados por categoría" className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <HorizontalBarChart
              data={d.expenseDistribution.slice(0, 7).map((e) => ({ label: e.label, value: e.value }))}
            />
          )}
        </ChartCard>

        <div className="card min-w-0 p-5">
          <h3 className="mb-4 font-semibold text-ink-900">Actividad reciente</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3.5">
              {d.activity.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", activityTone[a.type])}>
                    {a.type === "cobro" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : a.type === "stock" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900">{a.title}</p>
                    <p className="truncate text-xs text-ink-400">{a.detail}</p>
                  </div>
                  <span className="ml-auto whitespace-nowrap text-[11px] text-ink-400">{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="pb-2 text-center text-xs text-ink-400">
        {formatPercent(d.deltas.revenue)} de facturación respecto del mes anterior · datos
        demostrativos
      </p>
    </div>
  );
}
