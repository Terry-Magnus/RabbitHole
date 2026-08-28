import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DiscoveryLinks } from "@/modules/discovery/components/discovery-links";
import { fetchNodeDiscoveryLinks } from "@/modules/discovery/services/discovery-links-api";
import { fetchPublicNode } from "@/modules/nodes/services/nodes-api";

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

  const result = await fetchPublicNode(slug, positionNumber);

  if (!result) {
    notFound();
  }

  const { node, totalNodes } = result;
  const discoveryLinks = await fetchNodeDiscoveryLinks(node.id);
  const progressValue = (positionNumber / totalNodes) * 100;
  const isLast = positionNumber >= totalNodes;
  const nextHref = isLast
    ? `/journeys/${slug}/complete`
    : `/journeys/${slug}/${positionNumber + 1}`;
  const previousHref = positionNumber > 1 ? `/journeys/${slug}/${positionNumber - 1}` : null;

  return (
    <div className="flex flex-1 flex-col">
      <Progress
        value={progressValue}
        className="sticky top-14 z-[5] h-1 rounded-none bg-border"
      />
      <div className="mx-auto w-full max-w-2xl flex-1 space-y-8 p-8">
        <p className="text-caption font-medium tracking-wide text-muted-foreground uppercase">
          Step {positionNumber} of {totalNodes}
        </p>
        <h1 className="text-h2 text-balance font-bold">{node.title}</h1>
        <div
          className="prose prose-neutral max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary prose-blockquote:text-muted-foreground prose-blockquote:border-border"
          // Content is sanitized server-side (services/api/src/nodes/services/nodes.service.ts)
          // before it's ever stored — safe to render directly here.
          dangerouslySetInnerHTML={{ __html: node.content }}
        />
        {node.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- served from the API's own origin; next/image needs remotePatterns configured for that host
          <img src={`${API_URL}${node.imageUrl}`} alt="" className="w-full rounded-md ring-1 ring-border" />
        ) : null}
        {node.sources.length > 0 ? (
          <div className="space-y-2 border-t border-border pt-6">
            <p className="text-small font-medium text-muted-foreground">Sources</p>
            <ul className="space-y-1">
              {node.sources.map((source) => (
                <li key={source.id}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small text-foreground hover:underline"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex items-center justify-between pt-4">
          {previousHref ? (
            <Button asChild variant="ghost">
              <Link href={previousHref}>Previous</Link>
            </Button>
          ) : (
            <span />
          )}
          <Button asChild>
            <Link href={nextHref}>{isLast ? "Finish" : "Continue"}</Link>
          </Button>
        </div>
        <DiscoveryLinks
          links={discoveryLinks}
          currentLocation={{
            journeySlug: slug,
            journeyTitle: result.journeyTitle,
            nodePosition: positionNumber,
            nodeTitle: node.title,
          }}
        />
      </div>
    </div>
  );
}
