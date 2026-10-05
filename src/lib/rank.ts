import type { AgentSeed, RankedAgent } from "./types";
import { netPaperPnl } from "./paper-fees";

function roundCent(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundPct(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Rank agents by net P&L after fees (honest scoreboard sort). */
export function rankAgents(agents: AgentSeed[]): RankedAgent[] {
  const scored = agents.map((agent) => {
    const grossPnlUsd = roundCent((agent.totalReturnPct / 100) * agent.startingCapitalUsd);
    const netPnlUsd = netPaperPnl(grossPnlUsd, agent.feesUsd) ?? grossPnlUsd;
    const netPnlPct = roundPct((netPnlUsd / agent.startingCapitalUsd) * 100);
    return {
      ...agent,
      rank: 0,
      grossPnlUsd,
      netPnlUsd,
      netPnlPct,
    };
  });

  scored.sort((a, b) => b.netPnlUsd - a.netPnlUsd || a.name.localeCompare(b.name));
  return scored.map((row, i) => ({ ...row, rank: i + 1 }));
}

export function formatUsd(n: number): string {
  const abs = Math.abs(n);
  const body = abs.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  if (n < 0) return `−${body}`;
  return body;
}

export function formatFees(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatPct(n: number, signed = true): string {
  const body = `${Math.abs(n).toFixed(1)}%`;
  if (!signed) return body;
  if (n > 0) return `+${body}`;
  if (n < 0) return `−${body}`;
  return body;
}
