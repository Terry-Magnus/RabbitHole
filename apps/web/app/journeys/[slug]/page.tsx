import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { BookmarkButton } from "@/modules/bookmarks/components/bookmark-button";
import { fetchIsBookmarked } from "@/modules/bookmarks/services/bookmarks-api";
import { difficultyLabels } from "@/modules/journeys/components/journey-difficulty-badge";
import { fetchPublicJourney } from "@/modules/journeys/services/journeys-api";

interface JourneyLandingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function JourneyLandingPage({ params }: JourneyLandingPageProps) {
  const { slug } = await params;
  const cookie = (await headers()).get("cookie") ?? "";
  const [journey, isBookmarked] = await Promise.all([
    fetchPublicJourney(slug),
    fetchIsBookmarked(slug, cookie),
  ]);

  if (!journey) {
    notFound();
  }

  const hasNodes = journey.nodes.length > 0;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-drift absolute -top-[25%] left-1/2 size-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,77,255,0.26)_0%,rgba(124,77,255,0)_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-6 py-24 text-center sm:px-10">
        <span className="font-mono text-kicker tracking-[0.14em] text-gold-300 uppercase">
          {difficultyLabels[journey.difficulty]} · {journey.estimatedMinutes} min down ·{" "}
          {journey.nodes.length} {journey.nodes.length === 1 ? "wonder" : "wonders"}
        </span>
        <h1 className="text-summit-title text-balance font-serif leading-[1.06] text-white">
          {journey.title}
        </h1>
        <p className="text-body-lg leading-relaxed text-violet-200">{journey.description}</p>
        {hasNodes ? (
          <div className="mt-2 flex items-center gap-3">
            <Link
              href={`/journeys/${journey.slug}/1`}
              className="flex items-center gap-3 rounded-full bg-gradient-to-b from-violet-400 to-violet-500 px-9 py-4.5 text-ui-label font-semibold text-white shadow-primary transition-transform duration-200 ease-out hover-fine:hover:-translate-y-0.5"
            >
              Descend
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </Link>
            <BookmarkButton journeySlug={journey.slug} initialBookmarked={isBookmarked} />
          </div>
        ) : (
          <EmptyState icon={Compass} title="This trail isn't lit yet." />
        )}
      </div>
    </div>
  );
}
