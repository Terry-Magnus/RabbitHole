import { Badge } from "@/components/ui/badge";
import type { JourneyDifficulty } from "../types/journey";

export const difficultyLabels: Record<JourneyDifficulty, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export function JourneyDifficultyBadge({ difficulty }: { difficulty: JourneyDifficulty }) {
  return <Badge variant="outline">{difficultyLabels[difficulty]}</Badge>;
}
