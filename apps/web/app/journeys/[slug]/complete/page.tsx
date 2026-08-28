import { Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JourneyCard } from "@/modules/journeys/components/journey-card";
import { fetchPublicJourney } from "@/modules/journeys/services/journeys-api";
import { fetchRelatedJourney } from "@/modules/recommendations/services/recommendations-api";

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
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <Check
        className="size-8 text-primary motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-300"
        aria-hidden="true"
      />
      <h1 className="text-h2 text-balance font-bold">You completed {journey.title}</h1>
      <Link
        href={`/journeys/${journey.slug}`}
        className="text-body text-muted-foreground hover:text-foreground hover:underline"
      >
        View journey overview
      </Link>
      {related ? (
        <div className="w-full max-w-xs space-y-3 pt-8 text-left">
          <p className="text-small font-medium text-muted-foreground">Up next</p>
          <JourneyCard {...related} />
        </div>
      ) : null}
    </div>
  );
}
