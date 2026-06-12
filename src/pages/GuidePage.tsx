import {
  Activity,
  BarChart3,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  FileText,
  HandCoins,
  HelpCircle,
  Receipt,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/common/StatusBadge";

const modules = [
  {
    icon: BarChart3,
    title: "Inicio / Dashboard",
    text: "Resume la salud de la operación: facturación, pacientes atendidos, tratamientos, egresos, comisiones pendientes y EBITDA estimado.",
  },
  {
    icon: CalendarDays,
    title: "Agenda operativa",
    text: "Es el panel diario de recepción. Muestra quién llega, qué tratamiento realiza, con qué profesional y en qué estado está la atención.",
  },
  {
    icon: Users,
    title: "Pacientes",
    text: "Centraliza datos personales, historial de tratamientos, pagos, documentación visual y observaciones internas.",
  },
  {
    icon: Sparkles,
    title: "Tratamientos",
    text: "Lista las prestaciones realizadas o programadas, con categoría, profesionales, duración, monto, comisión y medio de pago.",
  },
  {
    icon: Wallet,
    title: "Caja",
    text: "Muestra ingresos, egresos, saldos por moneda, cobros pendientes y cierre de caja demostrativo.",
  },
  {
    icon: HandCoins,
    title: "Liquidaciones",
    text: "Explica cuánto corresponde pagar a profesionales y cómo se distribuyen aportes hacia clínica, tarjeta o caja común.",
  },
  {
    icon: Receipt,
    title: "Egresos",
    text: "Ordena gastos operativos: salarios, impuestos, marketing, alquiler, servicios, mercadería y honorarios.",
  },
  {
    icon: Boxes,
    title: "Inventario",
    text: "Controla stock, movimientos, compras, proveedores, alertas y evolución de precios de insumos.",
  },
];

const kpis = [
  {
    title: "Facturación total del mes",
    text: "Suma de todos los tratamientos, productos y ventas registrados en el período seleccionado.",
  },
  {
    title: "Facturación ARS / USD",
    text: "La facturación real de la demo está en pesos; el valor en dólares es una conversión usando el tipo de cambio demo.",
  },
  {
    title: "Cantidad de tratamientos",
    text: "Total de atenciones realizadas o finalizadas según los filtros aplicados.",
  },
  {
    title: "Ticket promedio",
    text: "Promedio de facturación por tratamiento. Sirve para entender el valor medio de cada atención.",
  },
  {
    title: "Pacientes atendidos",
    text: "Cantidad de pacientes únicos que tuvieron actividad en el período.",
  },
  {
    title: "Comisiones pendientes",
    text: "Importe estimado que todavía debe liquidarse a profesionales secundarios o principales.",
  },
  {
    title: "Egresos",
    text: "Gastos operativos y administrativos cargados en la demo.",
  },
  {
    title: "EBITDA estimado",
    text: "Resultado operativo aproximado antes de depreciaciones y amortizaciones. Ayuda a entender rentabilidad.",
  },
];

const statuses = [
  ["Turno confirmado", "El paciente tiene una atención agendada, pero todavía no llegó."],
  ["Paciente presente", "Recepción marcó que el paciente ya está en la clínica."],
  ["En tratamiento", "La atención fue iniciada y todavía no está lista para cobrar."],
  ["Pendiente de pago", "El tratamiento terminó y falta registrar el cobro."],
  ["Finalizado", "Tratamiento y pago quedaron cerrados."],
  ["Cancelado", "El turno fue dado de baja de forma demostrativa."],
];

const charts = [
  {
    title: "Evolución mensual de facturación",
    text: "Permite ver si la clínica crece, se mantiene o cae en ventas durante los últimos meses.",
  },
  {
    title: "Facturación por categoría",
    text: "Muestra qué líneas de negocio pesan más: Botox, rellenos, cosmetología, clínica, productos, gift cards, láser, etc.",
  },
  {
    title: "Medios de pago",
    text: "Ayuda a diferenciar dinero que entró por transferencia, tarjeta, efectivo ARS o efectivo USD.",
  },
  {
    title: "Facturación por profesional",
    text: "Compara cuánto genera cada profesional principal y cuánto aportan profesionales secundarios.",
  },
  {
    title: "Distribución de gastos",
    text: "Identifica cuáles son las categorías de egresos más relevantes para la rentabilidad.",
  },
  {
    title: "EBITDA y P&L",
    text: "Resume ventas, costos, gastos y resultado operativo mes a mes.",
  },
];

const flows = [
  {
    title: "Nuevo ingreso",
    text: "Busca o registra un paciente, selecciona tratamiento, asigna profesionales y crea una atención en curso.",
  },
  {
    title: "Finalizar tratamiento",
    text: "Cambia el estado a pendiente de pago, calcula una duración real simulada y habilita el cobro.",
  },
  {
    title: "Registrar cobro",
    text: "Permite dividir el pago en varios medios, convertir USD a ARS, dejar deuda y mostrar consumo de insumos.",
  },
  {
    title: "Liquidar comisiones",
    text: "Agrupa tratamientos por quincena y profesional para simular el monto a pagar.",
  },
  {
    title: "Registrar egreso",
    text: "Carga un gasto operativo y simula la lectura de una factura sin hacer OCR real.",
  },
  {
    title: "Controlar stock",
    text: "Muestra productos por debajo del mínimo y movimientos de entrada o salida de inventario.",
  },
];

export function GuidePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Guía de demo"
        subtitle="Qué significa cada sección, métrica, gráfico y estado de CLINORA"
      />

      <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-accent-lavender/40 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <HelpCircle className="h-5 w-5" />
              </span>
              <p className="text-lg font-bold text-ink-900">Cómo leer esta plataforma</p>
            </div>
            <p className="text-sm leading-relaxed text-ink-600">
              Esta demo usa datos ficticios para mostrar cómo funcionaría un SaaS de gestión
              integral para clínicas estéticas. No hay backend ni integraciones reales: todo lo
              que ves es una simulación navegable para entender el producto final.
            </p>
          </div>
          <div className="grid min-w-[220px] gap-2 text-sm">
            <Badge tone="brand">Datos mock</Badge>
            <Badge tone="positive">Flujos funcionales en memoria</Badge>
            <Badge tone="warning">Sin servicios externos reales</Badge>
          </div>
        </div>
      </div>

      <Section title="Qué muestra cada módulo" icon={ClipboardList}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((item) => (
            <InfoCard key={item.title} {...item} />
          ))}
        </div>
      </Section>

      <Section title="Qué significa cada KPI principal" icon={CircleDollarSign}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <TextCard key={item.title} title={item.title} text={item.text} />
          ))}
        </div>
      </Section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Estados de una atención" icon={Activity}>
          <div className="space-y-2">
            {statuses.map(([title, text]) => (
              <div
                key={title}
                className="rounded-xl border border-ink-900/5 bg-white px-4 py-3"
              >
                <p className="text-sm font-semibold text-ink-900">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Qué muestra cada gráfico" icon={BarChart3}>
          <div className="space-y-2">
            {charts.map((item) => (
              <TextCard key={item.title} title={item.title} text={item.text} compact />
            ))}
          </div>
        </Section>
      </div>

      <Section title="Flujos demostrativos principales" icon={FileText}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {flows.map((item, index) => (
            <div key={item.title} className="card p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700">
                {index + 1}
              </div>
              <p className="text-sm font-semibold text-ink-900">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="card p-5">
        <h3 className="text-base font-bold text-ink-900">Lectura financiera rápida</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <TextCard
            title="Caja no es lo mismo que facturación"
            text="La facturación mide ventas registradas. Caja muestra cómo entró o salió el dinero según el medio de pago."
            compact
          />
          <TextCard
            title="Comisión no es ganancia"
            text="La comisión es un costo asociado a profesionales. Se resta al analizar rentabilidad o liquidaciones."
            compact
          />
          <TextCard
            title="Inventario impacta costos"
            text="Cuando un tratamiento consume insumos, la demo muestra una salida automática de stock para representar el costo operativo."
            compact
          />
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof HelpCircle;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-subtle text-brand-600">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-bold text-ink-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof HelpCircle;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-4">
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
    </div>
  );
}

function TextCard({
  title,
  text,
  compact,
}: {
  title: string;
  text: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "rounded-xl bg-surface-muted p-4" : "card p-4"}>
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
    </div>
  );
}
