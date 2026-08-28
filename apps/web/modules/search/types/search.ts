import type { JourneyDifficulty } from "@/modules/journeys/types/journey";

// GET /public/search?q=... — structurally identical to
// modules/recommendations/types/homepage.ts's HomepageJourney right now,
// but defined independently: search and homepage recommendations are
// different domains that happen to share a shape today, not a shared
// concept worth coupling the two modules over.
export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
}
