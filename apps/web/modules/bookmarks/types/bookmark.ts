import type { JourneyDifficulty } from "@/modules/journeys/types/journey";

export interface BookmarkedJourney {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
}
