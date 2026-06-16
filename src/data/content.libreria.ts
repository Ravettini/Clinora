import type { Doctor, Treatment, TreatmentCategory, Branch, Supplier, ExpenseCategory } from "@/types";
import type { TenantContent, InventorySeed, PnLRaw } from "./content";

const branches: Branch[] = [
  {
    id: "palermo",
    name: "Sucursal Centro",
    address: "Av. Rivadavia 4800, CABA (ficticia)",
    phone: "+54 11 4300-0100",
    manager: "Martín Sosa",
  },
  {
    id: "belgrano",
    name: "Depósito Norte",
    address: "Av. Triunvirato 3900, CABA (ficticia)",
    phone: "+54 11 4300-0200",
    manager: "Carolina Vega",
  },
];

// Mismos IDs y roles que el dataset médico (doc-5 y doc-6 son "secundarios" /
// vendedores con comisión); solo cambia el vocabulario.
const doctors: Doctor[] = [
  { id: "doc-1", firstName: "Martín", lastName: "Sosa", fullName: "Martín Sosa", specialty: "Ventas mayorista", role: "ambas", email: "m.sosa@papelera.demo", phone: "+54 11 5200-0011", color: "#7a52b0", active: true, branchId: "palermo" },
  { id: "doc-2", firstName: "Carolina", lastName: "Vega", fullName: "Carolina Vega", specialty: "Ventas mayorista", role: "ambas", email: "c.vega@papelera.demo", phone: "+54 11 5200-0012", color: "#a98ed4", active: true, branchId: "belgrano" },
  { id: "doc-3", firstName: "Diego", lastName: "Funes", fullName: "Diego Funes", specialty: "Ventas mostrador", role: "ambas", email: "d.funes@papelera.demo", phone: "+54 11 5200-0013", color: "#cf5b6c", active: true, branchId: "palermo" },
  { id: "doc-4", firstName: "Laura", lastName: "Pereyra", fullName: "Laura Pereyra", specialty: "Atención corporativa", role: "principal", email: "l.pereyra@papelera.demo", phone: "+54 11 5200-0014", color: "#4ca777", active: true, branchId: "belgrano" },
  { id: "doc-5", firstName: "Camila", lastName: "Rey", fullName: "Camila Rey", specialty: "Vendedora mostrador", role: "secundaria", email: "c.rey@papelera.demo", phone: "+54 11 5200-0015", color: "#d99b3c", active: true, branchId: "palermo" },
  { id: "doc-6", firstName: "Pablo", lastName: "Navarro", fullName: "Pablo Navarro", specialty: "Vendedor mostrador", role: "secundaria", email: "p.navarro@papelera.demo", phone: "+54 11 5200-0016", color: "#8f6cc4", active: true, branchId: "belgrano" },
  { id: "doc-7", firstName: "Florencia", lastName: "Gómez", fullName: "Florencia Gómez", specialty: "E-commerce", role: "ambas", email: "f.gomez@papelera.demo", phone: "+54 11 5200-0017", color: "#e7c6d4", active: true, branchId: "palermo" },
  { id: "doc-8", firstName: "Hernán", lastName: "Vidal", fullName: "Hernán Vidal", specialty: "Ventas corporativas", role: "ambas", email: "h.vidal@papelera.demo", phone: "+54 11 5200-0018", color: "#664394", active: true, branchId: "belgrano" },
];

// Mismos IDs de categoría que el dataset médico, con nombres no médicos.
const categories: TreatmentCategory[] = [
  { id: "botox", name: "Papel & resmas", color: "#7a52b0" },
  { id: "rellenos", name: "Escritura", color: "#a98ed4" },
  { id: "cosmetologia", name: "Arte & manualidades", color: "#e7c6d4" },
  { id: "clinica", name: "Oficina", color: "#4ca777" },
  { id: "mesoterapia", name: "Escolar", color: "#d99b3c" },
  { id: "productos", name: "Tecnología", color: "#cdb8d8" },
  { id: "laser", name: "Mobiliario", color: "#cf5b6c" },
  { id: "giftcards", name: "Gift Cards", color: "#8d8799" },
];

// Mismos IDs, categoryId y consumes que el dataset médico: cambian nombre,
// precio, duración (tiempo de preparación) y comisión.
const treatments: Treatment[] = [
  { id: "trt-1", name: "Resma A4 75g (caja x10)", categoryId: "botox", price: 92000, currency: "ARS", durationMin: 10, baseCommissionPct: 6, active: true, consumes: [{ itemId: "inv-2", quantity: 0.35 }, { itemId: "inv-5", quantity: 1 }, { itemId: "inv-3", quantity: 1 }, { itemId: "inv-4", quantity: 2 }] },
  { id: "trt-2", name: "Resma A4 90g (caja x10)", categoryId: "botox", price: 118000, currency: "ARS", durationMin: 10, baseCommissionPct: 6, active: true, consumes: [{ itemId: "inv-2", quantity: 0.6 }, { itemId: "inv-5", quantity: 2 }, { itemId: "inv-3", quantity: 1 }, { itemId: "inv-4", quantity: 3 }] },
  { id: "trt-3", name: "Resma Oficio (caja x10)", categoryId: "botox", price: 104000, currency: "ARS", durationMin: 10, baseCommissionPct: 5, active: true, consumes: [{ itemId: "inv-2", quantity: 0.5 }, { itemId: "inv-5", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-4", name: "Bolígrafos retráctiles (x24)", categoryId: "rellenos", price: 28500, currency: "ARS", durationMin: 8, baseCommissionPct: 12, active: true, consumes: [{ itemId: "inv-1", quantity: 1 }, { itemId: "inv-14", quantity: 1 }, { itemId: "inv-3", quantity: 1 }, { itemId: "inv-12", quantity: 0.2 }] },
  { id: "trt-5", name: "Roller gel premium (x12)", categoryId: "rellenos", price: 34900, currency: "ARS", durationMin: 8, baseCommissionPct: 12, active: true, consumes: [{ itemId: "inv-1", quantity: 1 }, { itemId: "inv-14", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-6", name: "Marcadores permanentes (x12)", categoryId: "rellenos", price: 31000, currency: "ARS", durationMin: 8, baseCommissionPct: 12, active: true, consumes: [{ itemId: "inv-1", quantity: 1.5 }, { itemId: "inv-14", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-7", name: "Set marcadores pizarra (x4)", categoryId: "rellenos", price: 19800, currency: "ARS", durationMin: 6, baseCommissionPct: 10, active: true, consumes: [{ itemId: "inv-1", quantity: 2 }, { itemId: "inv-14", quantity: 2 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-8", name: "Témperas escolares (x12)", categoryId: "cosmetologia", price: 24500, currency: "ARS", durationMin: 6, baseCommissionPct: 18, active: true, consumes: [{ itemId: "inv-19", quantity: 1 }, { itemId: "inv-20", quantity: 0.2 }, { itemId: "inv-26", quantity: 0.2 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-9", name: "Acrílicos set artístico", categoryId: "cosmetologia", price: 42000, currency: "ARS", durationMin: 6, baseCommissionPct: 16, active: true, consumes: [{ itemId: "inv-18", quantity: 0.15 }, { itemId: "inv-13", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-10", name: "Block dibujo A3", categoryId: "cosmetologia", price: 15800, currency: "ARS", durationMin: 5, baseCommissionPct: 16, active: true, consumes: [{ itemId: "inv-19", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-11", name: "Acuarelas profesionales (x24)", categoryId: "cosmetologia", price: 38900, currency: "ARS", durationMin: 5, baseCommissionPct: 15, active: true, consumes: [{ itemId: "inv-19", quantity: 1 }, { itemId: "inv-8", quantity: 0.1 }] },
  { id: "trt-12", name: "Caja archivo (x5)", categoryId: "clinica", price: 21500, currency: "ARS", durationMin: 5, baseCommissionPct: 0, active: true, consumes: [] },
  { id: "trt-13", name: "Perforadora industrial", categoryId: "clinica", price: 68000, currency: "ARS", durationMin: 8, baseCommissionPct: 8, active: true, consumes: [{ itemId: "inv-28", quantity: 1 }, { itemId: "inv-4", quantity: 4 }, { itemId: "inv-3", quantity: 1 }, { itemId: "inv-23", quantity: 1 }] },
  { id: "trt-14", name: "Abrochadora metálica", categoryId: "clinica", price: 18900, currency: "ARS", durationMin: 4, baseCommissionPct: 0, active: true, consumes: [] },
  { id: "trt-15", name: "Mochila escolar reforzada", categoryId: "mesoterapia", price: 76000, currency: "ARS", durationMin: 8, baseCommissionPct: 14, active: true, consumes: [{ itemId: "inv-16", quantity: 1 }, { itemId: "inv-15", quantity: 2 }, { itemId: "inv-5", quantity: 1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-16", name: "Cartuchera completa 3 pisos", categoryId: "mesoterapia", price: 39500, currency: "ARS", durationMin: 6, baseCommissionPct: 14, active: true, consumes: [{ itemId: "inv-17", quantity: 1 }, { itemId: "inv-5", quantity: 2 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-17", name: "Calculadora científica", categoryId: "productos", price: 54000, currency: "ARS", durationMin: 5, baseCommissionPct: 10, active: true, consumes: [{ itemId: "inv-8", quantity: 1 }] },
  { id: "trt-18", name: "Pendrive 64GB", categoryId: "productos", price: 32000, currency: "ARS", durationMin: 3, baseCommissionPct: 10, active: true, consumes: [{ itemId: "inv-7", quantity: 1 }] },
  { id: "trt-19", name: "Auriculares USB", categoryId: "productos", price: 47500, currency: "ARS", durationMin: 3, baseCommissionPct: 10, active: true, consumes: [{ itemId: "inv-9", quantity: 1 }] },
  { id: "trt-20", name: "Silla de estudio", categoryId: "laser", price: 165000, currency: "ARS", durationMin: 15, baseCommissionPct: 12, active: true, consumes: [{ itemId: "inv-21", quantity: 0.1 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-21", name: "Escritorio juvenil", categoryId: "laser", price: 285000, currency: "ARS", durationMin: 20, baseCommissionPct: 12, active: true, consumes: [{ itemId: "inv-21", quantity: 0.2 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-22", name: "Biblioteca modular", categoryId: "laser", price: 420000, currency: "ARS", durationMin: 25, baseCommissionPct: 10, active: true, consumes: [{ itemId: "inv-21", quantity: 0.2 }, { itemId: "inv-24", quantity: 0.2 }, { itemId: "inv-3", quantity: 1 }] },
  { id: "trt-23", name: "Combo oficina premium", categoryId: "rellenos", price: 132000, currency: "ARS", durationMin: 12, baseCommissionPct: 12, active: true, consumes: [{ itemId: "inv-25", quantity: 1 }, { itemId: "inv-12", quantity: 0.3 }, { itemId: "inv-3", quantity: 2 }] },
  { id: "trt-24", name: "Gift Card $15.000", categoryId: "giftcards", price: 15000, currency: "ARS", durationMin: 0, baseCommissionPct: 0, active: true, consumes: [] },
  { id: "trt-25", name: "Gift Card $30.000", categoryId: "giftcards", price: 30000, currency: "ARS", durationMin: 0, baseCommissionPct: 0, active: true, consumes: [] },
];

// Mismos IDs de inventario y proveedor que el dataset médico; misma estructura
// de stock para conservar alertas, distinto vocabulario.
const inventorySeeds: InventorySeed[] = [
  { id: "inv-1", name: "Bolígrafo azul (caja x50)", category: "Escritura", code: "BOL-AZ", mainSupplierId: "sup-5", stock: 24, minStock: 10, unit: "caja", lastPrice: 9800 },
  { id: "inv-2", name: "Cartucho tinta negro", category: "Impresión", code: "CT-NEG", mainSupplierId: "sup-5", stock: 9, minStock: 12, unit: "unidad", lastPrice: 28500 },
  { id: "inv-3", name: "Folios A4 (x100)", category: "Archivo", code: "FOL-A4", mainSupplierId: "sup-8", stock: 140, minStock: 40, unit: "pack", lastPrice: 4200 },
  { id: "inv-4", name: "Etiquetas adhesivas", category: "Adhesivos", code: "ETQ-ADH", mainSupplierId: "sup-8", stock: 380, minStock: 100, unit: "plancha", lastPrice: 850 },
  { id: "inv-5", name: "Repuesto hojas N°3 (x480)", category: "Papel & resmas", code: "REP-N3", mainSupplierId: "sup-10", stock: 6, minStock: 50, unit: "pack", lastPrice: 3100 },
  { id: "inv-6", name: "Cuaderno tapa dura", category: "Cuadernos", code: "CUA-TD", mainSupplierId: "sup-10", stock: 95, minStock: 40, unit: "unidad", lastPrice: 6900 },
  { id: "inv-7", name: "Pendrive 64GB", category: "Tecnología", code: "PEN-64", mainSupplierId: "sup-2", stock: 32, minStock: 15, unit: "unidad", lastPrice: 21500 },
  { id: "inv-8", name: "Calculadora básica", category: "Tecnología", code: "CAL-BAS", mainSupplierId: "sup-7", stock: 41, minStock: 15, unit: "unidad", lastPrice: 18900 },
  { id: "inv-9", name: "Auriculares USB", category: "Tecnología", code: "AUR-USB", mainSupplierId: "sup-9", stock: 27, minStock: 12, unit: "unidad", lastPrice: 24500 },
  { id: "inv-10", name: "Alcohol en gel", category: "Limpieza", code: "ALC-GEL", mainSupplierId: "sup-14", stock: 60, minStock: 20, unit: "litro", lastPrice: 2200 },
  { id: "inv-11", name: "Papel afiche (rollo)", category: "Papel & resmas", code: "PAP-AF", mainSupplierId: "sup-8", stock: 48, minStock: 20, unit: "rollo", lastPrice: 3400 },
  { id: "inv-12", name: "Tinta para sello", category: "Oficina", code: "TIN-SEL", mainSupplierId: "sup-6", stock: 18, minStock: 10, unit: "frasco", lastPrice: 6800 },
  { id: "inv-13", name: "Corrector líquido", category: "Escritura", code: "COR-LIQ", mainSupplierId: "sup-6", stock: 70, minStock: 25, unit: "unidad", lastPrice: 1800 },
  { id: "inv-14", name: "Minas portaminas 0.5", category: "Escritura", code: "MIN-05", mainSupplierId: "sup-10", stock: 14, minStock: 20, unit: "estuche", lastPrice: 1500 },
  { id: "inv-15", name: "Lápiz negro HB (x12)", category: "Escritura", code: "LAP-HB", mainSupplierId: "sup-13", stock: 55, minStock: 20, unit: "caja", lastPrice: 3200 },
  { id: "inv-16", name: "Set geometría", category: "Escolar", code: "SET-GEO", mainSupplierId: "sup-13", stock: 22, minStock: 10, unit: "set", lastPrice: 5600 },
  { id: "inv-17", name: "Compás metálico", category: "Escolar", code: "COM-MET", mainSupplierId: "sup-13", stock: 0, minStock: 8, unit: "unidad", lastPrice: 4900 },
  { id: "inv-18", name: "Acrílico 100ml", category: "Arte & manualidades", code: "ACR-100", mainSupplierId: "sup-11", stock: 19, minStock: 8, unit: "pomo", lastPrice: 3800 },
  { id: "inv-19", name: "Block hojas color A4", category: "Arte & manualidades", code: "BLK-COL", mainSupplierId: "sup-7", stock: 64, minStock: 20, unit: "unidad", lastPrice: 4800 },
  { id: "inv-20", name: "Pinceles set x6", category: "Arte & manualidades", code: "PIN-X6", mainSupplierId: "sup-11", stock: 38, minStock: 15, unit: "set", lastPrice: 5200 },
  { id: "inv-21", name: "Cinta de embalar (rollo)", category: "Embalaje", code: "CIN-EMB", mainSupplierId: "sup-4", stock: 12, minStock: 6, unit: "rollo", lastPrice: 2400 },
  { id: "inv-22", name: "Sobres carta (x50)", category: "Oficina", code: "SOB-50", mainSupplierId: "sup-8", stock: 210, minStock: 60, unit: "pack", lastPrice: 3600 },
  { id: "inv-23", name: "Carpeta colgante", category: "Archivo", code: "CAR-COL", mainSupplierId: "sup-3", stock: 88, minStock: 30, unit: "unidad", lastPrice: 1540 },
  { id: "inv-24", name: "Estante repuesto MDF", category: "Mobiliario", code: "EST-MDF", mainSupplierId: "sup-9", stock: 16, minStock: 10, unit: "unidad", lastPrice: 19800 },
  { id: "inv-25", name: "Agenda 2026 premium", category: "Cuadernos", code: "AGE-26", mainSupplierId: "sup-5", stock: 7, minStock: 6, unit: "unidad", lastPrice: 22000 },
  { id: "inv-26", name: "Goma de borrar (x20)", category: "Escritura", code: "GOM-20", mainSupplierId: "sup-2", stock: 44, minStock: 15, unit: "caja", lastPrice: 2200 },
  { id: "inv-27", name: "Bolsas de residuos", category: "Limpieza", code: "BOL-RES", mainSupplierId: "sup-14", stock: 130, minStock: 40, unit: "pack", lastPrice: 1260 },
  { id: "inv-28", name: "Repuesto biblioratos", category: "Archivo", code: "REP-BIB", mainSupplierId: "sup-6", stock: 11, minStock: 12, unit: "unidad", lastPrice: 3400 },
  { id: "inv-29", name: "Servilletas (pack x100)", category: "Limpieza", code: "SER-100", mainSupplierId: "sup-12", stock: 96, minStock: 30, unit: "pack", lastPrice: 1850 },
  { id: "inv-30", name: "Repuesto plastificadora", category: "Equipamiento", code: "PLA-REP", mainSupplierId: "sup-15", stock: 5, minStock: 4, unit: "unidad", lastPrice: 38000 },
];

const suppliers: Supplier[] = [
  { id: "sup-1", name: "Distribuidora Papelera SA", category: "Papel & resmas", contact: "Mariano Gómez", phone: "+54 11 4800-1001", email: "ventas@distripapel.demo" },
  { id: "sup-2", name: "TecnoMayorista", category: "Tecnología", contact: "Carla Ibáñez", phone: "+54 11 4800-1002", email: "pedidos@tecnomay.demo" },
  { id: "sup-3", name: "Archivo & Oficina del Sur", category: "Oficina", contact: "Pablo Re", phone: "+54 11 4800-1003", email: "info@archivosur.demo" },
  { id: "sup-4", name: "Embalajes Pro SRL", category: "Embalaje", contact: "Lucía Paz", phone: "+54 11 4800-1004", email: "contacto@embalajespro.demo" },
  { id: "sup-5", name: "Importadora Escolar", category: "Escolar & papel", contact: "Diego Salas", phone: "+54 11 4800-1005", email: "comercial@impescolar.demo" },
  { id: "sup-6", name: "Insumos Oficina Mayorista", category: "Oficina", contact: "Ana López", phone: "+54 11 4800-1006", email: "mayorista@insoficina.demo" },
  { id: "sup-7", name: "ArteShop Wholesale", category: "Arte & manualidades", contact: "Romina Díaz", phone: "+54 11 4800-1007", email: "hola@arteshop.demo" },
  { id: "sup-8", name: "Folios & Archivos Norte", category: "Archivo", contact: "Hernán Ruiz", phone: "+54 11 4800-1008", email: "ventas@foliosnorte.demo" },
  { id: "sup-9", name: "ElectroLibrería Premium", category: "Tecnología", contact: "Sol Medina", phone: "+54 11 4800-1009", email: "premium@electrolib.demo" },
  { id: "sup-10", name: "Cuadernos & Cía.", category: "Cuadernos", contact: "Tomás Vera", phone: "+54 11 4800-1010", email: "pedidos@cuadernos.demo" },
  { id: "sup-11", name: "Bellas Artes Integral", category: "Arte & manualidades", contact: "Belén Soto", phone: "+54 11 4800-1011", email: "info@bellasartes.demo" },
  { id: "sup-12", name: "Distribuidora Aurora", category: "Insumos generales", contact: "Nicolás Pérez", phone: "+54 11 4800-1012", email: "aurora@distri.demo" },
  { id: "sup-13", name: "MundoEscolar", category: "Escolar", contact: "Valeria Ortiz", phone: "+54 11 4800-1013", email: "ventas@mundoescolar.demo" },
  { id: "sup-14", name: "Higiene & Limpieza SRL", category: "Limpieza", contact: "Gonzalo Ramos", phone: "+54 11 4800-1014", email: "contacto@higienelimpieza.demo" },
  { id: "sup-15", name: "Equipamiento Librería Tech", category: "Equipamiento", contact: "Mara Coria", phone: "+54 11 4800-1015", email: "soporte@equiplib.demo" },
];

const expenseConcepts: Record<ExpenseCategory, string[]> = {
  salarios: ["Sueldos vendedores", "Sueldo administración", "Sueldo depósito"],
  honorarios_medicos: ["Comisiones vendedores", "Premio por objetivo de ventas"],
  gastos_administrativos: ["Insumos de oficina", "Sistema de gestión", "Contador"],
  impuestos: ["IIBB", "Monotributo", "Tasa municipal"],
  intereses: ["Intereses tarjeta", "Gastos bancarios"],
  marketing: ["Campaña redes", "Folletería temporada escolar", "Cartelería local"],
  comercializacion: ["Comisiones MercadoLibre", "Envíos a domicilio"],
  servicios: ["Luz", "Internet", "Agua", "Telefonía"],
  alquiler: ["Alquiler local", "Alquiler depósito", "Expensas"],
  mercaderia: ["Compra de mercadería", "Reposición temporada escolar", "Importación tecnología"],
  mantenimiento: ["Service fotocopiadoras", "Mantenimiento estanterías"],
  otros: ["Gastos varios", "Caja chica"],
};

const expenseAmounts: Record<ExpenseCategory, [number, number]> = {
  salarios: [400000, 820000],
  honorarios_medicos: [120000, 650000],
  gastos_administrativos: [70000, 300000],
  impuestos: [180000, 720000],
  intereses: [40000, 220000],
  marketing: [90000, 450000],
  comercializacion: [120000, 600000],
  servicios: [70000, 320000],
  alquiler: [800000, 1300000],
  mercaderia: [600000, 3200000],
  mantenimiento: [40000, 260000],
  otros: [20000, 140000],
};

// Comercio minorista: mayor costo de mercadería (COGS) y margen más ajustado.
const pnlRaw: PnLRaw[] = [
  { month: "Ene", sales: 14200000, cogs: 8100000, medicalFees: 540000, salaries: 2200000, admin: 520000, marketing: 380000, commercialization: 420000, taxes: 760000, services: 310000, rent: 820000, interest: 240000, depreciation: 180000, amortization: 90000 },
  { month: "Feb", sales: 13100000, cogs: 7450000, medicalFees: 500000, salaries: 2200000, admin: 520000, marketing: 360000, commercialization: 400000, taxes: 700000, services: 320000, rent: 820000, interest: 250000, depreciation: 180000, amortization: 90000 },
  { month: "Mar", sales: 26800000, cogs: 15600000, medicalFees: 1050000, salaries: 2650000, admin: 640000, marketing: 880000, commercialization: 780000, taxes: 1380000, services: 360000, rent: 860000, interest: 300000, depreciation: 180000, amortization: 90000 },
  { month: "Abr", sales: 18900000, cogs: 10700000, medicalFees: 720000, salaries: 2400000, admin: 580000, marketing: 480000, commercialization: 560000, taxes: 980000, services: 350000, rent: 860000, interest: 270000, depreciation: 180000, amortization: 90000 },
  { month: "May", sales: 16400000, cogs: 9300000, medicalFees: 620000, salaries: 2400000, admin: 580000, marketing: 420000, commercialization: 500000, taxes: 850000, services: 360000, rent: 900000, interest: 280000, depreciation: 180000, amortization: 90000 },
  { month: "Jun", sales: 17850000, cogs: 10100000, medicalFees: 680000, salaries: 2450000, admin: 600000, marketing: 460000, commercialization: 540000, taxes: 920000, services: 370000, rent: 900000, interest: 290000, depreciation: 180000, amortization: 90000 },
];

export const libreriaContent: TenantContent = {
  branches,
  doctors,
  categories,
  treatments,
  patient: {
    firstNames: [
      "Colegio", "Instituto", "Estudio", "Kiosco", "Distribuidora", "Ferretería", "Imprenta", "Estudio Contable",
      "Lucía", "Mariano", "Sebastián", "Carolina", "Federico", "Gabriela", "Andrés", "Paula",
      "Joaquín", "Verónica", "Esteban", "Daniela", "Ramiro", "Cecilia", "Tomás", "Florencia",
      "Nicolás", "Soledad", "Gonzalo", "Marina", "Ezequiel", "Patricia", "Alan", "Rocío",
      "Ignacio", "Belén", "Maximiliano", "Carla", "Damián", "Romina", "Leandro", "Natalia",
    ],
    lastNames: [
      "San Martín", "Belgrano", "del Centro", "La Esquina", "Norte SRL", "Sur SA", "Express", "& Asociados",
      "Gómez", "Fernández", "Suárez", "Molina", "Acosta", "Romero", "García", "Sosa",
      "Ramírez", "Herrera", "Giménez", "Castro", "Ortiz", "Silva", "Núñez", "Rojas",
      "Medina", "Vega", "Ríos", "Cabrera", "Ferreyra", "Domínguez", "Aguirre", "Méndez",
      "Cardozo", "Peralta", "Vera", "Ledesma", "Quiroga", "Ibáñez", "Paz", "Bravo",
    ],
    cities: ["Centro", "Once", "Caballito", "Flores", "Liniers", "Villa del Parque", "Devoto", "Mataderos"],
    streets: ["Av. Rivadavia", "Av. San Juan", "Bartolomé Mitre", "Av. La Plata", "Av. Nazca", "Av. Triunvirato", "Boyacá", "Av. Directorio"],
    note: "Cliente mayorista con cuenta corriente.",
    doctorIds: ["doc-1", "doc-2", "doc-3", "doc-4", "doc-7", "doc-8"],
  },
  inventorySeeds,
  inventorySupplierPool: ["sup-1", "sup-2", "sup-3", "sup-5", "sup-9", "sup-12", "sup-13"],
  suppliers,
  expenseConcepts,
  expenseAmounts,
  cashUsers: ["Caja Centro", "Caja Norte", "Martín Sosa"],
  inventoryUsers: ["Caja Centro", "Caja Norte", "Depósito"],
  pnlRaw,
  dashboard: {
    kpis: {
      revenueMonth: 17850000,
      revenueArs: 17850000,
      revenueUsd: 14512,
      treatments: 624,
      avgTicket: 28605,
      patientsServed: 410,
      avgAge: 36,
      pendingCommissions: 980000,
      totalExpenses: 14760000,
      ebitda: 3090000,
    },
    deltas: {
      revenue: 8.8,
      treatments: 11.5,
      avgTicket: -2.4,
      patients: 22,
      avgAge: 0.4,
      commissions: 5.2,
      expenses: 4.6,
      ebitda: -3.8,
    },
    activity: [
      { id: "act-1", type: "cobro", title: "Venta registrada", detail: "Colegio San Martín · Resma A4 75g x10 · $92.000", time: "Hace 6 min" },
      { id: "act-2", type: "tratamiento_fin", title: "Pedido preparado", detail: "Kiosco La Esquina · Combo oficina premium", time: "Hace 19 min" },
      { id: "act-3", type: "paciente_nuevo", title: "Nuevo cliente registrado", detail: "Imprenta Express · CUIT 30-71245-8", time: "Hace 38 min" },
      { id: "act-4", type: "tratamiento_inicio", title: "Pedido en preparación", detail: "Estudio Contable & Asociados · Mochilas x12", time: "Hace 1 h" },
      { id: "act-5", type: "stock", title: "Alerta de stock", detail: "Resma repuesto hojas N°3 por debajo del mínimo", time: "Hace 2 h" },
      { id: "act-6", type: "liquidacion", title: "Comisiones generadas", detail: "Camila Rey · 1ª quincena Junio", time: "Hace 3 h" },
      { id: "act-7", type: "cobro", title: "Pago dividido registrado", detail: "Distribuidora Norte · Tarjeta + Transferencia", time: "Hace 4 h" },
      { id: "act-8", type: "stock", title: "Alerta de stock", detail: "Compás metálico sin stock", time: "Hace 5 h" },
    ],
  },
};
