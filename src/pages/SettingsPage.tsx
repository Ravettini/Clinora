import { useState } from "react";
import { Building2, Users, Sparkles, Percent, DollarSign, Bell, Save } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useApp } from "@/store/AppContext";
import { useToast } from "@/store/ToastContext";
import { branches } from "@/data/mockBranches";
import { doctors } from "@/data/mockDoctors";
import { treatments } from "@/data/mockTreatments";
import { categories } from "@/data/mockCategories";
import { commissionRules } from "@/data/mockCommissions";
import { paymentMethodLabels } from "@/utils/labels";
import { terms, tenant } from "@/auth/tenants";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

const isLibreria = tenant.id === "libreria";
const businessLabel = isLibreria ? "Datos del negocio" : "Datos de la clínica";
const businessSubtitle = isLibreria
  ? "Parámetros generales del negocio"
  : "Parámetros generales de la clínica";

const sections = [
  { id: "clinica", label: businessLabel, icon: Building2 },
  { id: "sucursales", label: "Sucursales", icon: Building2 },
  { id: "profesionales", label: terms.professionals, icon: Users },
  { id: "tratamientos", label: terms.treatments, icon: Sparkles },
  { id: "comisiones", label: "Comisiones", icon: Percent },
  { id: "cambio", label: "Tipo de cambio", icon: DollarSign },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
];

export function SettingsPage() {
  const { fxRate, setFxRate } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState("clinica");
  const [fxInput, setFxInput] = useState(String(fxRate));
  const [fxMode, setFxMode] = useState<"manual" | "auto">("manual");

  const save = () => {
    if (tab === "cambio") setFxRate(Number(fxInput) || 1230);
    toast("success", "Configuración guardada", "Los cambios se aplicaron en memoria.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Configuración"
        subtitle={businessSubtitle}
        actions={
          <button className="btn-primary" onClick={save}>
            <Save className="h-4 w-4" /> Guardar cambios
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-4">
        <div className="card p-2 lg:col-span-1">
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setTab(s.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                  tab === s.id
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-500 hover:bg-surface-subtle",
                )}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="card p-5 lg:col-span-3">
          {tab === "clinica" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre comercial" defaultValue={tenant.brand.name} />
              <Field label="Razón social (ficticia)" defaultValue={isLibreria ? "Papelera Central SRL" : "Clinora Estética SRL"} />
              <Field label="CUIT (ficticio)" defaultValue={isLibreria ? "30-71987654-3" : "30-71234567-8"} />
              <Field label="Email" defaultValue={isLibreria ? "contacto@papelera.demo" : "contacto@clinora.demo"} />
              <Field label="Teléfono" defaultValue={isLibreria ? "+54 11 4300-0100" : "+54 11 4555-0100"} />
              <Field label="Sitio web" defaultValue={isLibreria ? "www.papelera.demo" : "www.clinora.demo"} />
            </div>
          )}

          {tab === "sucursales" && (
            <div className="space-y-3">
              {branches.map((b) => (
                <div key={b.id} className="rounded-xl border border-ink-900/10 p-4">
                  <p className="font-semibold text-ink-900">{b.name}</p>
                  <p className="text-sm text-ink-500">{b.address}</p>
                  <p className="mt-1 text-xs text-ink-400">Responsable: {b.manager}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "profesionales" && (
            <div className="divide-y divide-ink-900/5">
              {doctors.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: d.color }}
                    >
                      {d.firstName[0]}{d.lastName[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{d.fullName}</p>
                      <p className="text-xs text-ink-400">{d.specialty} · {d.role}</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked={d.active} className="accent-brand-600" />
                    Activo
                  </label>
                </div>
              ))}
            </div>
          )}

          {tab === "tratamientos" && (
            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-ink-400">
                    <th className="pb-2">{terms.treatment}</th>
                    <th className="pb-2">Categoría</th>
                    <th className="pb-2 text-right">Precio</th>
                    <th className="pb-2 text-right">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((t) => (
                    <tr key={t.id} className="border-t border-ink-900/5">
                      <td className="py-2 font-medium text-ink-900">{t.name}</td>
                      <td className="py-2 text-ink-500">{categories.find((c) => c.id === t.categoryId)?.name}</td>
                      <td className="py-2 text-right">{formatCurrency(t.price)}</td>
                      <td className="py-2 text-right text-ink-400">{t.durationMin} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "comisiones" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-ink-400">
                    <th className="pb-2">{terms.professional}</th>
                    <th className="pb-2">{terms.treatment}</th>
                    <th className="pb-2">Tipo</th>
                    <th className="pb-2 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {commissionRules.slice(0, 20).map((r) => (
                    <tr key={r.id} className="border-t border-ink-900/5">
                      <td className="py-2">{doctors.find((d) => d.id === r.doctorId)?.fullName}</td>
                      <td className="py-2 text-ink-500">{treatments.find((t) => t.id === r.treatmentId)?.name}</td>
                      <td className="py-2 capitalize">{r.type}</td>
                      <td className="py-2 text-right font-medium">
                        {r.type === "fijo" ? formatCurrency(r.fixedAmount ?? 0) : `${r.pct}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "cambio" && (
            <div className="max-w-md space-y-4">
              <div>
                <label className="label">Valor actual (demo)</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-500">1 USD =</span>
                  <input
                    className="input"
                    value={fxInput}
                    onChange={(e) => setFxInput(e.target.value)}
                    disabled={fxMode === "auto"}
                  />
                  <span className="text-sm text-ink-500">ARS</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className={cn("btn flex-1", fxMode === "manual" ? "btn-primary" : "btn-outline")}
                  onClick={() => setFxMode("manual")}
                >
                  Modo manual
                </button>
                <button
                  className={cn("btn flex-1", fxMode === "auto" ? "btn-primary" : "btn-outline")}
                  onClick={() => setFxMode("auto")}
                  disabled
                >
                  Modo automático
                </button>
              </div>
              <p className="rounded-xl bg-surface-muted p-3 text-xs text-ink-500">
                En la versión productiva, este valor podrá actualizarse mediante una fuente externa.
              </p>
              <p className="text-xs text-ink-400">Última actualización: 11/06/2026 09:00</p>
            </div>
          )}

          {tab === "notificaciones" && (
            <div className="space-y-4">
              {[
                "Alertas de stock crítico",
                `Pagos pendientes de ${terms.patients.toLowerCase()}`,
                "Liquidaciones quincenales",
                "Resumen diario de caja",
                `Nuevos ${terms.patients.toLowerCase()} registrados`,
              ].map((n) => (
                <label key={n} className="flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3">
                  <span className="text-sm font-medium text-ink-700">{n}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-600" />
                </label>
              ))}
            </div>
          )}

        </div>
      </div>

      <div className="card p-4">
        <p className="text-sm font-semibold text-ink-700">Medios de pago habilitados</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(paymentMethodLabels).map(([k, v]) => (
            <span key={k} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" defaultValue={defaultValue} />
    </div>
  );
}
