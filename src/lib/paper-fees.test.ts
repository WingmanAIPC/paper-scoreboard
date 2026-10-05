import assert from "node:assert/strict";
import {
  netPaperPnl,
  paperFeesForFill,
  paperRoundTripFees,
  PAPER_COMMISSION_USD,
} from "./paper-fees";

function run() {
  assert.equal(PAPER_COMMISSION_USD, 0);

  const buy = paperFeesForFill("BUY", 100, 10_000);
  assert.equal(buy.commissionUsd, 0);
  assert.equal(buy.secUsd, 0);
  assert.equal(buy.finraTafUsd, 0);
  assert.ok(buy.catUsd >= 0);

  const sell = paperFeesForFill("SELL", 100, 10_000);
  assert.ok(sell.secUsd > 0);
  assert.ok(sell.finraTafUsd > 0);
  assert.ok(sell.totalUsd > buy.totalUsd);

  const rt = paperRoundTripFees("BUY", 50, 5_000, 5_200);
  assert.equal(rt.commissionUsd, 0);
  assert.ok(rt.totalUsd > 0);

  assert.equal(netPaperPnl(100, 12.34), 87.66);
  assert.equal(netPaperPnl(null, 1), null);

  console.log("paper-fees.test.ts: ok");
}

run();
