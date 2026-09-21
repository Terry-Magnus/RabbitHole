import { JourneyCard } from "@/modules/journeys/components/journey-card";
import type { ProgressJourneySummary } from "../types/progress";

interface ProgressJourneyCardProps {
  item: ProgressJourneySummary;
  lit?: boolean;
}

// The one place that turns a ProgressJourneySummary into JourneyCard props
// — shared by the homepage's Continue Learning section and /library so the
// resume-vs-completed mapping only lives in one place.
export function ProgressJourneyCard({ item, lit = false }: ProgressJourneyCardProps) {
  const { slug, title, description, difficulty, lastNodePosition, totalNodes, completed } = item;

  return (
    <JourneyCard
      slug={slug}
      title={title}
      description={description}
      difficulty={difficulty}
      lit={lit}
      href={completed ? `/journeys/${slug}` : `/journeys/${slug}/${lastNodePosition}`}
      statusLabel={
        completed ? "Completed" : `Continue · Wonder ${lastNodePosition} of ${totalNodes}`
      }
    />
  );
}
