import type { Supplier } from "@/types";

export const suppliers: Supplier[] = [
  { id: "sup-1", name: "MedSupply Argentina", category: "Insumos médicos", contact: "Mariano Gómez", phone: "+54 11 4700-1001", email: "ventas@medsupply.demo" },
  { id: "sup-2", name: "Dermalab Distribuciones", category: "Dermocosmética", contact: "Carla Ibáñez", phone: "+54 11 4700-1002", email: "pedidos@dermalab.demo" },
  { id: "sup-3", name: "Insumos Médicos del Sur", category: "Insumos médicos", contact: "Pablo Re", phone: "+54 11 4700-1003", email: "info@imsur.demo" },
  { id: "sup-4", name: "Estética Profesional SRL", category: "Aparatología", contact: "Lucía Paz", phone: "+54 11 4700-1004", email: "contacto@esteticapro.demo" },
  { id: "sup-5", name: "BioToxin Importadora", category: "Toxinas y rellenos", contact: "Diego Salas", phone: "+54 11 4700-1005", email: "comercial@biotoxin.demo" },
  { id: "sup-6", name: "FarmaClin Mayorista", category: "Farmacia", contact: "Ana López", phone: "+54 11 4700-1006", email: "mayorista@farmaclin.demo" },
  { id: "sup-7", name: "SkinCare Wholesale", category: "Dermocosmética", contact: "Romina Díaz", phone: "+54 11 4700-1007", email: "hola@skincarew.demo" },
  { id: "sup-8", name: "Descartables Norte", category: "Descartables", contact: "Hernán Ruiz", phone: "+54 11 4700-1008", email: "ventas@descartablesnorte.demo" },
  { id: "sup-9", name: "LabFacial Premium", category: "Dermocosmética", contact: "Sol Medina", phone: "+54 11 4700-1009", email: "premium@labfacial.demo" },
  { id: "sup-10", name: "Aguja & Jeringa Co.", category: "Descartables", contact: "Tomás Vera", phone: "+54 11 4700-1010", email: "pedidos@ajco.demo" },
  { id: "sup-11", name: "Cosmética Integral SA", category: "Dermocosmética", contact: "Belén Soto", phone: "+54 11 4700-1011", email: "info@cosmeticaintegral.demo" },
  { id: "sup-12", name: "Distribuidora Aurora", category: "Insumos generales", contact: "Nicolás Pérez", phone: "+54 11 4700-1012", email: "aurora@distri.demo" },
  { id: "sup-13", name: "MesoSupply", category: "Mesoterapia", contact: "Valeria Ortiz", phone: "+54 11 4700-1013", email: "ventas@mesosupply.demo" },
  { id: "sup-14", name: "Higiene Clínica SRL", category: "Higiene", contact: "Gonzalo Ramos", phone: "+54 11 4700-1014", email: "contacto@higieneclinica.demo" },
  { id: "sup-15", name: "Insumos Laser Tech", category: "Aparatología", contact: "Mara Coria", phone: "+54 11 4700-1015", email: "soporte@lasertech.demo" },
];

export const getSupplier = (id: string) =>
  suppliers.find((s) => s.id === id) ?? suppliers[0];
