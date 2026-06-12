import type { CommissionRule } from "@/types";
import { treatments } from "./mockTreatments";
import { secondaryDoctors } from "./mockDoctors";
import { createRng, intBetween, chance } from "./seededRandom";

const explicit: CommissionRule[] = [
  { id: "cr-x1", doctorId: "doc-5", treatmentId: "trt-8", categoryId: "cosmetologia", type: "porcentaje", pct: 25, validFrom: "2026-01-01" },
  { id: "cr-x2", doctorId: "doc-6", treatmentId: "trt-8", categoryId: "cosmetologia", type: "porcentaje", pct: 30, validFrom: "2026-01-01" },
  { id: "cr-x3", doctorId: "doc-2", treatmentId: "trt-1", categoryId: "botox", type: "fijo", fixedAmount: 45000, validFrom: "2026-01-01" },
  { id: "cr-x4", doctorId: "doc-3", treatmentId: "trt-1", categoryId: "botox", type: "porcentaje", pct: 12, validFrom: "2026-01-01" },
];

const generated: CommissionRule[] = [];
let counter = 1;
secondaryDoctors.forEach((doc, di) => {
  treatments
    .filter((t) => t.baseCommissionPct > 0)
    .forEach((t, ti) => {
      const exists = explicit.some(
        (e) => e.doctorId === doc.id && e.treatmentId === t.id,
      );
      if (exists) return;
      const rng = createRng(7000 + di * 50 + ti);
      const useFixed = chance(rng, 0.18) && t.price > 200000;
      generated.push({
        id: `cr-${counter++}`,
        doctorId: doc.id,
        treatmentId: t.id,
        categoryId: t.categoryId,
        type: useFixed ? "fijo" : "porcentaje",
        pct: useFixed ? undefined : t.baseCommissionPct + intBetween(rng, -3, 6),
        fixedAmount: useFixed ? intBetween(rng, 30, 60) * 1000 : undefined,
        validFrom: "2026-01-01",
      });
    });
});

export const commissionRules: CommissionRule[] = [...explicit, ...generated];

export const findCommissionRule = (doctorId?: string, treatmentId?: string) =>
  commissionRules.find(
    (r) => r.doctorId === doctorId && r.treatmentId === treatmentId,
  );
