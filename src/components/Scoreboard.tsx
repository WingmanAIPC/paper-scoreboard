import type { RankedAgent, ScoreboardMeta } from "@/lib/types";
import { formatFees, formatPct, formatUsd } from "@/lib/rank";

function AgentMark({ name, accent }: { name: string; accent: string }) {
  const initial = name.slice(0, 1).toUpperCase();
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-medium text-[#0a0a0b]"
      style={{ background: accent }}
      aria-hidden
    >
      {initial}
    </span>
  );
}

function PctCell({ value, emphasize = false }: { value: number; emphasize?: boolean }) {
  const positive = value > 0;
  const negative = value < 0;
  const color = positive
    ? "text-gain"
    : negative
      ? "text-loss"
      : "text-mute";
  return (
    <span className={`font-mono tabular-nums ${emphasize ? "font-medium" : ""} ${color}`}>
      {formatPct(value)}
    </span>
  );
}

export function Scoreboard({
  meta,
  agents,
}: {
  meta: ScoreboardMeta;
  agents: RankedAgent[];
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mute">
            {meta.eyebrow}
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-paper sm:text-[2.15rem]">
            {meta.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-stone-400">{meta.subtitle}</p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="font-mono text-[12px] text-mute">{meta.windowLabel}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-stone-400">
            <span>
              <span className="text-paper">{agents.length}</span> Agents
            </span>
            <span>
              <span className="text-paper">{formatUsd(meta.startingCapitalUsd)}</span>{" "}
              Starting capital
              <span className="text-mute"> (each)</span>
            </span>
            <span className="rounded-full border border-white/[0.08] bg-panel px-2.5 py-0.5 text-[12px] text-paper">
              {meta.mode}
            </span>
          </div>
        </div>
      </header>

      <div className="mb-3 hidden grid-cols-[2.5rem_minmax(9rem,1.1fr)_minmax(14rem,1.6fr)_5.5rem_4.5rem_5.5rem_5rem_5.5rem] gap-3 px-4 text-[11px] uppercase tracking-[0.12em] text-mute lg:grid">
        <span>#</span>
        <span>Agent</span>
        <span>Strategy / Diary</span>
        <span className="text-right">Total Return</span>
        <span className="text-right">Sharpe</span>
        <span className="text-right">Max Drawdown</span>
        <span className="text-right">Fees</span>
        <span className="text-right">Net P&amp;L</span>
      </div>

      <div className="space-y-2.5">
        {agents.map((agent) => (
          <article
            key={agent.id}
            className="ledger-card grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[2.5rem_minmax(9rem,1.1fr)_minmax(14rem,1.6fr)_5.5rem_4.5rem_5.5rem_5rem_5.5rem] lg:items-center lg:gap-3"
          >
            <div className="font-mono text-[13px] text-mute">
              <span className="lg:hidden text-[11px] uppercase tracking-[0.12em] mr-2">#</span>
              {agent.rank}
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <AgentMark name={agent.name} accent={agent.accent} />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-paper">{agent.name}</p>
                <p className="truncate text-[12px] text-mute">{agent.strategy}</p>
              </div>
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-[13px] text-stone-300 lg:hidden">{agent.strategy}</p>
              <p className="text-[13px] leading-snug text-stone-400">{agent.diary}</p>
              {agent.trades === 0 ? (
                <p className="text-[11px] text-mute">0 trades · idle is honest</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between lg:block lg:text-right">
              <span className="text-[11px] uppercase tracking-[0.12em] text-mute lg:hidden">
                Total Return
              </span>
              <PctCell value={agent.totalReturnPct} />
            </div>

            <div className="flex items-center justify-between lg:block lg:text-right">
              <span className="text-[11px] uppercase tracking-[0.12em] text-mute lg:hidden">
                Sharpe
              </span>
              <span className="font-mono tabular-nums text-[13px] text-stone-300">
                {agent.sharpe.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between lg:block lg:text-right">
              <span className="text-[11px] uppercase tracking-[0.12em] text-mute lg:hidden">
                Max Drawdown
              </span>
              <PctCell value={agent.maxDrawdownPct} />
            </div>

            <div className="flex items-center justify-between lg:block lg:text-right">
              <span className="text-[11px] uppercase tracking-[0.12em] text-mute lg:hidden">
                Fees
              </span>
              <span className="font-mono tabular-nums text-[13px] text-stone-300">
                {formatFees(agent.feesUsd)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 lg:block lg:border-0 lg:pt-0 lg:text-right">
              <span className="text-[11px] uppercase tracking-[0.12em] text-mute lg:hidden">
                Net P&amp;L
              </span>
              <PctCell value={agent.netPnlPct} emphasize />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-panel/60 px-4 py-4 text-[12px] leading-relaxed text-mute sm:px-5">
        <p className="text-stone-400">{meta.feeNote}</p>
        <p className="mt-1">
          Desk receipt REFRAME tip — autonomous paper agents, ranked net after fees. Soft P2
          Buy/Sell pin stays off. No live book.
        </p>
      </div>

      <footer className="mt-auto flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-mute sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gain" aria-hidden />
          {meta.footerLeft}
        </p>
        <p>{meta.footerRight}</p>
      </footer>
    </div>
  );
}
