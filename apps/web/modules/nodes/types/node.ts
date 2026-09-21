export interface JourneyNode {
  id: string;
  journeyId: string;
  title: string;
  content: string;
  // The reveal-on-demand payoff line ("the penny that drops") — optional;
  // a node with none set simply skips the reveal prompt on the reading page.
  ahaMoment: string | null;
  order: number;
  imageUrl: string | null;
  imageKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNodeInput {
  title: string;
  content: string;
  ahaMoment?: string | null;
}

export type UpdateNodeInput = Partial<CreateNodeInput>;

export interface Source {
  id: string;
  nodeId: string;
  label: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// GET /journeys/:journeyId/nodes/:id includes sources; the list endpoint
// (GET /journeys/:journeyId/nodes) doesn't — same JourneyNode/
// JourneyNodeWithSources split the backend uses.
export interface JourneyNodeWithSources extends JourneyNode {
  sources: Source[];
}

export interface CreateSourceInput {
  label: string;
  url: string;
}

export type UpdateSourceInput = Partial<CreateSourceInput>;

// GET /public/journeys/:slug/nodes/:position
export interface PublicNodeResponse {
  node: JourneyNodeWithSources;
  journeyTitle: string;
  journeySlug: string;
  totalNodes: number;
}
