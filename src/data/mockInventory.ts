import type { InventoryItem, PriceHistoryEntry } from "@/types";
import { createRng, intBetween, pick } from "./seededRandom";

interface Seed {
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

const seeds: Seed[] = [
  { id: "inv-1", name: "Ácido hialurónico 1 ml", category: "Rellenos", code: "AH-1ML", mainSupplierId: "sup-5", stock: 24, minStock: 10, unit: "jeringa", lastPrice: 78000 },
  { id: "inv-2", name: "Toxina botulínica 100 U", category: "Toxinas", code: "TB-100U", mainSupplierId: "sup-5", stock: 9, minStock: 12, unit: "frasco", lastPrice: 165000 },
  { id: "inv-3", name: "Guantes de nitrilo", category: "Descartables", code: "GN-CAJA", mainSupplierId: "sup-8", stock: 140, minStock: 40, unit: "par", lastPrice: 320 },
  { id: "inv-4", name: "Gasas estériles", category: "Descartables", code: "GE-PACK", mainSupplierId: "sup-8", stock: 380, minStock: 100, unit: "unidad", lastPrice: 95 },
  { id: "inv-5", name: "Agujas 30G", category: "Descartables", code: "AG-30G", mainSupplierId: "sup-10", stock: 6, minStock: 50, unit: "unidad", lastPrice: 210 },
  { id: "inv-6", name: "Jeringas 1 ml", category: "Descartables", code: "JE-1ML", mainSupplierId: "sup-10", stock: 95, minStock: 40, unit: "unidad", lastPrice: 280 },
  { id: "inv-7", name: "Protector solar FPS 50", category: "Dermocosmética", code: "PS-50", mainSupplierId: "sup-2", stock: 32, minStock: 15, unit: "unidad", lastPrice: 18500 },
  { id: "inv-8", name: "Crema hidratante facial", category: "Dermocosmética", code: "CHF-50", mainSupplierId: "sup-7", stock: 41, minStock: 15, unit: "unidad", lastPrice: 15800 },
  { id: "inv-9", name: "Serum antioxidante", category: "Dermocosmética", code: "SAO-30", mainSupplierId: "sup-9", stock: 27, minStock: 12, unit: "unidad", lastPrice: 24500 },
  { id: "inv-10", name: "Alcohol sanitario", category: "Higiene", code: "ALC-1L", mainSupplierId: "sup-14", stock: 60, minStock: 20, unit: "litro", lastPrice: 2200 },
  { id: "inv-11", name: "Algodón hidrófilo", category: "Descartables", code: "ALG-500", mainSupplierId: "sup-8", stock: 48, minStock: 20, unit: "rollo", lastPrice: 3400 },
  { id: "inv-12", name: "Anestésico tópico", category: "Farmacia", code: "AT-30G", mainSupplierId: "sup-6", stock: 18, minStock: 10, unit: "pomo", lastPrice: 12800 },
  { id: "inv-13", name: "Solución fisiológica", category: "Farmacia", code: "SF-500", mainSupplierId: "sup-6", stock: 70, minStock: 25, unit: "sachet", lastPrice: 1800 },
  { id: "inv-14", name: "Cánulas 25G", category: "Descartables", code: "CAN-25G", mainSupplierId: "sup-10", stock: 14, minStock: 20, unit: "unidad", lastPrice: 4500 },
  { id: "inv-15", name: "Vitamina C ampolla", category: "Mesoterapia", code: "VC-AMP", mainSupplierId: "sup-13", stock: 55, minStock: 20, unit: "ampolla", lastPrice: 3200 },
  { id: "inv-16", name: "Cóctel mesoterapia facial", category: "Mesoterapia", code: "MES-F", mainSupplierId: "sup-13", stock: 22, minStock: 10, unit: "vial", lastPrice: 28000 },
  { id: "inv-17", name: "Cóctel mesoterapia capilar", category: "Mesoterapia", code: "MES-C", mainSupplierId: "sup-13", stock: 0, minStock: 8, unit: "vial", lastPrice: 31000 },
  { id: "inv-18", name: "Peeling glicólico", category: "Cosmetología", code: "PEEL-G", mainSupplierId: "sup-11", stock: 19, minStock: 8, unit: "frasco", lastPrice: 21000 },
  { id: "inv-19", name: "Máscara hidratante", category: "Cosmetología", code: "MH-PACK", mainSupplierId: "sup-7", stock: 64, minStock: 20, unit: "unidad", lastPrice: 4800 },
  { id: "inv-20", name: "Tónico facial", category: "Cosmetología", code: "TON-200", mainSupplierId: "sup-11", stock: 38, minStock: 15, unit: "unidad", lastPrice: 9600 },
  { id: "inv-21", name: "Gel conductor", category: "Cosmetología", code: "GEL-1L", mainSupplierId: "sup-4", stock: 12, minStock: 6, unit: "litro", lastPrice: 6800 },
  { id: "inv-22", name: "Barbijo descartable", category: "Descartables", code: "BAR-50", mainSupplierId: "sup-8", stock: 210, minStock: 60, unit: "unidad", lastPrice: 120 },
  { id: "inv-23", name: "Apósito post-tratamiento", category: "Descartables", code: "APO-PT", mainSupplierId: "sup-3", stock: 88, minStock: 30, unit: "unidad", lastPrice: 540 },
  { id: "inv-24", name: "Crema regeneradora", category: "Dermocosmética", code: "CR-30", mainSupplierId: "sup-9", stock: 16, minStock: 10, unit: "unidad", lastPrice: 19800 },
  { id: "inv-25", name: "Hilos tensores", category: "Rellenos", code: "HT-PCK", mainSupplierId: "sup-5", stock: 7, minStock: 6, unit: "blister", lastPrice: 52000 },
  { id: "inv-26", name: "Limpiador facial", category: "Dermocosmética", code: "LF-200", mainSupplierId: "sup-2", stock: 44, minStock: 15, unit: "unidad", lastPrice: 11200 },
  { id: "inv-27", name: "Bolsas de residuos patogénicos", category: "Higiene", code: "BRP-50", mainSupplierId: "sup-14", stock: 130, minStock: 40, unit: "unidad", lastPrice: 260 },
  { id: "inv-28", name: "Lidocaína inyectable", category: "Farmacia", code: "LI-INY", mainSupplierId: "sup-6", stock: 11, minStock: 12, unit: "ampolla", lastPrice: 5400 },
  { id: "inv-29", name: "Toallas descartables", category: "Descartables", code: "TD-100", mainSupplierId: "sup-12", stock: 96, minStock: 30, unit: "unidad", lastPrice: 85 },
  { id: "inv-30", name: "Punta láser repuesto", category: "Aparatología", code: "PL-REP", mainSupplierId: "sup-15", stock: 5, minStock: 4, unit: "unidad", lastPrice: 145000 },
];

const supplierPool = ["sup-1", "sup-2", "sup-3", "sup-5", "sup-9", "sup-12", "sup-13"];

function buildPriceHistory(seed: Seed, rng: () => number): PriceHistoryEntry[] {
  const months = ["2026-01-08", "2026-02-12", "2026-03-15", "2026-04-10", "2026-05-14", "2026-06-09"];
  let price = Math.round(seed.lastPrice * 0.74);
  return months.map((date) => {
    price = Math.round(price * (1 + (intBetween(rng, 3, 9) / 100)));
    return {
      date,
      supplier: pick(rng, [seed.mainSupplierId, ...supplierPool]),
      quantity: intBetween(rng, 5, 40),
      unitPrice: price,
    };
  });
}

export const inventoryItems: InventoryItem[] = seeds.map((seed, i) => {
  const rng = createRng(1000 + i);
  const history = buildPriceHistory(seed, rng);
  const avgCost = Math.round(
    history.reduce((acc, h) => acc + h.unitPrice, 0) / history.length,
  );
  return {
    ...seed,
    avgCost,
    lastPrice: history[history.length - 1].unitPrice,
    priceHistory: history,
  };
});

export const getInventoryItem = (id: string) =>
  inventoryItems.find((i) => i.id === id);
