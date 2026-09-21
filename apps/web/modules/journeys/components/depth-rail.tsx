import Link from "next/link";

import type { PublicJourneyNodeSummary } from "../types/journey";

interface DepthRailProps {
  journeySlug: string;
  journeyTitle: string;
  nodes: PublicJourneyNodeSummary[];
  currentPosition: number;
}

export function DepthRail({ journeySlug, journeyTitle, nodes, currentPosition }: DepthRailProps) {
  const total = nodes.length;
  const progressPct = total > 0 ? Math.round((currentPosition / total) * 100) : 0;

  return (
    <div className="sticky top-6 hidden w-52.5 shrink-0 flex-col gap-3.5 self-start pt-6 lg:flex">
      <span className="font-mono text-kicker tracking-[0.14em] text-ink-muted uppercase">
        The main trail
      </span>
      <span className="font-serif text-[1.625rem] leading-[1.15] text-parchment">
        {journeyTitle}
      </span>
      <ol className="mt-2 flex flex-col">
        {nodes.map((node) => {
          const position = node.order + 1;
          const isHere = position === currentPosition;
          const isWalked = position < currentPosition;
          const isLast = position === total;

          return (
            <li key={node.id} className="flex gap-3.5">
              <div className="flex w-3.5 flex-col items-center pt-1.5">
                <span
                  className={
                    isHere
                      ? "size-2.5 shrink-0 rounded-full bg-gold-500 shadow-[0_0_0_5px_rgba(244,180,0,0.22)]"
                      : isWalked
                        ? "size-2.5 shrink-0 rounded-full bg-violet-400"
                        : "size-2.5 shrink-0 rounded-full bg-violet-300/28"
                  }
                />
                {!isLast ? (
                  <span
                    className={
                      isWalked || isHere
                        ? "w-0.5 flex-1 bg-violet-400/55"
                        : "w-0.5 flex-1 bg-violet-300/16"
                    }
                  />
                ) : null}
              </div>
              {isHere ? (
                <span className="pb-5.5 text-small leading-normal text-white">{node.title}</span>
              ) : (
                <Link
                  href={`/journeys/${journeySlug}/${position}`}
                  className={
                    isWalked
                      ? "pb-5.5 text-small leading-normal text-violet-300 hover:text-gold-300"
                      : "pb-5.5 text-small leading-normal text-ink-ahead hover:text-gold-300"
                  }
                >
                  {node.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-2.5 font-mono text-kicker tracking-[0.1em] text-ink-muted uppercase">
        <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-violet-300/20">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-gold-300 transition-[width] duration-[420ms]"
            style={{ width: `${progressPct}%` }}
          />
        </span>
        Depth {currentPosition}/{total}
      </div>
    </div>
  );
}
