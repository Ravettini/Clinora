import type { InventoryMovement, MovementType } from "@/types";
import { appointments } from "./mockAppointments";
import { getTreatment } from "./mockTreatments";
import { getPatient } from "./mockPatients";
import { inventoryItems } from "./mockInventory";
import { createRng, intBetween, pick } from "./seededRandom";

const users = ["Recepción Palermo", "Recepción Belgrano", "Depósito"];

const finalized = appointments.filter((a) => a.status === "finalizado").slice(0, 50);

const treatmentOut: InventoryMovement[] = [];
let counter = 1;
finalized.forEach((a, i) => {
  const treatment = getTreatment(a.treatmentId);
  const patient = getPatient(a.patientId);
  treatment.consumes.forEach((c) => {
    treatmentOut.push({
      id: `mov-out-${counter++}`,
      date: a.date,
      itemId: c.itemId,
      type: "salida_tratamiento",
      quantity: -c.quantity,
      reference: `${treatment.name} · ${patient?.fullName ?? ""}`.trim(),
      user: users[i % 2],
    });
  });
});

const purchaseTypes: MovementType[] = ["ingreso_compra", "ajuste", "devolucion", "vencimiento"];
const extra: InventoryMovement[] = Array.from({ length: 40 }, (_, i) => {
  const rng = createRng(50000 + i);
  const item = pick(rng, inventoryItems);
  const type = pick(rng, purchaseTypes);
  const positive = type === "ingreso_compra" || type === "devolucion";
  const qty = intBetween(rng, 5, 40) * (positive ? 1 : -1);
  const base = new Date(2026, 5, 1);
  base.setMonth(base.getMonth() - intBetween(rng, 0, 5));
  base.setDate(intBetween(rng, 1, 27));
  return {
    id: `mov-x-${i + 1}`,
    date: base.toISOString().slice(0, 10),
    itemId: item.id,
    type,
    quantity: qty,
    reference:
      type === "ingreso_compra"
        ? "Orden de compra"
        : type === "vencimiento"
          ? "Producto vencido"
          : type === "devolucion"
            ? "Devolución a proveedor"
            : "Ajuste de inventario",
    user: pick(rng, users),
  };
});

export const inventoryMovements: InventoryMovement[] = [...extra, ...treatmentOut].sort(
  (a, b) => (a.date < b.date ? 1 : -1),
);

export const movementsByItem = (itemId: string) =>
  inventoryMovements.filter((m) => m.itemId === itemId);
