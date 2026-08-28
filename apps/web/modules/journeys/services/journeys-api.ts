import type {
  CreateJourneyInput,
  Journey,
  PublicJourney,
  UpdateJourneyInput,
} from "../types/journey";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message = Array.isArray(body)
      ? (body[0] as { message?: string } | undefined)?.message
      : (body as { message?: string } | null)?.message;
    throw new Error(message ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchJourneys(): Promise<Journey[]> {
  return request<Journey[]>("/journeys");
}

export function fetchJourney(id: string): Promise<Journey> {
  return request<Journey>(`/journeys/${id}`);
}

export function createJourney(input: CreateJourneyInput): Promise<Journey> {
  return request<Journey>("/journeys", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateJourney(id: string, input: UpdateJourneyInput): Promise<Journey> {
  return request<Journey>(`/journeys/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function publishJourney(id: string): Promise<Journey> {
  return request<Journey>(`/journeys/${id}/publish`, { method: "POST" });
}

export function archiveJourney(id: string): Promise<Journey> {
  return request<Journey>(`/journeys/${id}/archive`, { method: "POST" });
}

export function featureJourney(id: string): Promise<Journey> {
  return request<Journey>(`/journeys/${id}/feature`, { method: "POST" });
}

export function unfeatureJourney(id: string): Promise<Journey> {
  return request<Journey>(`/journeys/${id}/unfeature`, { method: "POST" });
}

// Public reader fetches (Server Components — see app/journeys/*). These
// return null on 404 rather than throwing, so the calling page can call
// Next's notFound() itself; a genuine non-404 failure still throws, since
// that should surface as a real error, not a "page doesn't exist" state.

export async function fetchPublicJourney(slug: string): Promise<PublicJourney | null> {
  const response = await fetch(`${API_URL}/public/journeys/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<PublicJourney>;
}

export async function fetchRandomPublicJourney(): Promise<Journey | null> {
  const response = await fetch(`${API_URL}/public/journeys/random`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<Journey>;
}
