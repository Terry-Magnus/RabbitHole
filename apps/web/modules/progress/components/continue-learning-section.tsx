import { ProgressJourneyCard } from "./progress-journey-card";
import type { ProgressJourneySummary } from "../types/progress";

interface ContinueLearningSectionProps {
  items: ProgressJourneySummary[];
}

// Homepage-only teaser: a signed-in user's most recently touched journeys
// (in progress and completed, mixed — see context/specs/13-learning-progress.md),
// capped server-side at 6. Renders nothing for a guest or a signed-in user
// with no progress yet — same "omit when there's nothing to show" rule
// every other homepage section already follows.
export function ContinueLearningSection({ items }: ContinueLearningSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-serif text-section-head text-parchment">Continue learning</h2>
        <span className="font-mono text-kicker tracking-[0.1em] text-ink-muted uppercase">
          Pick up where you left off
        </span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ProgressJourneyCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
