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
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-7 px-6 py-24 text-center">
      <h1 className="text-wonder-title text-balance font-serif leading-[1.08] text-white">
        There&apos;s no trail down there.
      </h1>
      {suggestion ? (
        <div className="flex flex-col items-center gap-1.5">
          <p className="font-mono text-kicker tracking-[0.12em] text-ink-muted uppercase">
            Try this instead
          </p>
          <Link
            href={`/journeys/${suggestion.slug}`}
            className="font-serif text-trail-name text-white hover:text-gold-300"
          >
            {suggestion.title}
          </Link>
          <p className="font-mono text-kicker tracking-widest text-ink-muted uppercase">
            {difficultyLabels[suggestion.difficulty]}
          </p>
        </div>
      ) : null}
    </div>
  );
}
