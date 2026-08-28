import { Compass } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { difficultyLabels } from "@/modules/journeys/components/journey-difficulty-badge";
import { fetchPublicJourney } from "@/modules/journeys/services/journeys-api";

interface JourneyLandingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function JourneyLandingPage({ params }: JourneyLandingPageProps) {
  const { slug } = await params;
  const journey = await fetchPublicJourney(slug);

  if (!journey) {
    notFound();
  }

  const hasNodes = journey.nodes.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-caption font-medium tracking-wide text-muted-foreground uppercase">
        {difficultyLabels[journey.difficulty]} · {journey.estimatedMinutes} min ·{" "}
        {journey.nodes.length} steps
      </p>
      <h1 className="text-h1 text-balance font-bold">{journey.title}</h1>
      <p className="text-body-lg text-muted-foreground">{journey.description}</p>
      {hasNodes ? (
        <Button asChild size="lg">
          <Link href={`/journeys/${journey.slug}/1`}>Start Journey</Link>
        </Button>
      ) : (
        <EmptyState icon={Compass} title="This journey isn't ready yet." />
      )}
    </div>
  );
}
