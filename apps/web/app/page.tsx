import { Compass } from "lucide-react";
import Form from "next/form";
import { headers } from "next/headers";

import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { difficultyLabels } from "@/modules/journeys/components/journey-difficulty-badge";
import { JourneyCard } from "@/modules/journeys/components/journey-card";
import { ContinueLearningSection } from "@/modules/progress/components/continue-learning-section";
import { fetchContinueLearning } from "@/modules/progress/services/progress-api";
import { fetchHomepage } from "@/modules/recommendations/services/recommendations-api";
import { RopeResumptionBanner } from "@/modules/rope/components/rope-resumption-banner";

export default async function Home() {
  const cookie = (await headers()).get("cookie") ?? "";
  const [homepage, continueLearning] = await Promise.all([
    fetchHomepage(),
    fetchContinueLearning(cookie),
  ]);
  const isEmpty = homepage.featured.length === 0 && homepage.categories.length === 0;
  const trailCount =
    homepage.featured.length +
    homepage.categories.reduce((sum, category) => sum + category.journeys.length, 0);

  let cardIndex = 0;

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-drift absolute -top-[30%] -left-[15%] size-[90vw] rounded-full bg-[radial-gradient(circle,rgba(124,77,255,0.28)_0%,rgba(124,77,255,0)_65%)] blur-3xl" />
        <div className="absolute -right-[20%] -bottom-[35%] size-[80vw] animate-drift rounded-full bg-[radial-gradient(circle,rgba(244,180,0,0.16)_0%,rgba(244,180,0,0)_62%)] blur-3xl [animation-duration:34s]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
          {trailCount > 0 ? (
            <span className="flex items-center gap-2.5 rounded-full border border-gold-300/35 bg-gold-500/10 px-4 py-1.5">
              <span className="size-1.5 animate-glow rounded-full bg-gold-500" />
              <span className="font-mono text-kicker tracking-[0.1em] text-gold-300 uppercase">
                {trailCount} {trailCount === 1 ? "way" : "ways"} down · pick one
              </span>
            </span>
          ) : null}
          <h1 className="text-hero text-balance font-serif leading-[1.02] text-white">
            Every question is a door.
            <br />
            <span className="text-gold-300 italic">Go on, open one.</span>
          </h1>
          <p className="max-w-xl text-body-lg text-balance text-violet-200">
            You will not be taught. You will be led somewhere strange, one small wonder at a
            time — and a rope keeps track of the way back.
          </p>
          <Form
            action="/search"
            className="mt-2 flex w-full max-w-xl items-center gap-3 rounded-full border border-border bg-white/5 py-2 pr-2 pl-5.5"
          >
            <Input
              type="search"
              name="q"
              placeholder="Ask anything… why does time bend?"
              aria-label="Ask Rabbit Hole anything"
              className="h-auto border-none bg-transparent px-0 py-2.5 text-body shadow-none placeholder:text-ink-muted focus-visible:ring-0"
            />
            <button
              type="submit"
              className="flex min-h-11 shrink-0 items-center rounded-full bg-gradient-to-b from-violet-400 to-violet-500 px-6.5 text-small font-semibold whitespace-nowrap text-white shadow-primary transition-transform duration-200 ease-out hover-fine:hover:-translate-y-0.5"
            >
              Set off
            </button>
          </Form>
        </div>

        {isEmpty ? (
          <EmptyState
            icon={Compass}
            title="No trails published yet"
            description="Check back soon."
          />
        ) : (
          <div className="flex flex-col gap-10">
            <ContinueLearningSection items={continueLearning} />

            {homepage.featured.length > 0 ? (
              <section className="flex flex-col gap-5">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h2 className="font-serif text-section-head text-parchment">
                    Trails worth taking
                  </h2>
                  <span className="font-mono text-kicker tracking-[0.1em] text-ink-muted uppercase">
                    Chosen by depth, not popularity
                  </span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {homepage.featured.map((journey) => (
                    <JourneyCard key={journey.id} {...journey} lit={cardIndex++ === 0} />
                  ))}
                </div>
              </section>
            ) : null}

            {homepage.categories.map((category) => (
              <section key={category.difficulty} className="flex flex-col gap-5">
                <h2 className="font-serif text-section-head text-parchment">
                  {difficultyLabels[category.difficulty]} descents
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {category.journeys.map((journey) => (
                    <JourneyCard key={journey.id} {...journey} lit={cardIndex++ === 0} />
                  ))}
                </div>
              </section>
            ))}

            <RopeResumptionBanner />
          </div>
        )}
      </div>
    </div>
  );
}
