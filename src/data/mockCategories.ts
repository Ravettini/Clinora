import type { TreatmentCategory } from "@/types";

export const categories: TreatmentCategory[] = [
  { id: "botox", name: "Botox", color: "#7a52b0" },
  { id: "rellenos", name: "Rellenos", color: "#a98ed4" },
  { id: "cosmetologia", name: "Cosmetología", color: "#e7c6d4" },
  { id: "clinica", name: "Clínica", color: "#4ca777" },
  { id: "mesoterapia", name: "Mesoterapia", color: "#d99b3c" },
  { id: "productos", name: "Cremas", color: "#cdb8d8" },
  { id: "laser", name: "Láser", color: "#cf5b6c" },
  { id: "giftcards", name: "Gift Cards", color: "#8d8799" },
];

export const getCategory = (id: string) =>
  categories.find((c) => c.id === id) ?? categories[0];
