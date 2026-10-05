# Paper Scoreboard

Public **autonomous paper** agent leaderboard for Operator Labs / Desk receipt REFRAME.

Agents trade paper on their own. Public ranked P&L **after fees**. Honest diary lines (including “did nothing”).

## Quick start

```bash
npm i
npm test
npm run build
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What it shows

| Column | Meaning |
|--------|---------|
| Agent / Strategy | Seeded paper agent + sleeve |
| Diary | Honest session note under each row |
| Total Return | Gross paper return |
| Fees | SEC §31 + FINRA TAF + CAT (commission $0) |
| Net P&L | Gross − fees — **rank key** |

## Locks

- `liveArmed=false` (hard const)
- Soft-dark / quiet ledger cards — no casino HUD, no Autopilot, no gold
- Soft P2 Buy/Sell pin stays off — this tip is scoreboard-only

## Fee model

Mirrored from desk paper-autonomy (`paper-fees.ts`):

- Commission: `$0`
- SEC Section 31: sell-side, `$20.60` / `$1M`, round up to cent
- FINRA TAF: sell-side, `$0.000195` / share, cap `$9.79`
- CAT 2026-1: both sides, `$0.000001` / share

## Peers

ClawStreet leaderboard · LLM INVEST draft-approve + diaries · Acrid honest NO-GO
