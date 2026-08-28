import Link from "next/link";

import { difficultyLabels } from "@/modules/journeys/components/journey-difficulty-badge";
import { fetchRandomPublicJourney } from "@/modules/journeys/services/journeys-api";

// Catches notFound() calls from every route under app/journeys/ (landing,
// reading, completion pages) — one shared 404, not a per-route custom page.
// Never explains *why* the lookup failed (draft vs. archived vs. never
// existed vs. bad position) — same "indistinguishable from doesn't exist"
// reasoning as the rest of this unit.
export default async function JourneysNotFound() {
  const suggestion = await fetchRandomPublicJourney();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-h2 text-balance font-bold">We couldn&apos;t find that journey.</h1>
      {suggestion ? (
        <div className="space-y-1">
          <p className="text-small text-muted-foreground">Try this instead:</p>
          <Link
            href={`/journeys/${suggestion.slug}`}
            className="text-h5 font-bold text-foreground hover:text-primary"
          >
            {suggestion.title}
          </Link>
          <p className="text-caption text-muted-foreground">
            {difficultyLabels[suggestion.difficulty]}
          </p>
        </div>
      ) : null}
    </div>
  );
}
