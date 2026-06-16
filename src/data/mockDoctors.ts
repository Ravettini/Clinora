import { content } from "./content";

export const doctors = content.doctors;

export const getDoctor = (id?: string) => doctors.find((d) => d.id === id);
export const primaryDoctors = doctors.filter(
  (d) => d.role === "principal" || d.role === "ambas",
);
export const secondaryDoctors = doctors.filter(
  (d) => d.role === "secundaria" || d.role === "ambas",
);
