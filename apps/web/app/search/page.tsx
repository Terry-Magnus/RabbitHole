import { Compass } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { JourneyCard } from "@/modules/journeys/components/journey-card";
import { fetchSearchResults } from "@/modules/search/services/search-api";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim();

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-8">
      {!query ? (
        <EmptyState
          icon={Compass}
          title="Search Rabbit Hole"
          description="Enter a topic to find a journey."
        />
      ) : (
        <SearchResults query={query} />
      )}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const results = await fetchSearchResults(query);

  return (
    <>
      <h1 className="text-h3 font-bold">Results for &quot;{query}&quot;</h1>
      {results.length === 0 ? (
        <EmptyState
          icon={Compass}
          title={`No journeys matched "${query}"`}
          description="Try a different topic or word."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <JourneyCard key={result.id} {...result} />
          ))}
        </div>
      )}
    </>
  );
}
