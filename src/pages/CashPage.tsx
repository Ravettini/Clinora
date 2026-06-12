import { useMemo, useState } from "react";
import { Wallet, DollarSign, CreditCard, ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Tabs } from "@/components/common/Tabs";
import { DataTable } from "@/components/common/DataTable";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/store/AppContext";
import { useToast } from "@/store/ToastContext";
import { cashMovements } from "@/data/mockCashMovements";
import { paymentMethodLabels } from "@/utils/labels";
import { formatCurrency, formatDate, formatNumber } from "@/utils/format";
import type { CashMovement } from "@/types";

const tabs = [
  { id: "movimientos", label: "Movimientos" },
  { id: "ingresos", label: "Ingresos" },
  { id: "pendientes", label: "Cobros pendientes" },
  { id: "cierre", label: "Cierre de caja" },
];

export function CashPage() {
  const { branchId, appointments } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState("movimientos");
  const [manualOpen, setManualOpen] = useState(false);

  const movements = useMemo(
    () => cashMovements.filter((m) => m.branchId === branchId),
    [branchId],
  );

  const income = movements.filter((m) => m.type === "ingreso");
  const egress = movements.filter((m) => m.type === "egreso");

  const cashArs = income
    .filter((m) => m.paymentMethod === "efectivo_ars")
    .reduce((s, m) => s + m.amountArs, 0)
    - egress.filter((m) => m.paymentMethod === "efectivo_ars").reduce((s, m) => s + m.amountArs, 0);

  const cashUsd = income
    .filter((m) => m.paymentMethod === "efectivo_usd")
    .reduce((s, m) => s + m.amount, 0);

  const pending = appointments.filter(
    (a) => a.branchId === branchId && a.status === "pendiente_pago",
  );

  const columns = [
    { key: "date", header: "Fecha", render: (m: CashMovement) => formatDate(m.date) },
    { key: "time", header: "Hora", render: (m: CashMovement) => m.time },
    { key: "type", header: "Tipo", render: (m: CashMovement) => (
      <span className={m.type === "ingreso" ? "text-positive-600" : "text-danger-600"}>
        {m.type === "ingreso" ? "Ingreso" : "Egreso"}
      </span>
    )},
    { key: "concept", header: "Concepto", render: (m: CashMovement) => m.concept },
    { key: "category", header: "Categoría", render: (m: CashMovement) => m.category },
    { key: "method", header: "Medio", render: (m: CashMovement) => paymentMethodLabels[m.paymentMethod] },
    { key: "in", header: "Ingreso", align: "right" as const, render: (m: CashMovement) => m.type === "ingreso" ? formatCurrency(m.amountArs) : "—" },
    { key: "out", header: "Egreso", align: "right" as const, render: (m: CashMovement) => m.type === "egreso" ? formatCurrency(m.amountArs) : "—" },
    { key: "user", header: "Usuario", render: (m: CashMovement) => <span className="text-xs">{m.user}</span> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Caja"
        subtitle="Módulo financiero operativo"
        actions={
          <button className="btn-primary" onClick={() => setManualOpen(true)}>
            <Plus className="h-4 w-4" /> Registrar movimiento manual
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Saldo caja ARS" value={formatCurrency(cashArs)} icon={Wallet} accent="positive" />
        <MetricCard label="Saldo caja USD" value={`USD ${formatNumber(cashUsd)}`} icon={DollarSign} accent="brand" />
        <MetricCard label="Tarjetas" value={formatCurrency(income.filter((m) => m.paymentMethod === "tarjeta").reduce((s, m) => s + m.amountArs, 0))} icon={CreditCard} accent="brand" />
        <MetricCard label="Cobros pendientes" value={formatCurrency(pending.reduce((s, a) => s + a.price, 0))} icon={ArrowDownLeft} accent="warning" />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "movimientos" && (
        <DataTable columns={columns} data={movements.slice(0, 50)} rowKey={(m) => m.id} />
      )}

      {tab === "ingresos" && (
        <DataTable columns={columns} data={income.slice(0, 40)} rowKey={(m) => m.id} />
      )}

      {tab === "pendientes" && (
        <DataTable
          columns={[
            { key: "date", header: "Fecha", render: (a) => formatDate(a.date) },
            { key: "patient", header: "Paciente", render: (a) => a.patientId },
            { key: "price", header: "Importe", align: "right", render: (a) => formatCurrency(a.price) },
          ]}
          data={pending}
          rowKey={(a) => a.id}
          emptyTitle="Sin cobros pendientes"
        />
      )}

      {tab === "cierre" && (
        <div className="card max-w-lg p-6">
          <h3 className="font-semibold text-ink-900">Cierre de caja demostrativo</h3>
          <p className="mt-1 text-sm text-ink-400">11/06/2026 · Sede actual</p>
          <div className="mt-5 space-y-3 text-sm">
            <Row label="Efectivo esperado" value={formatCurrency(cashArs)} />
            <Row label="Efectivo contado" value={formatCurrency(cashArs - 12000)} />
            <Row label="Diferencia" value={formatCurrency(-12000)} danger />
            <div>
              <label className="label">Observaciones</label>
              <textarea className="input min-h-[60px]" defaultValue="Diferencia menor por redondeo en caja chica." />
            </div>
            <Row label="Responsable" value="Dra. Valentina Ruiz" />
          </div>
          <button
            className="btn-primary mt-5"
            onClick={() => toast("success", "Cierre de caja registrado", "Acción demostrativa")}
          >
            Confirmar cierre
          </button>
        </div>
      )}

      <ManualMovementModal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        onSave={() => {
          toast("success", "Movimiento registrado", "El movimiento se agregó de forma demostrativa.");
          setManualOpen(false);
        }}
      />
    </div>
  );
}

function Row({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={`font-semibold ${danger ? "text-danger-600" : "text-ink-900"}`}>{value}</span>
    </div>
  );
}

function ManualMovementModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [type, setType] = useState<"ingreso" | "egreso">("ingreso");
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar movimiento manual"
      size="md"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button className="btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSave}>Guardar</button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2 flex gap-2">
          <button className={`btn flex-1 ${type === "ingreso" ? "btn-primary" : "btn-outline"}`} onClick={() => setType("ingreso")}>
            <ArrowUpRight className="h-4 w-4" /> Ingreso
          </button>
          <button className={`btn flex-1 ${type === "egreso" ? "btn-danger" : "btn-outline"}`} onClick={() => setType("egreso")}>
            <ArrowDownLeft className="h-4 w-4" /> Egreso
          </button>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Concepto</label>
          <input className="input" placeholder="Descripción del movimiento" />
        </div>
        <div>
          <label className="label">Categoría</label>
          <input className="input" placeholder="Ej. Ajuste" />
        </div>
        <div>
          <label className="label">Importe</label>
          <input type="number" className="input" placeholder="0" />
        </div>
        <div>
          <label className="label">Moneda</label>
          <select className="input">
            <option>ARS</option>
            <option>USD</option>
          </select>
        </div>
        <div>
          <label className="label">Medio</label>
          <select className="input">
            {Object.entries(paymentMethodLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Fecha</label>
          <input type="date" className="input" defaultValue="2026-06-11" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Comentario</label>
          <textarea className="input min-h-[60px]" />
        </div>
      </div>
    </Modal>
  );
}
