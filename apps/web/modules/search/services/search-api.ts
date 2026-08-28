import type { SearchResult } from "../types/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server Component fetch (see app/search/page.tsx).
export async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  const response = await fetch(
    `${API_URL}/public/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<SearchResult[]>;
}
