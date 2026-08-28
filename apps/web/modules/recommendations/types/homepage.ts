import type { JourneyDifficulty } from "@/modules/journeys/types/journey";

export interface HomepageJourney {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
}

export interface HomepageCategory {
  difficulty: JourneyDifficulty;
  journeys: HomepageJourney[];
}

// GET /public/homepage
export interface Homepage {
  featured: HomepageJourney[];
  categories: HomepageCategory[];
}
