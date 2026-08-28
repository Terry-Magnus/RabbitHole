export type JourneyStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type JourneyDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Journey {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: JourneyDifficulty;
  status: JourneyStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJourneyInput {
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
  slug?: string;
}

export type UpdateJourneyInput = Partial<CreateJourneyInput>;

export interface PublicJourneyNodeSummary {
  id: string;
  title: string;
  order: number;
}

// GET /public/journeys/:slug — Journey plus a light node list (no content)
// and a server-computed reading time, only ever a PUBLISHED journey (see
// modules/journeys/services/journeys-api.ts). estimatedMinutes is computed
// backend-side specifically because this payload excludes node content —
// there's nothing here to run estimateReadingMinutes against client-side.
export interface PublicJourney extends Journey {
  nodes: PublicJourneyNodeSummary[];
  estimatedMinutes: number;
}
