import type { InventoryItem, PriceHistoryEntry } from "@/types";
import { createRng, intBetween, pick } from "./seededRandom";
import { content, type InventorySeed } from "./content";

type Seed = InventorySeed;

const seeds: Seed[] = content.inventorySeeds;

const supplierPool = content.inventorySupplierPool;

function buildPriceHistory(seed: Seed, rng: () => number): PriceHistoryEntry[] {
  const months = ["2026-01-08", "2026-02-12", "2026-03-15", "2026-04-10", "2026-05-14", "2026-06-09"];
  let price = Math.round(seed.lastPrice * 0.74);
  return months.map((date) => {
    price = Math.round(price * (1 + (intBetween(rng, 3, 9) / 100)));
    return {
      date,
      supplier: pick(rng, [seed.mainSupplierId, ...supplierPool]),
      quantity: intBetween(rng, 5, 40),
      unitPrice: price,
    };
  });
}

export const inventoryItems: InventoryItem[] = seeds.map((seed, i) => {
  const rng = createRng(1000 + i);
  const history = buildPriceHistory(seed, rng);
  const avgCost = Math.round(
    history.reduce((acc, h) => acc + h.unitPrice, 0) / history.length,
  );
  return {
    ...seed,
    avgCost,
    lastPrice: history[history.length - 1].unitPrice,
    priceHistory: history,
  };
});

export const getInventoryItem = (id: string) =>
  inventoryItems.find((i) => i.id === id);
