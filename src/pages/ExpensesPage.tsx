import { useMemo, useState } from "react";
import { Plus, Upload, FileSearch } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { DataTable } from "@/components/common/DataTable";
import { FilterBar, Select } from "@/components/common/Controls";
import { Modal } from "@/components/common/Modal";
import { Badge } from "@/components/common/StatusBadge";
import { useToast } from "@/store/ToastContext";
import { expenses, expensesThisMonth } from "@/data/mockExpenses";
import { expenseCategoryLabels } from "@/utils/labels";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Expense, ExpenseCategory } from "@/types";

export function ExpensesPage() {
  const toast = useToast();
  const [category, setCategory] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [ocrResult, setOcrResult] = useState(false);

  const monthTotal = expensesThisMonth.reduce((s, e) => s + e.amountArs, 0);
  const prevMonth = expenses.filter((e) => e.date >= "2026-05-01" && e.date < "2026-06-01").reduce((s, e) => s + e.amountArs, 0);
  const variation = prevMonth ? Math.round(((monthTotal - prevMonth) / prevMonth) * 1000) / 10 : 0;

  const filtered = useMemo(() => {
    return expenses.filter((e) => !category || e.category === category);
  }, [category]);

  const topCategory = useMemo(() => {
    const map = new Map<string, number>();
    expensesThisMonth.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amountArs));
    const top = [...map.entries()].sort((a, b) => b[1] - a[1])[0];
    return top ? expenseCategoryLabels[top[0] as ExpenseCategory] : "—";
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Egresos"
        subtitle="Gastos operativos y administrativos"
        actions={
          <button className="btn-primary" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo egreso
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Egresos del mes" value={formatCurrency(monthTotal)} delta={variation} accent="danger" />
        <MetricCard label="Variación mensual" value={`${variation > 0 ? "+" : ""}${variation}%`} accent="warning" />
        <MetricCard label="Categoría principal" value={topCategory} accent="brand" />
        <MetricCard label="Honorarios médicos" value={formatCurrency(expensesThisMonth.filter((e) => e.category === "honorarios_medicos").reduce((s, e) => s + e.amountArs, 0))} accent="neutral" />
      </div>

      <FilterBar>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Todas las categorías"
          options={Object.entries(expenseCategoryLabels).map(([v, l]) => ({ value: v, label: l }))}
        />
      </FilterBar>

      <DataTable
        columns={[
          { key: "date", header: "Fecha", render: (e: Expense) => formatDate(e.date) },
          { key: "category", header: "Categoría", render: (e: Expense) => expenseCategoryLabels[e.category] },
          { key: "concept", header: "Concepto", render: (e: Expense) => e.concept },
          { key: "supplier", header: "Proveedor", render: (e: Expense) => e.supplier },
          { key: "amount", header: "Importe", align: "right", render: (e: Expense) => formatCurrency(e.amountArs) },
          { key: "method", header: "Medio", render: (e: Expense) => e.paymentMethod },
          { key: "status", header: "Estado", render: (e: Expense) => (
            <Badge tone={e.status === "pagado" ? "positive" : "warning"}>{e.status}</Badge>
          )},
        ]}
        data={filtered.slice(0, 50)}
        rowKey={(e) => e.id}
      />

      <Modal
        open={formOpen}
        onClose={() => { setFormOpen(false); setOcrResult(false); }}
        title="Nuevo egreso"
        size="lg"
        footer={
          <div className="flex w-full justify-end gap-2">
            <button className="btn-outline" onClick={() => setFormOpen(false)}>Cancelar</button>
            <button className="btn-primary" onClick={() => {
              toast("success", "Egreso registrado");
              setFormOpen(false);
              setOcrResult(false);
            }}>Guardar egreso</button>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Fecha</label><input type="date" className="input" defaultValue="2026-06-11" /></div>
          <div>
            <label className="label">Categoría</label>
            <select className="input">
              {Object.entries(expenseCategoryLabels).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2"><label className="label">Concepto</label><input className="input" /></div>
          <div><label className="label">Proveedor</label><input className="input" /></div>
          <div><label className="label">Monto</label><input type="number" className="input" /></div>
          <div>
            <label className="label">Comprobante (simulado)</label>
            <div
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-ink-900/15 bg-surface-muted px-4 py-8 text-center transition hover:border-brand-300"
              onClick={() => {
                setOcrResult(true);
                toast("info", "Archivo simulado cargado");
              }}
            >
              <Upload className="h-6 w-6 text-brand-400" />
              <p className="text-sm font-medium text-ink-600">Arrastrá una factura o seleccioná un archivo</p>
              <p className="text-xs text-ink-400">OCR no implementado en esta demo</p>
            </div>
          </div>
          {ocrResult && (
            <div className="rounded-xl border border-positive-100 bg-positive-50 p-4 sm:col-span-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-positive-700">
                <FileSearch className="h-4 w-4" /> Extracción ficticia detectada
              </p>
              <div className="mt-2 grid gap-1 text-sm text-ink-600 sm:grid-cols-2">
                <p>Proveedor: Insumos Médicos del Sur</p>
                <p>Fecha: 12/06/2026</p>
                <p>Total: $485.000</p>
                <p>Ítems detectados: 3</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
