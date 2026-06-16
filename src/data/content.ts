import type {
  ActivityItem,
  Branch,
  DashboardData,
  Doctor,
  ExpenseCategory,
  Supplier,
  Treatment,
  TreatmentCategory,
} from "@/types";
import { ACTIVE_TENANT } from "@/auth/tenants";
import { clinoraContent } from "./content.clinora";
import { libreriaContent } from "./content.libreria";

export interface InventorySeed {
  id: string;
  name: string;
  category: string;
  code: string;
  mainSupplierId: string;
  stock: number;
  minStock: number;
  unit: string;
  lastPrice: number;
}

export interface PnLRaw {
  month: string;
  sales: number;
  cogs: number;
  medicalFees: number;
  salaries: number;
  admin: number;
  marketing: number;
  commercialization: number;
  taxes: number;
  services: number;
  rent: number;
  interest: number;
  depreciation: number;
  amortization: number;
}

export interface PatientVocab {
  firstNames: string[];
  lastNames: string[];
  cities: string[];
  streets: string[];
  note: string;
  doctorIds: string[];
}

export interface DashboardSeed {
  kpis: DashboardData["kpis"];
  deltas: DashboardData["deltas"];
  activity: ActivityItem[];
}

export interface TenantContent {
  branches: Branch[];
  doctors: Doctor[];
  categories: TreatmentCategory[];
  treatments: Treatment[];
  patient: PatientVocab;
  inventorySeeds: InventorySeed[];
  inventorySupplierPool: string[];
  suppliers: Supplier[];
  expenseConcepts: Record<ExpenseCategory, string[]>;
  expenseAmounts: Record<ExpenseCategory, [number, number]>;
  cashUsers: string[];
  inventoryUsers: string[];
  pnlRaw: PnLRaw[];
  dashboard: DashboardSeed;
}

export const content: TenantContent =
  ACTIVE_TENANT === "libreria" ? libreriaContent : clinoraContent;
