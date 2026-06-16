import { content } from "./content";

export const branches = content.branches;

export const getBranch = (id: string) => branches.find((b) => b.id === id) ?? branches[0];
