import type { Patient, BranchId } from "@/types";
import { createRng, intBetween, pick, chance } from "./seededRandom";

const firstNames = [
  "Sofía", "Martina", "Lucía", "Carolina", "Victoria", "Julieta", "Agustina", "Pilar",
  "Valentina", "Camila", "Florencia", "Catalina", "Renata", "Delfina", "Emilia", "Josefina",
  "Bianca", "Mora", "Abril", "Olivia", "Guadalupe", "Malena", "Antonella", "Brisa",
  "Paloma", "Regina", "Isabella", "Manuela", "Zoe", "Constanza", "Magdalena", "Ámbar",
  "Clara", "Juana", "Trinidad", "Carla", "Daniela", "Romina", "Natalia", "Gabriela",
];

const lastNames = [
  "Benítez", "López", "Fernández", "Suárez", "Molina", "Acosta", "Romero", "García",
  "Sosa", "Ramírez", "Herrera", "Giménez", "Castro", "Ortiz", "Silva", "Núñez",
  "Rojas", "Medina", "Vega", "Ríos", "Cabrera", "Ferreyra", "Domínguez", "Aguirre",
  "Méndez", "Cardozo", "Peralta", "Vera", "Ledesma", "Quiroga", "Ibáñez", "Paz",
  "Bravo", "Campos", "Maldonado", "Figueroa", "Correa", "Luna", "Pereyra", "Villalba",
];

const cities = ["Palermo", "Belgrano", "Caballito", "Recoleta", "Núñez", "Villa Crespo", "Colegiales", "Almagro"];
const streets = ["Av. Libertador", "Thames", "Gurruchaga", "Cabildo", "Av. Corrientes", "Honduras", "Malabia", "Av. Cabildo"];

const doctorIds = ["doc-1", "doc-2", "doc-3", "doc-4", "doc-7", "doc-8"];

function isoDaysAgo(days: number): string {
  const d = new Date(2026, 5, 11);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const patients: Patient[] = Array.from({ length: 40 }, (_, i) => {
  const rng = createRng(5000 + i);
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i * 7 + 3) % lastNames.length];
  const age = intBetween(rng, 22, 64);
  const birthYear = 2026 - age;
  const birthMonth = intBetween(rng, 1, 12);
  const birthDay = intBetween(rng, 1, 28);
  const dni = `${intBetween(rng, 24, 46)}.${String(intBetween(rng, 100, 999))}.${String(intBetween(rng, 100, 999))}`;
  const branchId: BranchId = chance(rng, 0.55) ? "palermo" : "belgrano";
  const lastVisitDays = intBetween(rng, 1, 180);
  const isNew = i >= 36;

  return {
    id: `pat-${i + 1}`,
    dni,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    birthDate: `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`,
    phone: `+54 11 ${intBetween(rng, 3000, 6999)}-${intBetween(rng, 1000, 9999)}`,
    email: `${firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.${lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@mail.demo`,
    address: `${pick(rng, streets)} ${intBetween(rng, 100, 4900)}`,
    city: pick(rng, cities),
    notes: chance(rng, 0.3) ? "Paciente con seguimiento estético periódico." : undefined,
    status: isNew ? "nuevo" : lastVisitDays > 120 ? "inactivo" : "activo",
    createdAt: isoDaysAgo(intBetween(rng, 30, 900)),
    lastVisit: isNew ? undefined : isoDaysAgo(lastVisitDays),
    usualDoctorId: pick(rng, doctorIds),
    branchId,
  };
});

export const getPatient = (id: string) => patients.find((p) => p.id === id);
export const findPatientByDni = (dni: string) =>
  patients.find((p) => p.dni.replace(/\./g, "") === dni.replace(/\./g, ""));
