import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/store/AppContext";
import { useToast } from "@/store/ToastContext";
import { calcAge } from "@/utils/format";

const schema = z.object({
  firstName: z.string().min(2, "Ingresá el nombre"),
  lastName: z.string().min(2, "Ingresá el apellido"),
  dni: z
    .string()
    .min(7, "DNI inválido")
    .regex(/^[\d.]+$/, "Solo números y puntos"),
  birthDate: z.string().min(1, "Ingresá la fecha de nacimiento"),
  phone: z.string().min(6, "Teléfono inválido"),
  email: z.string().email("Email inválido").or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PatientFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addPatient } = useApp();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const birthDate = watch("birthDate");
  const age = birthDate ? calcAge(birthDate) : null;

  const submit = (values: FormValues) => {
    addPatient({
      firstName: values.firstName,
      lastName: values.lastName,
      dni: values.dni,
      birthDate: values.birthDate,
      phone: values.phone,
      email: values.email,
      address: values.address ?? "",
      city: values.city ?? "",
      notes: values.notes,
    });
    toast("success", "Nuevo paciente registrado correctamente", `${values.firstName} ${values.lastName}`);
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo paciente"
      subtitle="Completá los datos del paciente"
      size="lg"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSubmit(submit)}>
            <UserPlus className="h-4 w-4" /> Registrar paciente
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={errors.firstName?.message}>
          <input className="input" {...register("firstName")} placeholder="Ej. Sofía" />
        </Field>
        <Field label="Apellido" error={errors.lastName?.message}>
          <input className="input" {...register("lastName")} placeholder="Ej. Benítez" />
        </Field>
        <Field label="DNI" error={errors.dni?.message}>
          <input className="input" {...register("dni")} placeholder="38.214.905" />
        </Field>
        <Field label="Fecha de nacimiento" error={errors.birthDate?.message}>
          <input type="date" className="input" {...register("birthDate")} />
        </Field>
        <Field label="Edad calculada">
          <div className="input flex items-center text-ink-500">
            {age !== null ? `${age} años` : "—"}
          </div>
        </Field>
        <Field label="Teléfono" error={errors.phone?.message}>
          <input className="input" {...register("phone")} placeholder="+54 11 5555-5555" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="input" {...register("email")} placeholder="paciente@mail.demo" />
        </Field>
        <Field label="Localidad">
          <input className="input" {...register("city")} placeholder="Palermo" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Dirección">
            <input className="input" {...register("address")} placeholder="Av. Santa Fe 1234" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Observaciones">
            <textarea
              className="input min-h-[70px] resize-none"
              {...register("notes")}
              placeholder="Notas internas (opcional)"
            />
          </Field>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-danger-600">{error}</p>}
    </div>
  );
}
