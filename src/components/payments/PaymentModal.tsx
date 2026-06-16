import { useMemo, useState } from "react";
import { Plus, Trash2, Check, Package, Receipt } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Badge } from "@/components/common/StatusBadge";
import { useApp } from "@/store/AppContext";
import { useToast } from "@/store/ToastContext";
import { getPatient } from "@/data/mockPatients";
import { getTreatment } from "@/data/mockTreatments";
import { getDoctor } from "@/data/mockDoctors";
import { getInventoryItem } from "@/data/mockInventory";
import { paymentMethodLabels } from "@/utils/labels";
import { terms } from "@/auth/tenants";
import { formatCurrency, formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";
import type { Appointment, PaymentMethodType, Currency } from "@/types";

interface SplitDraft {
  id: number;
  method: PaymentMethodType;
  amount: number;
  currency: Currency;
  reference: string;
}

const methodOptions: PaymentMethodType[] = [
  "transferencia_clinica",
  "transferencia_profesional",
  "tarjeta",
  "efectivo_ars",
  "efectivo_usd",
];

export function PaymentModal({
  appointment,
  onClose,
}: {
  appointment: Appointment | null;
  onClose: () => void;
}) {
  const { registerPayment, fxRate } = useApp();
  const toast = useToast();
  const [seq, setSeq] = useState(2);
  const [splits, setSplits] = useState<SplitDraft[]>([]);
  const [hasDebt, setHasDebt] = useState(false);
  const [debtAmount, setDebtAmount] = useState(0);
  const [consumesShown, setConsumesShown] = useState(true);
  const [done, setDone] = useState(false);

  const open = !!appointment;
  const treatment = appointment ? getTreatment(appointment.treatmentId) : undefined;
  const patient = appointment ? getPatient(appointment.patientId) : undefined;

  // initialize splits when opening
  const total = appointment?.price ?? 0;

  // run init once per appointment id
  const [lastId, setLastId] = useState<string | null>(null);
  if (appointment && appointment.id !== lastId) {
    setLastId(appointment.id);
    setSplits([{ id: 1, method: "transferencia_clinica", amount: total, currency: "ARS", reference: "" }]);
    setHasDebt(false);
    setDebtAmount(0);
    setConsumesShown(true);
    setDone(false);
  }

  const paidArs = useMemo(
    () =>
      splits.reduce(
        (s, x) => s + (x.currency === "USD" ? Math.round(x.amount * fxRate) : x.amount),
        0,
      ),
    [splits, fxRate],
  );

  const remaining = total - paidArs - (hasDebt ? debtAmount : 0);
  const change = paidArs > total ? paidArs - total : 0;

  const addSplit = () => {
    setSplits((prev) => [
      ...prev,
      { id: seq, method: "efectivo_ars", amount: 0, currency: "ARS", reference: "" },
    ]);
    setSeq((s) => s + 1);
  };

  const confirm = () => {
    if (!appointment) return;
    const main = splits.reduce(
      (best, s) => {
        const ars = s.currency === "USD" ? s.amount * fxRate : s.amount;
        return ars > best.ars ? { method: s.method, ars } : best;
      },
      { method: splits[0]?.method ?? "efectivo_ars", ars: 0 },
    );
    registerPayment(appointment.id, main.method);
    setDone(true);
    toast("success", "Pago registrado correctamente", `${patient?.fullName} · ${formatCurrency(total)}`);
  };

  if (!appointment || !treatment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={done ? "Comprobante de pago" : "Registrar cobro"}
      subtitle={done ? undefined : `${patient?.fullName} · ${treatment.name}`}
      size="lg"
      footer={
        done ? (
          <button className="btn-primary" onClick={onClose}>
            <Check className="h-4 w-4" /> Listo
          </button>
        ) : (
          <div className="flex w-full items-center justify-between">
            <button className="btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn-primary"
              onClick={confirm}
              disabled={splits.length === 0}
            >
              <Check className="h-4 w-4" /> Confirmar pago
            </button>
          </div>
        )
      }
    >
      {done ? (
        <ReceiptView
          appointment={appointment}
          total={total}
          splits={splits}
          fxRate={fxRate}
          debt={hasDebt ? debtAmount : 0}
        />
      ) : (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid gap-3 rounded-xl bg-surface-muted p-4 sm:grid-cols-3">
            <Info label="Total a cobrar" value={formatCurrency(total)} strong />
            <Info label={`${terms.professional} principal`} value={getDoctor(appointment.primaryDoctorId)?.fullName ?? "—"} />
            <Info
              label={`${terms.professional} secundario`}
              value={appointment.secondaryDoctorId ? getDoctor(appointment.secondaryDoctorId)?.fullName ?? "—" : "—"}
            />
            <Info label="Duración" value={`${appointment.realDurationMin ?? treatment.durationMin} min`} />
            <Info label="Comisión estimada" value={formatCurrency(appointment.commission)} />
            <Info label="Equivalente USD" value={`USD ${formatNumber(Math.round(total / fxRate))}`} />
          </div>

          {/* Splits */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Medios de pago</label>
              <button className="btn-secondary px-2.5 py-1 text-xs" onClick={addSplit}>
                <Plus className="h-3.5 w-3.5" /> Agregar otro medio de pago
              </button>
            </div>
            <div className="space-y-2">
              {splits.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-12 items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-2.5"
                >
                  <select
                    className="input col-span-5 py-1.5"
                    value={s.method}
                    onChange={(e) =>
                      setSplits((prev) =>
                        prev.map((x) =>
                          x.id === s.id
                            ? {
                                ...x,
                                method: e.target.value as PaymentMethodType,
                                currency: e.target.value === "efectivo_usd" ? "USD" : "ARS",
                              }
                            : x,
                        ),
                      )
                    }
                  >
                    {methodOptions.map((m) => (
                      <option key={m} value={m}>
                        {paymentMethodLabels[m]}
                      </option>
                    ))}
                  </select>
                  <div className="col-span-4 flex items-center">
                    <span className="rounded-l-lg border border-r-0 border-ink-900/10 bg-surface-subtle px-2 py-1.5 text-xs font-semibold text-ink-500">
                      {s.currency}
                    </span>
                    <input
                      type="number"
                      className="input rounded-l-none py-1.5"
                      value={s.amount}
                      onChange={(e) =>
                        setSplits((prev) =>
                          prev.map((x) =>
                            x.id === s.id ? { ...x, amount: Number(e.target.value) } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <input
                    className="input col-span-2 py-1.5 text-xs"
                    placeholder="Ref."
                    value={s.reference}
                    onChange={(e) =>
                      setSplits((prev) =>
                        prev.map((x) =>
                          x.id === s.id ? { ...x, reference: e.target.value } : x,
                        ),
                      )
                    }
                  />
                  <button
                    className="col-span-1 flex justify-center text-ink-400 hover:text-danger-500"
                    onClick={() => setSplits((prev) => prev.filter((x) => x.id !== s.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-brand-50/60 p-3 text-sm sm:grid-cols-4">
            <Totals label="Pagado (ARS)" value={formatCurrency(paidArs)} />
            <Totals
              label="Saldo restante"
              value={formatCurrency(Math.max(0, remaining))}
              tone={remaining > 0 ? "danger" : "positive"}
            />
            <Totals label="Vuelto" value={formatCurrency(change)} tone={change > 0 ? "warning" : "neutral"} />
            <Totals label="Equivalente USD" value={`USD ${formatNumber(Math.round(paidArs / fxRate))}`} />
          </div>

          {/* Debt */}
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-brand-600"
              checked={hasDebt}
              onChange={(e) => setHasDebt(e.target.checked)}
            />
            El {terms.patient.toLowerCase()} quedó debiendo
          </label>
          {hasDebt && (
            <div className="grid grid-cols-1 gap-3 rounded-xl bg-danger-50/60 p-3 sm:grid-cols-3">
              <div>
                <label className="label">Importe pendiente</label>
                <input
                  type="number"
                  className="input"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label">Fecha estimada de pago</label>
                <input type="date" className="input" defaultValue="2026-06-25" />
              </div>
              <div>
                <label className="label">Comentario</label>
                <input className="input" placeholder="Opcional" />
              </div>
            </div>
          )}

          {/* Consumes */}
          {treatment.consumes.length > 0 && (
            <div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-brand-600"
                  checked={consumesShown}
                  onChange={(e) => setConsumesShown(e.target.checked)}
                />
                El {terms.treatment.toLowerCase()} consume insumos
              </label>
              {consumesShown && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {treatment.consumes.map((c) => {
                    const item = getInventoryItem(c.itemId);
                    return (
                      <Badge key={c.itemId} tone="neutral">
                        <Package className="h-3 w-3" />
                        {item?.name}: -{c.quantity} {item?.unit}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function Info({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-ink-400">{label}</p>
      <p className={cn("text-sm", strong ? "text-lg font-extrabold text-brand-700" : "font-semibold text-ink-900")}>
        {value}
      </p>
    </div>
  );
}

function Totals({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "danger" | "positive" | "warning";
}) {
  const colors = {
    neutral: "text-ink-900",
    danger: "text-danger-600",
    positive: "text-positive-600",
    warning: "text-warning-600",
  };
  return (
    <div>
      <p className="text-[11px] font-medium text-ink-400">{label}</p>
      <p className={cn("font-bold", colors[tone])}>{value}</p>
    </div>
  );
}

function ReceiptView({
  appointment,
  total,
  splits,
  fxRate,
  debt,
}: {
  appointment: Appointment;
  total: number;
  splits: SplitDraft[];
  fxRate: number;
  debt: number;
}) {
  const treatment = getTreatment(appointment.treatmentId);
  const patient = getPatient(appointment.patientId);
  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-positive-500 text-white">
          <Check className="h-6 w-6" />
        </span>
        <p className="text-lg font-bold text-ink-900">Pago registrado</p>
        <p className="text-xs text-ink-400">Comprobante demostrativo · no fiscal</p>
      </div>
      <div className="rounded-xl border border-dashed border-ink-900/15 p-4">
        <div className="flex items-center gap-2 border-b border-ink-900/10 pb-3">
          <Receipt className="h-5 w-5 text-brand-600" />
          <div>
            <p className="text-sm font-bold text-ink-900">CLINORA</p>
            <p className="text-[10px] text-ink-400">Comprobante interno</p>
          </div>
        </div>
        <div className="space-y-1.5 py-3 text-sm">
          <Row label={terms.patient} value={patient?.fullName ?? "—"} />
          <Row label={terms.treatment} value={treatment.name} />
          <Row label="Fecha" value="11/06/2026" />
        </div>
        <div className="space-y-1.5 border-t border-ink-900/10 py-3 text-sm">
          {splits.map((s) => (
            <Row
              key={s.id}
              label={paymentMethodLabels[s.method]}
              value={
                s.currency === "USD"
                  ? `USD ${formatNumber(s.amount)}`
                  : formatCurrency(s.amount)
              }
            />
          ))}
          {debt > 0 && <Row label="Saldo pendiente" value={formatCurrency(debt)} />}
        </div>
        <div className="flex items-center justify-between border-t border-ink-900/10 pt-3">
          <span className="font-semibold text-ink-700">Total</span>
          <span className="text-lg font-extrabold text-brand-700">
            {formatCurrency(total)}
          </span>
        </div>
        <p className="mt-1 text-right text-[11px] text-ink-400">
          ≈ USD {formatNumber(Math.round(total / fxRate))}
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-400">{label}</span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  );
}
