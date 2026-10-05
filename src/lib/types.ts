/** Public autonomous paper scoreboard — paper only. Live stays locked. */

export const LIVE_ARMED = false as const;

export type AgentSeed = {
  id: string;
  name: string;
  strategy: string;
  /** Honest diary line — may be “did nothing”. */
  diary: string;
  accent: string;
  /** Gross total return pct before fees. */
  totalReturnPct: number;
  sharpe: number;
  maxDrawdownPct: number;
  /** Aggregate regulatory fees (SEC/FINRA/CAT). Commission always $0. */
  feesUsd: number;
  /** Starting paper capital. */
  startingCapitalUsd: number;
  /** Trades this window (0 = honest idle). */
  trades: number;
};

export type RankedAgent = AgentSeed & {
  rank: number;
  /** Net P&L pct after fees vs starting capital. */
  netPnlPct: number;
  /** Absolute net P&L USD after fees. */
  netPnlUsd: number;
  grossPnlUsd: number;
};

export type ScoreboardMeta = {
  title: string;
  eyebrow: string;
  subtitle: string;
  windowLabel: string;
  startingCapitalUsd: number;
  mode: "Paper";
  liveArmed: false;
  feeNote: string;
  footerLeft: string;
  footerRight: string;
};
