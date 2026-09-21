import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DiscoveryLinks } from "@/modules/discovery/components/discovery-links";
import { fetchNodeDiscoveryLinks } from "@/modules/discovery/services/discovery-links-api";
import { DepthRail } from "@/modules/journeys/components/depth-rail";
import { DepthThread } from "@/modules/journeys/components/depth-thread";
import { fetchPublicJourney } from "@/modules/journeys/services/journeys-api";
import { AhaReveal } from "@/modules/nodes/components/aha-reveal";
import { NodeSources } from "@/modules/nodes/components/node-sources";
import { fetchPublicNode } from "@/modules/nodes/services/nodes-api";
import { ProgressRecorder } from "@/modules/progress/components/progress-recorder";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface NodeReadingPageProps {
  params: Promise<{ slug: string; position: string }>;
}

export default async function NodeReadingPage({ params }: NodeReadingPageProps) {
  const { slug, position } = await params;
  const positionNumber = Number(position);

  if (!Number.isInteger(positionNumber) || positionNumber < 1) {
    notFound();
  }

  const [result, journey] = await Promise.all([
    fetchPublicNode(slug, positionNumber),
    fetchPublicJourney(slug),
  ]);

  if (!result || !journey) {
    notFound();
  }

  const { node, totalNodes } = result;
  const discoveryLinks = await fetchNodeDiscoveryLinks(node.id);
  const isLast = positionNumber >= totalNodes;
  const nextHref = isLast
    ? `/journeys/${slug}/complete`
    : `/journeys/${slug}/${positionNumber + 1}`;
  const previousHref = positionNumber > 1 ? `/journeys/${slug}/${positionNumber - 1}` : null;

  return (
    <div className="relative overflow-hidden">
      <ProgressRecorder journeySlug={slug} nodePosition={positionNumber} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-drift absolute -top-[20%] -left-[10%] size-[70vw] rounded-full bg-[radial-gradient(circle,rgba(124,77,255,0.22)_0%,rgba(124,77,255,0)_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-5xl justify-center gap-14 px-4 pt-4 pb-28 sm:px-10 sm:pb-24">
        <DepthRail
          journeySlug={slug}
          journeyTitle={journey.title}
          nodes={journey.nodes}
          currentPosition={positionNumber}
        />

        <div className="flex w-full max-w-2xl flex-col gap-6 sm:gap-7">
          <DepthThread
            journeyTitle={journey.title}
            currentPosition={positionNumber}
            totalNodes={totalNodes}
          />

          <div className="animate-rise flex flex-col gap-5 rounded-3xl border border-border bg-[linear-gradient(168deg,rgba(255,255,255,0.075),rgba(49,23,111,0.35))] p-6.5 shadow-card sm:gap-6.5 sm:p-13">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-gold-300" />
              <span className="font-mono text-kicker tracking-[0.16em] text-gold-300 uppercase">
                Wonder {String(positionNumber).padStart(2, "0")}
              </span>
            </div>
            <h1 className="text-wonder-title text-balance font-serif leading-[1.08] text-white">
              {node.title}
            </h1>
            <div
              className="prose prose-invert max-w-none text-body-lg leading-relaxed text-violet-100 prose-headings:font-serif prose-headings:text-white prose-p:text-violet-100 prose-strong:text-white prose-a:text-violet-300 prose-blockquote:border-border prose-blockquote:text-violet-200"
              // Content is sanitized server-side (services/api/src/nodes/services/nodes.service.ts)
              // before it's ever stored — safe to render directly here.
              dangerouslySetInnerHTML={{ __html: node.content }}
            />
            {node.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- served from the API's own origin; next/image needs remotePatterns configured for that host
              <img src={`${API_URL}${node.imageUrl}`} alt="" className="w-full rounded-2xl border border-border" />
            ) : null}

            {node.ahaMoment ? <AhaReveal ahaMoment={node.ahaMoment} /> : null}

            <NodeSources sources={node.sources} />
          </div>

          {/* ≥sm: inline row. <sm: a fixed bottom bar (context/ui-context.md
              "Responsive" — back 52px, Onward flex, both ≥44px targets),
              with room reserved on the right for the Rope's floating
              trigger rather than fighting it for the same corner. */}
          <div className="hidden items-center justify-between gap-4 sm:flex">
            {previousHref ? (
              <Link
                href={previousHref}
                className="flex items-center gap-2.5 rounded-full border border-border-strong py-3.5 pr-6 pl-4.5 text-ui-label font-medium text-violet-300 transition-colors duration-150 hover:bg-surface-hover"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />A step back
              </Link>
            ) : (
              <span />
            )}
            <Link
              href={nextHref}
              className="flex items-center gap-3 rounded-full bg-gradient-to-b from-violet-400 to-violet-500 px-8 py-4 text-ui-label font-semibold text-white shadow-primary transition-transform duration-200 ease-out hover-fine:hover:-translate-y-0.5"
            >
              {isLast ? "Onward, out the other side" : "Onward"}
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-10 flex items-center gap-3 border-t border-border bg-night-700/95 py-3 pr-22 pl-4 backdrop-blur sm:hidden">
            {previousHref ? (
              <Link
                href={previousHref}
                aria-label="A step back"
                className="flex size-13 shrink-0 items-center justify-center rounded-2xl border border-border-strong text-violet-300"
              >
                <ArrowLeft className="size-4.5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="size-13 shrink-0" />
            )}
            <Link
              href={nextHref}
              className="flex min-h-13 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-violet-400 to-violet-500 text-ui-label font-semibold text-white shadow-primary"
            >
              {/* Shorter than the desktop "Onward, out the other side" — the
                  52px mobile bar doesn't have room for it; the Summit
                  screen itself carries that beat instead. */}
              Onward
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </Link>
          </div>

          <DiscoveryLinks
            links={discoveryLinks}
            currentLocation={{
              journeySlug: slug,
              journeyTitle: journey.title,
              nodePosition: positionNumber,
              nodeTitle: node.title,
            }}
          />
        </div>
      </div>
    </div>
  );
}
