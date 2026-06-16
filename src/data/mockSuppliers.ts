import { content } from "./content";

export const suppliers = content.suppliers;

export const getSupplier = (id: string) =>
  suppliers.find((s) => s.id === id) ?? suppliers[0];
