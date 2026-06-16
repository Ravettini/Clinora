import { content } from "./content";

export const categories = content.categories;

export const getCategory = (id: string) =>
  categories.find((c) => c.id === id) ?? categories[0];
