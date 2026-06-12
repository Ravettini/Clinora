export type Currency = "ARS" | "USD";

export type BranchId = "palermo" | "belgrano";

export interface Branch {
  id: BranchId;
  name: string;
  address: string;
  phone: string;
  manager: string;
}

export type DoctorRole = "principal" | "secundaria" | "ambas";

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  specialty: string;
  role: DoctorRole;
  email: string;
  phone: string;
  color: string;
  active: boolean;
  branchId: BranchId;
}

export type PatientStatus = "activo" | "inactivo" | "nuevo";

export interface Patient {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string; // ISO
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
  status: PatientStatus;
  createdAt: string;
  lastVisit?: string;
  usualDoctorId?: string;
  branchId: BranchId;
}

export type TreatmentCategoryId =
  | "botox"
  | "rellenos"
  | "cosmetologia"
  | "clinica"
  | "mesoterapia"
  | "productos"
  | "laser"
  | "giftcards";

export interface TreatmentCategory {
  id: TreatmentCategoryId;
  name: string;
  color: string;
}

export interface InsumoConsumption {
  itemId: string;
  quantity: number;
}

export interface Treatment {
  id: string;
  name: string;
  categoryId: TreatmentCategoryId;
  price: number; // ARS
  currency: Currency;
  durationMin: number;
  baseCommissionPct: number;
  consumes: InsumoConsumption[];
  active: boolean;
}

export type CommissionType = "porcentaje" | "fijo";

export interface CommissionRule {
  id: string;
  doctorId: string; // secondary doctor
  treatmentId: string;
  categoryId: TreatmentCategoryId;
  type: CommissionType;
  pct?: number;
  fixedAmount?: number;
  validFrom: string;
}

export type PaymentMethodType =
  | "transferencia_profesional"
  | "transferencia_clinica"
  | "tarjeta"
  | "efectivo_ars"
  | "efectivo_usd";

export interface PaymentSplit {
  method: PaymentMethodType;
  amount: number;
  currency: Currency;
  amountArs: number;
  account?: string;
  reference?: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  total: number;
  splits: PaymentSplit[];
  pendingAmount: number;
  change: number;
  paidAt: string;
  registeredBy: string;
}

export type AppointmentStatus =
  | "confirmado"
  | "presente"
  | "en_tratamiento"
  | "pendiente_pago"
  | "finalizado"
  | "cancelado"
  | "programado";

export interface Appointment {
  id: string;
  date: string; // ISO date
  time: string; // HH:mm
  patientId: string;
  treatmentId: string;
  primaryDoctorId: string;
  secondaryDoctorId?: string;
  status: AppointmentStatus;
  price: number;
  currency: Currency;
  estimatedDurationMin: number;
  realDurationMin?: number;
  startedAt?: string;
  finishedAt?: string;
  commission: number;
  paymentMethod?: PaymentMethodType;
  branchId: BranchId;
  notes?: string;
}

export type ExpenseCategory =
  | "salarios"
  | "honorarios_medicos"
  | "gastos_administrativos"
  | "impuestos"
  | "intereses"
  | "marketing"
  | "comercializacion"
  | "servicios"
  | "alquiler"
  | "mercaderia"
  | "mantenimiento"
  | "otros";

export type ExpenseStatus = "pagado" | "pendiente";

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  subcategory?: string;
  concept: string;
  supplier: string;
  amount: number;
  currency: Currency;
  fxRate: number;
  amountArs: number;
  paymentMethod: PaymentMethodType;
  hasReceipt: boolean;
  notes?: string;
  status: ExpenseStatus;
  branchId: BranchId;
}

export type InventoryStatus = "normal" | "bajo" | "sin_stock" | "sobrestock";

export interface PriceHistoryEntry {
  date: string;
  supplier: string;
  quantity: number;
  unitPrice: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  code: string;
  mainSupplierId: string;
  stock: number;
  minStock: number;
  unit: string;
  avgCost: number;
  lastPrice: number;
  priceHistory: PriceHistoryEntry[];
}

export type MovementType =
  | "ingreso_compra"
  | "salida_tratamiento"
  | "salida_venta"
  | "ajuste"
  | "vencimiento"
  | "devolucion";

export interface InventoryMovement {
  id: string;
  date: string;
  itemId: string;
  type: MovementType;
  quantity: number;
  reference?: string;
  user: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
}

export type CashMovementType = "ingreso" | "egreso";

export interface CashMovement {
  id: string;
  date: string;
  time: string;
  type: CashMovementType;
  concept: string;
  category: string;
  paymentMethod: PaymentMethodType;
  amount: number;
  currency: Currency;
  amountArs: number;
  user: string;
  status: "confirmado" | "pendiente";
  branchId: BranchId;
}

export type SettlementStatus = "pendiente" | "pagada" | "generada";
export type Quincena = "primera" | "segunda";

export interface SettlementLine {
  appointmentId: string;
  date: string;
  patientName: string;
  treatmentName: string;
  primaryDoctorName: string;
  treatmentPrice: number;
  commissionType: CommissionType;
  pct?: number;
  commission: number;
  comment?: string;
}

export interface Settlement {
  id: string;
  doctorId: string;
  doctorName: string;
  type: "secundario" | "principal";
  quincena: Quincena;
  month: number;
  year: number;
  lines: SettlementLine[];
  treatmentsCount: number;
  generatedRevenue: number;
  totalCommission: number;
  paid: number;
  pending: number;
  status: SettlementStatus;
  branchId: BranchId;
}

export interface MonthlyMetric {
  month: string; // "Ene"
  monthIndex: number;
  revenueArs: number;
  revenueUsd: number;
  treatments: number;
  expenses: number;
  ebitda: number;
}

export interface CategoryRevenue {
  categoryId: TreatmentCategoryId;
  name: string;
  value: number;
  color: string;
}

export interface PaymentMethodDistribution {
  method: PaymentMethodType;
  label: string;
  value: number;
}

export interface DoctorRevenue {
  doctorId: string;
  name: string;
  value: number;
}

export interface ExpenseDistribution {
  category: ExpenseCategory;
  label: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  type:
    | "cobro"
    | "tratamiento_inicio"
    | "tratamiento_fin"
    | "paciente_nuevo"
    | "liquidacion"
    | "stock";
  title: string;
  detail: string;
  time: string;
}

export interface PnLRow {
  month: string;
  sales: number;
  cogs: number;
  medicalFees: number;
  grossMargin: number;
  salaries: number;
  admin: number;
  marketing: number;
  commercialization: number;
  taxes: number;
  services: number;
  rent: number;
  interest: number;
  ebitda: number;
  depreciation: number;
  amortization: number;
  operatingResult: number;
}

export interface DashboardData {
  kpis: {
    revenueMonth: number;
    revenueArs: number;
    revenueUsd: number;
    treatments: number;
    avgTicket: number;
    patientsServed: number;
    avgAge: number;
    pendingCommissions: number;
    totalExpenses: number;
    ebitda: number;
  };
  deltas: {
    revenue: number;
    treatments: number;
    avgTicket: number;
    patients: number;
    avgAge: number;
    commissions: number;
    expenses: number;
    ebitda: number;
  };
  monthly: MonthlyMetric[];
  byCategory: CategoryRevenue[];
  paymentMethods: PaymentMethodDistribution[];
  byPrimaryDoctor: DoctorRevenue[];
  bySecondaryDoctor: { name: string; transferencia: number; tarjeta: number; efectivo: number }[];
  expenseDistribution: ExpenseDistribution[];
  activity: ActivityItem[];
}
