import type { Branch } from "@/types";

export const branches: Branch[] = [
  {
    id: "palermo",
    name: "Sede Palermo",
    address: "Av. Santa Fe 3200, CABA (ficticia)",
    phone: "+54 11 4555-0100",
    manager: "Dra. Valentina Ruiz",
  },
  {
    id: "belgrano",
    name: "Sede Belgrano",
    address: "Av. Cabildo 2100, CABA (ficticia)",
    phone: "+54 11 4555-0200",
    manager: "Dra. Marina Torres",
  },
];

export const getBranch = (id: string) => branches.find((b) => b.id === id) ?? branches[0];
