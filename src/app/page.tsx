import { Scoreboard } from "@/components/Scoreboard";
import { rankAgents } from "@/lib/rank";
import { SCOREBOARD_META, SEED_AGENTS } from "@/lib/seed";
import { LIVE_ARMED } from "@/lib/types";

export default function HomePage() {
  const agents = rankAgents(SEED_AGENTS);

  // Hard lock — never arm live from this tip surface.
  if (LIVE_ARMED !== false || SCOREBOARD_META.liveArmed !== false) {
    throw new Error("liveArmed must stay false on paper scoreboard");
  }

  return <Scoreboard meta={SCOREBOARD_META} agents={agents} />;
}
