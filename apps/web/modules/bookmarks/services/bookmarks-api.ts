import type { BookmarkedJourney } from "../types/bookmark";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Client-side mutations, called directly from the browser (BookmarkButton)
// with `credentials: "include"` — same direct-to-API pattern as Unit 13's
// recordNodeProgress.
export async function addBookmark(slug: string): Promise<void> {
  await fetch(`${API_URL}/bookmarks/journeys/${slug}`, {
    method: "POST",
    credentials: "include",
  });
}

export async function removeBookmark(slug: string): Promise<void> {
  await fetch(`${API_URL}/bookmarks/journeys/${slug}`, {
    method: "DELETE",
    credentials: "include",
  });
}

// Server Component fetches, forwarding the incoming request's Cookie header
// the same way app/admin/layout.tsx forwards it to get-session. Any
// non-200 response (no session, unpublished/unknown journey, anything
// else) resolves to a safe default rather than throwing — the page
// shouldn't break over this, and BookmarkButton already renders nothing
// for a guest regardless.
export async function fetchIsBookmarked(slug: string, cookie: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/bookmarks/journeys/${slug}`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!response.ok) {
    return false;
  }

  const { bookmarked } = (await response.json()) as { bookmarked: boolean };
  return bookmarked;
}

export async function fetchBookmarks(cookie: string): Promise<BookmarkedJourney[]> {
  const response = await fetch(`${API_URL}/bookmarks`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json() as Promise<BookmarkedJourney[]>;
}
