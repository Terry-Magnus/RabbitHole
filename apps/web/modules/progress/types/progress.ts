import type { JourneyDifficulty } from "@/modules/journeys/types/journey";

export interface ProgressJourneySummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
  lastNodePosition: number;
  totalNodes: number;
  completed: boolean;
}
