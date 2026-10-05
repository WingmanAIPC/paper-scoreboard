/**
 * Paper equity fee model — mirrored from desk paper-autonomy.
 * $0 commission + SEC / FINRA TAF / CAT pass-throughs.
 * Tiny regulatory fees for post-review. Never a broker commission.
 */

export const PAPER_COMMISSION_USD = 0 as const;

/** SEC Section 31 — sell-side only. $20.60 per $1M notional (FY2026 rate). */
export const SEC_FEE_PER_MILLION_USD = 20.6;

/** FINRA Trading Activity Fee — sell-side equity. */
export const FINRA_TAF_PER_SHARE = 0.000195;
export const FINRA_TAF_CAP_USD = 9.79;

/** CAT Fee 2026-1 — both sides. $0.000001 per executed share. */
export const CAT_FEE_PER_SHARE = 0.000001;

export type PaperFeeLine = {
  commissionUsd: 0;
  secUsd: number;
  finraTafUsd: number;
  catUsd: number;
  totalUsd: number;
};

function roundCent(n: number): number {
  return Math.round(n * 100) / 100;
}

/** SEC Section 31 rounds up to the next cent when any fraction exists. */
function roundSecUp(n: number): number {
  if (!(n > 0)) return 0;
  return Math.ceil(n * 100 - 1e-9) / 100;
}

export function emptyPaperFeeLine(): PaperFeeLine {
  return {
    commissionUsd: 0,
    secUsd: 0,
    finraTafUsd: 0,
    catUsd: 0,
    totalUsd: 0,
  };
}

/**
 * Regulatory pass-throughs for one paper fill leg.
 * Commission stays $0. Sells pay SEC + FINRA TAF; both sides pay CAT.
 */
export function paperFeesForFill(
  side: "BUY" | "SELL",
  qty: number,
  notionalUsd: number,
): PaperFeeLine {
  const useQty = qty > 0 && Number.isFinite(qty) ? qty : 0;
  const useNotional = notionalUsd > 0 && Number.isFinite(notionalUsd) ? notionalUsd : 0;
  const sell = side === "SELL";

  const secUsd =
    sell && useNotional > 0
      ? roundSecUp((useNotional * SEC_FEE_PER_MILLION_USD) / 1_000_000)
      : 0;
  const tafRaw = sell && useQty > 0 ? useQty * FINRA_TAF_PER_SHARE : 0;
  const finraTafUsd = tafRaw > 0 ? Math.min(FINRA_TAF_CAP_USD, roundCent(tafRaw)) : 0;
  const catRaw = useQty > 0 ? useQty * CAT_FEE_PER_SHARE : 0;
  const catUsd = roundCent(catRaw);

  const totalUsd = roundCent(PAPER_COMMISSION_USD + secUsd + finraTafUsd + catUsd);
  return {
    commissionUsd: PAPER_COMMISSION_USD,
    secUsd,
    finraTafUsd,
    catUsd,
    totalUsd,
  };
}

export function addPaperFees(a: PaperFeeLine, b: PaperFeeLine): PaperFeeLine {
  return {
    commissionUsd: 0,
    secUsd: roundCent(a.secUsd + b.secUsd),
    finraTafUsd: roundCent(a.finraTafUsd + b.finraTafUsd),
    catUsd: roundCent(a.catUsd + b.catUsd),
    totalUsd: roundCent(a.totalUsd + b.totalUsd),
  };
}

export function paperEntryFees(
  side: "BUY" | "SELL",
  qty: number,
  notionalUsd: number,
): PaperFeeLine {
  return paperFeesForFill(side, qty, notionalUsd);
}

export function paperExitFees(
  entrySide: "BUY" | "SELL",
  qty: number,
  exitNotionalUsd: number,
): PaperFeeLine {
  const exitSide = entrySide === "BUY" ? "SELL" : "BUY";
  return paperFeesForFill(exitSide, qty, exitNotionalUsd);
}

export function paperRoundTripFees(
  entrySide: "BUY" | "SELL",
  qty: number,
  entryNotionalUsd: number,
  exitNotionalUsd: number,
): PaperFeeLine {
  return addPaperFees(
    paperEntryFees(entrySide, qty, entryNotionalUsd),
    paperExitFees(entrySide, qty, exitNotionalUsd),
  );
}

export function netPaperPnl(grossPnlUsd: number | null, feesUsd: number): number | null {
  if (grossPnlUsd == null || !Number.isFinite(grossPnlUsd)) return null;
  return roundCent(grossPnlUsd - (feesUsd > 0 ? feesUsd : 0));
}
