"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { authClient } from "@/modules/auth/lib/auth-client";
import { addBookmark, removeBookmark } from "../services/bookmarks-api";

interface BookmarkButtonProps {
  journeySlug: string;
  initialBookmarked: boolean;
}

// Invisible to guests — same "omit entirely" convention as the Rope
// resumption banner, the homepage's Continue Learning section, and the
// Navbar's Library link. `initialBookmarked` comes from a server-side,
// cookie-forwarded fetch (see app/journeys/[slug]/page.tsx), so the button
// is correct on first paint rather than flashing an unbookmarked state
// while a client-side check resolves.
export function BookmarkButton({ journeySlug, initialBookmarked }: BookmarkButtonProps) {
  const { data: session } = authClient.useSession();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  if (!session) {
    return null;
  }

  function handleClick() {
    const next = !bookmarked;
    setBookmarked(next);
    void (next ? addBookmark(journeySlug) : removeBookmark(journeySlug));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this journey"}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
        bookmarked
          ? "border-gold-300/60 bg-gold-300/16 text-gold-300"
          : "border-border-strong text-violet-300 hover:bg-surface-hover",
      )}
    >
      {bookmarked ? (
        <BookmarkCheck className="size-4.5" aria-hidden="true" />
      ) : (
        <Bookmark className="size-4.5" aria-hidden="true" />
      )}
    </button>
  );
}
