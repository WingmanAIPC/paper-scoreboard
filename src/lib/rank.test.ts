import assert from "node:assert/strict";
import { rankAgents } from "./rank";
import { SEED_AGENTS } from "./seed";
import { LIVE_ARMED } from "./types";

function run() {
  assert.equal(LIVE_ARMED, false);

  const ranked = rankAgents(SEED_AGENTS);
  assert.equal(ranked.length, SEED_AGENTS.length);
  assert.equal(ranked[0].rank, 1);

  for (let i = 1; i < ranked.length; i++) {
    assert.ok(ranked[i - 1].netPnlUsd >= ranked[i].netPnlUsd);
  }

  for (const row of ranked) {
    const expectedNet = Math.round((row.grossPnlUsd - row.feesUsd) * 100) / 100;
    assert.equal(row.netPnlUsd, expectedNet);
  }

  const idleish = ranked.find((a) => a.id === "acre");
  assert.ok(idleish);
  assert.match(idleish!.diary.toLowerCase(), /did nothing|nothing/);

  // IronBridge fee drag should land below GreenTrail on net.
  const green = ranked.find((a) => a.id === "greentrail")!;
  const iron = ranked.find((a) => a.id === "ironbridge")!;
  assert.ok(green.netPnlUsd > iron.netPnlUsd);
  assert.ok(iron.feesUsd > green.feesUsd);

  console.log("rank.test.ts: ok");
}

run();
