import { Compass } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { difficultyLabels } from "@/modules/journeys/components/journey-difficulty-badge";
import { JourneyCard } from "@/modules/journeys/components/journey-card";
import { fetchHomepage } from "@/modules/recommendations/services/recommendations-api";

export default async function Home() {
  const homepage = await fetchHomepage();
  const isEmpty = homepage.featured.length === 0 && homepage.categories.length === 0;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 space-y-16 p-8">
      <div className="space-y-2 py-12 text-center">
        <h1 className="text-h1 text-balance font-bold">Rabbit Hole</h1>
        <p className="text-body-lg text-muted-foreground">
          Follow your curiosity, one journey at a time.
        </p>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={Compass}
          title="No journeys published yet"
          description="Check back soon."
        />
      ) : (
        <>
          {homepage.featured.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-h3 font-bold">Featured Journeys</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {homepage.featured.map((journey) => (
                  <JourneyCard key={journey.id} {...journey} />
                ))}
              </div>
            </section>
          ) : null}

          {homepage.categories.map((category) => (
            <section key={category.difficulty} className="space-y-4">
              <h2 className="text-h3 font-bold">{difficultyLabels[category.difficulty]}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.journeys.map((journey) => (
                  <JourneyCard key={journey.id} {...journey} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
