import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { difficultyLabels } from "@/modules/journeys/components/journey-difficulty-badge";
import { fetchPublicJourney } from "@/modules/journeys/services/journeys-api";
import { ProgressCompleter } from "@/modules/progress/components/progress-completer";
import { fetchRelatedJourney } from "@/modules/recommendations/services/recommendations-api";
import { SeeTheRopeLink } from "@/modules/rope/components/see-the-rope-link";
import { SummitTally } from "@/modules/rope/components/summit-tally";

interface JourneyCompletePageProps {
  params: Promise<{ slug: string }>;
}

export default async function JourneyCompletePage({ params }: JourneyCompletePageProps) {
  const { slug } = await params;
  const journey = await fetchPublicJourney(slug);

  if (!journey) {
    notFound();
  }

  const related = await fetchRelatedJourney(slug);

  return (
    <div className="relative overflow-hidden">
      <ProgressCompleter journeySlug={slug} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-drift absolute -top-[25%] left-1/2 size-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,180,0,0.2)_0%,rgba(244,180,0,0)_62%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-18 text-center sm:px-10">
        <div className="animate-pop flex flex-col items-center gap-6">
          <span
            className="size-18.5 animate-lantern rounded-full bg-[radial-gradient(circle_at_32%_30%,#FFE08A,#F4B400_58%,#B37400)] shadow-lantern"
            aria-hidden="true"
          />
          <span className="font-mono text-kicker tracking-[0.18em] text-gold-300 uppercase">
            You came out the other side
          </span>
          <h1 className="text-summit-title text-balance font-serif leading-[1.05] text-white">
            You know {journey.title.charAt(0).toLowerCase() + journey.title.slice(1)}
          </h1>
          <p className="text-body-lg leading-relaxed text-violet-200">
            {journey.nodes.length} {journey.nodes.length === 1 ? "wonder" : "wonders"},{" "}
            {difficultyLabels[journey.difficulty].toLowerCase()} depth. Yesterday this was
            unfamiliar; tonight it&apos;s something you can explain over dinner.
          </p>
        </div>

        <SummitTally journeySlug={slug} estimatedMinutes={journey.estimatedMinutes} />

        {related ? (
          <Link
            href={`/journeys/${related.slug}`}
            className="animate-rise flex w-full max-w-xl flex-col gap-3.5 rounded-3xl border border-gold-300/45 bg-gradient-to-br from-gold-500/16 to-violet-900/50 p-8 text-left transition-[transform,box-shadow] duration-220 ease-(--ease-responsive) hover-fine:hover:-translate-y-1 hover-fine:hover:shadow-gold"
          >
            <span className="font-mono text-kicker tracking-[0.16em] text-gold-300 uppercase">
              One door left ajar
            </span>
            <span className="font-serif text-[2.5rem] leading-[1.08] text-white">
              {related.title}
            </span>
            <span className="text-small leading-relaxed text-violet-100">
              {related.description}
            </span>
            <span className="flex items-center gap-2.5 pt-1.5 text-small font-semibold text-gold-300">
              Open it
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        ) : null}

        <SeeTheRopeLink />

        <Link href="/" className="text-small font-medium text-violet-300 hover:text-gold-300">
          Back to the trailhead
        </Link>
      </div>
    </div>
  );
}
