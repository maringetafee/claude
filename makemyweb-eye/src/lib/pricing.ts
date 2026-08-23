export interface CalculatorState {
  pages: number;
  animated3d: boolean;
}

export const defaultCalculatorState: CalculatorState = {
  pages: 1,
  animated3d: false,
};

export interface PricingResult {
  agency: number;
  freelancer: number;
  makemyweb: number;
  makemywebBase: number;
  extrasTotal: number;
}

// We only ever do the full design + development package end to end, so
// these use the design-dev per-page rates directly (no project-type switch).
function agencyPrice(pages: number): number {
  return 8000 + (pages - 1) * 1000;
}

function freelancerPrice(pages: number): number {
  return 3000 + (pages - 1) * 500;
}

function makemywebBasePrice(pages: number): number {
  const base = 499;
  const perPage = 200;
  return Math.max(base, base + (pages - 1) * perPage);
}

export function calculatePricing(state: CalculatorState): PricingResult {
  const { pages, animated3d } = state;

  const makemywebBase = makemywebBasePrice(pages);

  let extrasTotal = 0;
  if (animated3d) extrasTotal += 279;

  return {
    agency: agencyPrice(pages),
    freelancer: freelancerPrice(pages),
    makemywebBase,
    extrasTotal,
    makemyweb: makemywebBase + extrasTotal,
  };
}

export function formatEUR(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
