import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { JourneyDifficulty } from "../types/journey";
import { difficultyLabels } from "./journey-difficulty-badge";

interface JourneyCardProps {
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
  // The first trail in a list gets the "lit" gradient treatment
  // (context/designs/Screen 01 Trailhead.dc.html) — every other card stays
  // quiet glass. Optional so this component still works anywhere a plain
  // card is enough (search results, the Summit's "Up next" suggestion).
  lit?: boolean;
  // Overrides the default `/journeys/${slug}` target — used by the
  // Continue Learning surfaces to link straight at a reader's last
  // recorded position instead of the journey's landing page.
  href?: string;
  // A short status kicker next to the difficulty label (e.g. "Continue ·
  // Wonder 3 of 7", "Completed") — omitted entirely when unset, so every
  // pre-existing usage of this card renders unchanged.
  statusLabel?: string;
}

export function JourneyCard({
  slug,
  title,
  description,
  difficulty,
  lit = false,
  href,
  statusLabel,
}: JourneyCardProps) {
  return (
    <Link
      href={href ?? `/journeys/${slug}`}
      className={cn(
        "group flex min-h-[220px] flex-col gap-4 rounded-2xl border p-7 transition-[transform,border-color,box-shadow] duration-240 ease-(--ease-responsive) hover-fine:hover:-translate-y-1.5",
        lit
          ? "border-violet-300/28 bg-gradient-to-br from-violet-500/28 to-violet-900/55 hover:border-gold-300/60 hover:shadow-[0_22px_60px_rgba(124,77,255,0.35)]"
          : "border-border bg-white/4 hover:border-gold-300/50",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-kicker tracking-[0.14em] text-gold-300 uppercase">
          {difficultyLabels[difficulty]}
        </span>
        {statusLabel ? (
          <span className="font-mono text-kicker tracking-[0.14em] text-violet-300 uppercase">
            {statusLabel}
          </span>
        ) : null}
      </div>
      <span className="font-serif text-[2.375rem] leading-[1.08] text-white">{title}</span>
      <p className="line-clamp-2 text-small leading-relaxed text-violet-100">{description}</p>
      <span className="mt-auto flex items-center gap-2 text-small font-semibold text-gold-300">
        Descend
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
