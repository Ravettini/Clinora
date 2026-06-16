import type { AppointmentStatus, ExpenseCategory, PaymentMethodType } from "@/types";

export type TenantId = "clinora" | "libreria";

export interface DemoUser {
  username: string;
  password: string;
  tenant: TenantId;
}

/** Vocabulario de dominio (singular/plural) que se usa en toda la UI. */
export interface TenantTerms {
  patient: string;
  patients: string;
  treatment: string;
  treatments: string;
  /** Sustantivo para el conteo de operaciones (KPI "Tratamientos" → "Ventas"). */
  sale: string;
  sales: string;
  professional: string;
  professionals: string;
  appointment: string;
  appointments: string;
  medicalFees: string;
}

export interface TenantConfig {
  id: TenantId;
  /** Marca que se muestra en el sidebar / login */
  brand: { name: string; tagline: string };
  /** Usuario "logueado" que se muestra en el header */
  user: { name: string; role: string; initials: string };
  searchPlaceholder: string;
  /** Override de etiquetas del menú por ruta */
  nav: Partial<Record<string, string>>;
  /** Override de títulos de página por clave */
  pageTitles: Partial<Record<string, string>>;
  /** Vocabulario de dominio aplicado en toda la app */
  terms: TenantTerms;
  notifications: Array<{ id: number; title: string; detail: string; tone: string }>;
  expenseCategoryLabels?: Partial<Record<ExpenseCategory, string>>;
  paymentMethodLabels?: Partial<Record<PaymentMethodType, string>>;
  appointmentStatusLabels?: Partial<Record<AppointmentStatus, string>>;
}

export const TENANTS: Record<TenantId, TenantConfig> = {
  clinora: {
    id: "clinora",
    brand: { name: "CLINORA", tagline: "Gestión inteligente" },
    user: { name: "Dra. Valentina Ruiz", role: "Administradora", initials: "VR" },
    searchPlaceholder: "Buscar paciente, DNI…",
    nav: {},
    pageTitles: {
      agenda: "Agenda operativa",
      patients: "Pacientes",
      treatments: "Tratamientos",
    },
    terms: {
      patient: "Paciente",
      patients: "Pacientes",
      treatment: "Tratamiento",
      treatments: "Tratamientos",
      sale: "Tratamiento",
      sales: "Tratamientos",
      professional: "Profesional",
      professionals: "Profesionales",
      appointment: "Turno",
      appointments: "Turnos",
      medicalFees: "Honorarios médicos",
    },
    notifications: [
      { id: 1, title: "Stock crítico", detail: "Toxina botulínica 100 U bajo el mínimo", tone: "danger" },
      { id: 2, title: "Pago pendiente", detail: "Lucía Fernández — Surcos nasogenianos", tone: "warning" },
      { id: 3, title: "Liquidación lista", detail: "1ª quincena de Junio generada", tone: "info" },
    ],
  },
  libreria: {
    id: "libreria",
    brand: { name: "PAPELERA CENTRAL", tagline: "Librería & insumos mayoristas" },
    user: { name: "Martín Sosa", role: "Encargado", initials: "MS" },
    searchPlaceholder: "Buscar cliente, CUIT…",
    nav: {
      "/agenda": "Ventas del día",
      "/pacientes": "Clientes",
      "/tratamientos": "Productos",
      "/liquidaciones": "Comisiones",
    },
    pageTitles: {
      agenda: "Ventas del día",
      patients: "Clientes",
      treatments: "Productos",
    },
    terms: {
      patient: "Cliente",
      patients: "Clientes",
      treatment: "Producto",
      treatments: "Productos",
      sale: "Venta",
      sales: "Ventas",
      professional: "Vendedor",
      professionals: "Vendedores",
      appointment: "Venta",
      appointments: "Ventas",
      medicalFees: "Comisiones a vendedores",
    },
    notifications: [
      { id: 1, title: "Stock crítico", detail: "Resma A4 75g bajo el mínimo", tone: "danger" },
      { id: 2, title: "Pago pendiente", detail: "Colegio San Martín — Pedido mayorista", tone: "warning" },
      { id: 3, title: "Comisión lista", detail: "Comisiones de vendedores · 1ª quincena Junio", tone: "info" },
    ],
    expenseCategoryLabels: {
      honorarios_medicos: "Comisiones a vendedores",
      mercaderia: "Compra de mercadería",
    },
    paymentMethodLabels: {
      transferencia_profesional: "Transferencia a vendedor",
      transferencia_clinica: "Transferencia a la empresa",
    },
    appointmentStatusLabels: {
      confirmado: "Venta confirmada",
      presente: "Cliente en mostrador",
      en_tratamiento: "En preparación",
    },
  },
};

export const DEMO_USERS: DemoUser[] = [
  { username: "clinora", password: "clinora2026", tenant: "clinora" },
  { username: "libreria", password: "libreria2026", tenant: "libreria" },
];

const SESSION_KEY = "clinora.session";

export interface Session {
  username: string;
  tenant: TenantId;
}

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.tenant || !TENANTS[parsed.tenant]) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function authenticate(username: string, password: string): DemoUser | null {
  const u = username.trim().toLowerCase();
  return (
    DEMO_USERS.find((x) => x.username === u && x.password === password) ?? null
  );
}

/**
 * Tenant activo, resuelto UNA sola vez al cargar el módulo. Como el cambio de
 * usuario recarga la página, este valor siempre refleja la sesión vigente.
 */
export const ACTIVE_TENANT: TenantId = readSession()?.tenant ?? "clinora";

/** Configuración del tenant activo (marca, etiquetas, etc.) */
export const tenant: TenantConfig = TENANTS[ACTIVE_TENANT];

/** Vocabulario de dominio del tenant activo. */
export const terms: TenantTerms = tenant.terms;

/** Etiqueta de menú para una ruta, con fallback al label por defecto. */
export function navLabel(route: string, fallback: string): string {
  return tenant.nav[route] ?? fallback;
}

/** Título de página por clave, con fallback. */
export function pageTitle(key: string, fallback: string): string {
  return tenant.pageTitles[key] ?? fallback;
}
