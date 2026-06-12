import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Check,
  Clock,
  Sparkles,
  Stethoscope,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  CircleDollarSign,
} from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Badge } from "@/components/common/StatusBadge";
import { useApp } from "@/store/AppContext";
import { useUI } from "@/store/UIContext";
import { useToast } from "@/store/ToastContext";
import { categories, getCategory } from "@/data/mockCategories";
import { treatments } from "@/data/mockTreatments";
import { primaryDoctors, secondaryDoctors, getDoctor } from "@/data/mockDoctors";
import { findCommissionRule } from "@/data/mockCommissions";
import { findPatientByDni } from "@/data/mockPatients";
import { resolveCommission } from "@/utils/calculations";
import { calcAge, formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";
import type { Patient, TreatmentCategoryId } from "@/types";

const steps = [
  { id: 1, label: "Paciente", icon: Search },
  { id: 2, label: "Tratamiento", icon: Sparkles },
  { id: 3, label: "Profesionales", icon: Stethoscope },
  { id: 4, label: "Confirmación", icon: ClipboardCheck },
];

export function NewIncomeWizard() {
  const { newIncomeOpen, closeNewIncome, prefillPatientId } = useUI();
  const { addAppointment, addPatient, patients } = useApp();
  const toast = useToast();

  const [step, setStep] = useState(1);

  // Step 1 — patient
  const [dni, setDni] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showQuick, setShowQuick] = useState(false);
  const [quick, setQuick] = useState({ firstName: "", lastName: "", birthDate: "", phone: "" });

  // Step 2 — treatment
  const [categoryId, setCategoryId] = useState<TreatmentCategoryId>("botox");
  const [treatmentId, setTreatmentId] = useState("");
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  // Step 3 — doctors
  const [primaryId, setPrimaryId] = useState("");
  const [secondaryId, setSecondaryId] = useState<string>("");
  const [time, setTime] = useState("18:00");

  useEffect(() => {
    if (newIncomeOpen) {
      setStep(1);
      setDni("");
      setPatient(null);
      setShowQuick(false);
      setQuick({ firstName: "", lastName: "", birthDate: "", phone: "" });
      setCategoryId("botox");
      setTreatmentId("");
      setQty(1);
      setDiscount(0);
      setNotes("");
      setPrimaryId("");
      setSecondaryId("");
      setTime("18:00");
      if (prefillPatientId) {
        const p = patients.find((x) => x.id === prefillPatientId);
        if (p) {
          setPatient(p);
          setDni(p.dni);
        }
      }
    }
  }, [newIncomeOpen, prefillPatientId, patients]);

  const treatment = useMemo(
    () => treatments.find((t) => t.id === treatmentId),
    [treatmentId],
  );
  const categoryTreatments = treatments.filter((t) => t.categoryId === categoryId);

  const price = treatment ? treatment.price * qty : 0;
  const finalPrice = Math.round(price * (1 - discount / 100));

  const commission = useMemo(() => {
    if (!treatment || !secondaryId) return 0;
    const rule = findCommissionRule(secondaryId, treatment.id);
    return resolveCommission(treatment, rule).amount * qty;
  }, [treatment, secondaryId, qty]);

  const searchPatient = () => {
    const found = findPatientByDni(dni) ?? patients.find((p) => p.dni.replace(/\./g, "") === dni.replace(/\./g, ""));
    if (found) {
      setPatient(found);
      setShowQuick(false);
      toast("success", "Paciente encontrado", found.fullName);
    } else {
      setPatient(null);
      setShowQuick(true);
      toast("info", "Paciente no encontrado", "Podés registrarlo rápidamente.");
    }
  };

  const registerQuick = () => {
    if (!quick.firstName || !quick.lastName) {
      toast("error", "Faltan datos", "Completá nombre y apellido.");
      return;
    }
    const p = addPatient({
      firstName: quick.firstName,
      lastName: quick.lastName,
      dni: dni || "00.000.000",
      birthDate: quick.birthDate || "1990-01-01",
      phone: quick.phone,
      email: "",
      address: "",
      city: "",
    });
    setPatient(p);
    setShowQuick(false);
    toast("success", "Nuevo paciente registrado correctamente", p.fullName);
  };

  const canNext =
    (step === 1 && !!patient) ||
    (step === 2 && !!treatment) ||
    (step === 3 && !!primaryId) ||
    step === 4;

  const confirm = () => {
    if (!patient || !treatment || !primaryId) return;
    addAppointment({
      patientId: patient.id,
      treatmentId: treatment.id,
      primaryDoctorId: primaryId,
      secondaryDoctorId: secondaryId || undefined,
      price: finalPrice,
      estimatedDurationMin: treatment.durationMin,
      commission,
      time,
    });
    toast("success", "Tratamiento iniciado", `${patient.fullName} · ${treatment.name}`);
    closeNewIncome();
  };

  return (
    <Modal
      open={newIncomeOpen}
      onClose={closeNewIncome}
      title="Nuevo ingreso"
      subtitle="Registrá un paciente, tratamiento y profesionales"
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between">
          <button
            className="btn-ghost"
            onClick={() => (step === 1 ? closeNewIncome() : setStep((s) => s - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 1 ? "Cancelar" : "Atrás"}
          </button>
          {step < 4 ? (
            <button
              className="btn-primary"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
            >
              Continuar <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button className="btn-primary" onClick={confirm}>
              <Check className="h-4 w-4" /> Confirmar ingreso
            </button>
          )}
        </div>
      }
    >
      {/* Stepper */}
      <div className="mb-6 flex items-center justify-between">
        {steps.map((s, i) => {
          const active = s.id === step;
          const done = s.id < step;
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition",
                    done
                      ? "bg-positive-500 text-white"
                      : active
                        ? "bg-brand-600 text-white"
                        : "bg-surface-subtle text-ink-400",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    active ? "text-brand-700" : "text-ink-400",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 rounded-full",
                    done ? "bg-positive-400" : "bg-surface-subtle",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="label">DNI del paciente</label>
            <div className="flex gap-2">
              <input
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchPatient()}
                placeholder="Ej. 38.214.905"
                className="input"
              />
              <button className="btn-secondary shrink-0" onClick={searchPatient}>
                <Search className="h-4 w-4" /> Buscar
              </button>
            </div>
          </div>

          {patient && (
            <div className="rounded-xl border border-positive-100 bg-positive-50 p-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-positive-500 font-bold text-white">
                    {patient.firstName[0]}
                    {patient.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{patient.fullName}</p>
                    <p className="text-xs text-ink-500">
                      DNI {patient.dni} · {calcAge(patient.birthDate)} años
                    </p>
                  </div>
                </div>
                <Badge tone="positive">
                  <Check className="h-3 w-3" /> Encontrado
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink-500">
                <span>📞 {patient.phone}</span>
                <span>✉️ {patient.email || "—"}</span>
                <span>📍 {patient.address || "—"}</span>
                <span>🏥 {patient.city || "—"}</span>
              </div>
            </div>
          )}

          {showQuick && !patient && (
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 animate-fade-in">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-700">
                <UserPlus className="h-4 w-4" /> Registro rápido
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  className="input"
                  placeholder="Nombre"
                  value={quick.firstName}
                  onChange={(e) => setQuick({ ...quick, firstName: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Apellido"
                  value={quick.lastName}
                  onChange={(e) => setQuick({ ...quick, lastName: e.target.value })}
                />
                <input
                  type="date"
                  className="input"
                  value={quick.birthDate}
                  onChange={(e) => setQuick({ ...quick, birthDate: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Teléfono"
                  value={quick.phone}
                  onChange={(e) => setQuick({ ...quick, phone: e.target.value })}
                />
              </div>
              <button className="btn-primary mt-3" onClick={registerQuick}>
                <UserPlus className="h-4 w-4" /> Registrar paciente
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="label">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {categories
                .filter((c) => c.id !== "giftcards")
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategoryId(c.id);
                      setTreatmentId("");
                    }}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-sm font-semibold transition",
                      categoryId === c.id
                        ? "bg-brand-600 text-white"
                        : "bg-surface-subtle text-ink-500 hover:text-ink-900",
                    )}
                  >
                    {c.name}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <label className="label">Tratamiento</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {categoryTreatments.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTreatmentId(t.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 text-left transition",
                    treatmentId === t.id
                      ? "border-brand-400 bg-brand-50"
                      : "border-ink-900/10 bg-white hover:border-brand-200",
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                    <p className="flex items-center gap-1 text-xs text-ink-400">
                      <Clock className="h-3 w-3" /> {t.durationMin} min
                    </p>
                  </div>
                  <span className="text-sm font-bold text-brand-700">
                    {formatCurrency(t.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {treatment && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className="label">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  className="input"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <label className="label">Descuento %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="input"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="label">Precio final</label>
                <div className="input flex items-center font-bold text-brand-700">
                  {formatCurrency(finalPrice)}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <label className="label">Observaciones</label>
                <textarea
                  className="input min-h-[60px] resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas del tratamiento (opcional)"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="label">Profesional principal</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {primaryDoctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setPrimaryId(d.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                    primaryId === d.id
                      ? "border-brand-400 bg-brand-50"
                      : "border-ink-900/10 bg-white hover:border-brand-200",
                  )}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: d.color }}
                  >
                    {d.firstName[0]}
                    {d.lastName[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{d.fullName}</p>
                    <p className="text-xs text-ink-400">{d.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Profesional secundario</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => setSecondaryId("")}
                className={cn(
                  "rounded-xl border p-3 text-left text-sm font-semibold transition",
                  secondaryId === ""
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-ink-900/10 bg-white text-ink-500 hover:border-brand-200",
                )}
              >
                Sin profesional secundario
              </button>
              {secondaryDoctors
                .filter((d) => d.id !== primaryId)
                .map((d) => {
                  const rule = treatment ? findCommissionRule(d.id, treatment.id) : undefined;
                  const est = treatment
                    ? resolveCommission(treatment, rule)
                    : { type: "porcentaje" as const, value: 0, amount: 0 };
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSecondaryId(d.id)}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-xl border p-3 text-left transition",
                        secondaryId === d.id
                          ? "border-brand-400 bg-brand-50"
                          : "border-ink-900/10 bg-white hover:border-brand-200",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ background: d.color }}
                        >
                          {d.firstName[0]}
                          {d.lastName[0]}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{d.fullName}</p>
                          <p className="text-xs text-ink-400">
                            {est.type === "fijo"
                              ? "Monto fijo"
                              : `Comisión ${est.value}%`}
                          </p>
                        </div>
                      </div>
                      <Badge tone="brand">{formatCurrency(est.amount * qty)}</Badge>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Hora del turno</label>
              <input
                type="time"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            {secondaryId && (
              <div className="flex flex-col justify-end">
                <label className="label">Comisión estimada</label>
                <div className="input flex items-center font-bold text-brand-700">
                  {formatCurrency(commission)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && treatment && patient && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-lavender/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Resumen del ingreso
            </p>
            <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Summary label="Paciente" value={patient.fullName} />
              <Summary label="DNI" value={patient.dni} />
              <Summary label="Tratamiento" value={treatment.name} />
              <Summary label="Categoría" value={getCategory(treatment.categoryId).name} />
              <Summary label="Profesional principal" value={getDoctor(primaryId)?.fullName ?? "—"} />
              <Summary
                label="Profesional secundario"
                value={secondaryId ? getDoctor(secondaryId)?.fullName ?? "—" : "Sin secundario"}
              />
              <Summary label="Duración estimada" value={`${treatment.durationMin} min`} />
              <Summary label="Hora" value={time} />
              {secondaryId && (
                <Summary label="Comisión estimada" value={formatCurrency(commission)} />
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-brand-200/60 pt-4">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-700">
                <CircleDollarSign className="h-4 w-4 text-brand-600" /> Total
              </span>
              <span className="text-2xl font-extrabold text-brand-700">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          </div>
          <p className="text-center text-xs text-ink-400">
            Al confirmar, el tratamiento se agregará a la agenda con estado “En tratamiento”.
          </p>
        </div>
      )}
    </Modal>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-ink-400">{label}</p>
      <p className="text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}
