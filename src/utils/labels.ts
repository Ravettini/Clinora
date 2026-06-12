import type {
  AppointmentStatus,
  ExpenseCategory,
  PaymentMethodType,
  MovementType,
  InventoryStatus,
} from "@/types";

export const paymentMethodLabels: Record<PaymentMethodType, string> = {
  transferencia_profesional: "Transferencia a profesional",
  transferencia_clinica: "Transferencia a clínica",
  tarjeta: "Tarjeta",
  efectivo_ars: "Efectivo ARS",
  efectivo_usd: "Efectivo USD",
};

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  confirmado: "Turno confirmado",
  programado: "Programado",
  presente: "Paciente presente",
  en_tratamiento: "En tratamiento",
  pendiente_pago: "Pendiente de pago",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  salarios: "Salarios",
  honorarios_medicos: "Honorarios médicos",
  gastos_administrativos: "Gastos administrativos",
  impuestos: "Impuestos",
  intereses: "Intereses",
  marketing: "Marketing",
  comercializacion: "Comercialización",
  servicios: "Servicios",
  alquiler: "Alquiler",
  mercaderia: "Mercadería",
  mantenimiento: "Mantenimiento",
  otros: "Otros",
};

export const movementTypeLabels: Record<MovementType, string> = {
  ingreso_compra: "Ingreso por compra",
  salida_tratamiento: "Salida por tratamiento",
  salida_venta: "Salida por venta",
  ajuste: "Ajuste manual",
  vencimiento: "Vencimiento",
  devolucion: "Devolución",
};

export const inventoryStatusLabels: Record<InventoryStatus, string> = {
  normal: "Stock normal",
  bajo: "Stock bajo",
  sin_stock: "Sin stock",
  sobrestock: "Sobrestock",
};
