import type { Homepage, HomepageJourney } from "../types/homepage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server Component fetch (see app/page.tsx) — same cache: "no-store"
// approach as every other public read since Unit 6, for consistency.
export async function fetchHomepage(): Promise<Homepage> {
  const response = await fetch(`${API_URL}/public/homepage`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<Homepage>;
}

// Server Component fetch (see app/journeys/[slug]/complete/page.tsx).
// `related: null` is a valid response — it means no other published journey
// exists yet, not an error. The API wraps it in an object rather than
// returning a bare nullable body (a bare `null` return sends an empty HTTP
// body, not the JSON text "null" — confirmed directly against the API).
export async function fetchRelatedJourney(slug: string): Promise<HomepageJourney | null> {
  const response = await fetch(`${API_URL}/public/journeys/${slug}/related`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const { related } = (await response.json()) as { related: HomepageJourney | null };
  return related;
}
