import type { Treatment } from "@/types";

export const treatments: Treatment[] = [
  // Botox
  { id: "trt-1", name: "Botox tercio superior", categoryId: "botox", price: 285000, currency: "ARS", durationMin: 40, baseCommissionPct: 12, active: true, consumes: [{ itemId: "inv-2", quantity: 0.35 }, { itemId: "inv-5", quantity: 1 }, { itemId: "inv-3", quantity: 1 }, { itemId: "inv-4", quantity: 2 }] },
  { id: "trt-2", name: "Botox full face", categoryId: "botox", price: 420000, currency: "ARS", durationMin: 60, baseCommissionPct: 12, active: true, consumes: [{ itemId: "inv-2", quantity: 0.6 }, { itemId: "inv-5", quantity: 2 }, { itemId: "inv-3", quantity: 1 }, { itemId: "inv-4", quantity: 3 }] },
  { id: "trt-3", name: "Tratamiento bruxismo", categoryId: "botox", price: 310000, currency: "ARS", durationMin: 45, baseCommissionPct: 10, active: true, consumes: [{ itemId: "inv-2", quantity: 0.5 }, { itemId: "inv-5", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  // Rellenos
  { id: "trt-4", name: "Ácido hialurónico labios", categoryId: "rellenos", price: 350000, currency: "ARS", durationMin: 45, baseCommissionPct: 15, active: true, consumes: [{ itemId: "inv-1", quantity: 1 }, { itemId: "inv-14", quantity: 1 }, { itemId: "inv-3", quantity: 1 }, { itemId: "inv-12", quantity: 0.2 }] },
  { id: "trt-5", name: "Surcos nasogenianos", categoryId: "rellenos", price: 390000, currency: "ARS", durationMin: 50, baseCommissionPct: 15, active: true, consumes: [{ itemId: "inv-1", quantity: 1 }, { itemId: "inv-14", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-6", name: "Mentón", categoryId: "rellenos", price: 410000, currency: "ARS", durationMin: 50, baseCommissionPct: 15, active: true, consumes: [{ itemId: "inv-1", quantity: 1.5 }, { itemId: "inv-14", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-7", name: "Perfilado mandibular", categoryId: "rellenos", price: 560000, currency: "ARS", durationMin: 70, baseCommissionPct: 14, active: true, consumes: [{ itemId: "inv-1", quantity: 2 }, { itemId: "inv-14", quantity: 2 }, { itemId: "inv-3", quantity: 1 }] },
  // Cosmetología
  { id: "trt-8", name: "Limpieza facial profunda", categoryId: "cosmetologia", price: 95000, currency: "ARS", durationMin: 60, baseCommissionPct: 25, active: true, consumes: [{ itemId: "inv-19", quantity: 1 }, { itemId: "inv-20", quantity: 0.2 }, { itemId: "inv-26", quantity: 0.2 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-9", name: "Peeling químico", categoryId: "cosmetologia", price: 120000, currency: "ARS", durationMin: 45, baseCommissionPct: 22, active: true, consumes: [{ itemId: "inv-18", quantity: 0.15 }, { itemId: "inv-13", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-10", name: "Dermaplaning", categoryId: "cosmetologia", price: 88000, currency: "ARS", durationMin: 40, baseCommissionPct: 22, active: true, consumes: [{ itemId: "inv-19", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-11", name: "Hidratación facial", categoryId: "cosmetologia", price: 78000, currency: "ARS", durationMin: 40, baseCommissionPct: 20, active: true, consumes: [{ itemId: "inv-19", quantity: 1 }, { itemId: "inv-8", quantity: 0.1 }] },
  // Clínica
  { id: "trt-12", name: "Consulta dermatológica", categoryId: "clinica", price: 65000, currency: "ARS", durationMin: 30, baseCommissionPct: 0, active: true, consumes: [] },
  { id: "trt-13", name: "Biopsia", categoryId: "clinica", price: 180000, currency: "ARS", durationMin: 40, baseCommissionPct: 8, active: true, consumes: [{ itemId: "inv-28", quantity: 1 }, { itemId: "inv-4", quantity: 4 }, { itemId: "inv-3", quantity: 1 }, { itemId: "inv-23", quantity: 1 }] },
  { id: "trt-14", name: "Control clínico", categoryId: "clinica", price: 48000, currency: "ARS", durationMin: 20, baseCommissionPct: 0, active: true, consumes: [] },
  // Mesoterapia
  { id: "trt-15", name: "Mesoterapia facial", categoryId: "mesoterapia", price: 135000, currency: "ARS", durationMin: 45, baseCommissionPct: 18, active: true, consumes: [{ itemId: "inv-16", quantity: 1 }, { itemId: "inv-15", quantity: 2 }, { itemId: "inv-5", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-16", name: "Mesoterapia capilar", categoryId: "mesoterapia", price: 150000, currency: "ARS", durationMin: 50, baseCommissionPct: 18, active: true, consumes: [{ itemId: "inv-17", quantity: 1 }, { itemId: "inv-5", quantity: 2 }, { itemId: "inv-3", quantity: 1 }] },
  // Productos
  { id: "trt-17", name: "Crema hidratante", categoryId: "productos", price: 18900, currency: "ARS", durationMin: 5, baseCommissionPct: 8, active: true, consumes: [{ itemId: "inv-8", quantity: 1 }] },
  { id: "trt-18", name: "Protector solar", categoryId: "productos", price: 22500, currency: "ARS", durationMin: 5, baseCommissionPct: 8, active: true, consumes: [{ itemId: "inv-7", quantity: 1 }] },
  { id: "trt-19", name: "Serum antioxidante", categoryId: "productos", price: 29900, currency: "ARS", durationMin: 5, baseCommissionPct: 8, active: true, consumes: [{ itemId: "inv-9", quantity: 1 }] },
  // Láser
  { id: "trt-20", name: "Depilación láser zona pequeña", categoryId: "laser", price: 72000, currency: "ARS", durationMin: 30, baseCommissionPct: 20, active: true, consumes: [{ itemId: "inv-21", quantity: 0.1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-21", name: "Depilación láser zona grande", categoryId: "laser", price: 145000, currency: "ARS", durationMin: 50, baseCommissionPct: 20, active: true, consumes: [{ itemId: "inv-21", quantity: 0.2 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-22", name: "Rejuvenecimiento láser facial", categoryId: "laser", price: 230000, currency: "ARS", durationMin: 60, baseCommissionPct: 16, active: true, consumes: [{ itemId: "inv-21", quantity: 0.2 }, { itemId: "inv-24", quantity: 0.2 }, { itemId: "inv-3", quantity: 1 }] },
  // Rellenos premium / otros
  { id: "trt-23", name: "Hilos tensores faciales", categoryId: "rellenos", price: 680000, currency: "ARS", durationMin: 80, baseCommissionPct: 14, active: true, consumes: [{ itemId: "inv-25", quantity: 1 }, { itemId: "inv-12", quantity: 0.3 }, { itemId: "inv-3", quantity: 2 }] },
  // Gift cards
  { id: "trt-24", name: "Gift Card Experiencia Facial", categoryId: "giftcards", price: 150000, currency: "ARS", durationMin: 0, baseCommissionPct: 0, active: true, consumes: [] },
  { id: "trt-25", name: "Gift Card Premium", categoryId: "giftcards", price: 300000, currency: "ARS", durationMin: 0, baseCommissionPct: 0, active: true, consumes: [] },
];

export const getTreatment = (id: string) =>
  treatments.find((t) => t.id === id) ?? treatments[0];
