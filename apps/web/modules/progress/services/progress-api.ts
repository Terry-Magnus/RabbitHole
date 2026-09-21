import type { ProgressJourneySummary } from "../types/progress";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Client-side mutations, called directly from the browser (ProgressRecorder,
// ProgressCompleter) rather than through a Next.js route. `credentials:
// "include"` sends the Better Auth session cookie cross-origin — the same
// pattern `authClient` already relies on, backed by main.ts's
// `credentials: true` CORS config (see context/specs/12-authentication.md).
export async function recordNodeProgress(slug: string, nodePosition: number): Promise<void> {
  await fetch(`${API_URL}/progress/journeys/${slug}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodePosition }),
  });
}

export async function markJourneyComplete(slug: string): Promise<void> {
  await fetch(`${API_URL}/progress/journeys/${slug}/complete`, {
    method: "POST",
    credentials: "include",
  });
}

// Server Component fetches (app/page.tsx, app/library/page.tsx), forwarding
// the incoming request's Cookie header the same way app/admin/layout.tsx
// forwards it to get-session. Any non-200 response (no session, or anything
// else) is treated as "nothing to show" rather than an error — there's
// nothing actionable a guest or a failed request should do differently here.
async function fetchProgressList(path: string, cookie: string): Promise<ProgressJourneySummary[]> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json() as Promise<ProgressJourneySummary[]>;
}

export function fetchContinueLearning(cookie: string): Promise<ProgressJourneySummary[]> {
  return fetchProgressList("/progress/continue-learning", cookie);
}

export function fetchLibrary(cookie: string): Promise<ProgressJourneySummary[]> {
  return fetchProgressList("/progress/library", cookie);
}
