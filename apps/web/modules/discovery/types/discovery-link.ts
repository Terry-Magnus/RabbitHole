import type { JourneyDifficulty, JourneyStatus } from "@/modules/journeys/types/journey";

export interface DiscoveryLinkTargetJourney {
  id: string;
  slug: string;
  title: string;
  difficulty: JourneyDifficulty;
  status: JourneyStatus;
}

// GET/POST/PATCH /nodes/:nodeId/discovery-links (admin — every link,
// target's current status included so an admin can spot one that got
// archived after the link was created).
export interface DiscoveryLink {
  id: string;
  nodeId: string;
  label: string | null;
  targetJourney: DiscoveryLinkTargetJourney;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscoveryLinkInput {
  targetJourneyId: string;
  label?: string;
}

export interface UpdateDiscoveryLinkInput {
  targetJourneyId?: string;
  label?: string | null;
}

// GET /public/nodes/:nodeId/discovery-links — only currently-published
// targets. label is the raw custom label, or null if the admin left it
// blank — the reader-facing display falls back to journey.title itself.
export interface PublicDiscoveryLink {
  id: string;
  label: string | null;
  journey: {
    slug: string;
    title: string;
    difficulty: JourneyDifficulty;
  };
}
