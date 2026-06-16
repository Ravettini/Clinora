import { content } from "./content";

export const treatments = content.treatments;

export const getTreatment = (id: string) =>
  treatments.find((t) => t.id === id) ?? treatments[0];
