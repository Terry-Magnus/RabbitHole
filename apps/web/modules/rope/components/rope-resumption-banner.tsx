"use client";

import Link from "next/link";

import { useRopeStore } from "../store/use-rope-store";

// Homepage-only: if the reader has stepped off a trail before, this is the
// one honest continuity cue on an otherwise stateless (no signed-in
// progress yet — that's Unit 13) homepage. Renders nothing with an empty
// Rope, matching every other "omit when there's nothing to show" surface
// in this app.
export function RopeResumptionBanner() {
  const stops = useRopeStore((state) => state.stops);
  const last = stops[stops.length - 1];

  if (!last) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-5 rounded-3xl border border-dashed border-gold-300/40 bg-gold-500/7 p-6">
      <span
        className="size-9.5 shrink-0 animate-lantern rounded-full bg-[radial-gradient(circle_at_32%_30%,#FFE08A,#F4B400_60%,#B37400)]"
        aria-hidden="true"
      />
      <div className="min-w-64 flex-1 space-y-0.5">
        <p className="text-body font-semibold text-white">
          You left a rope hanging in &ldquo;{last.journeyTitle}&rdquo;
        </p>
        <p className="text-small text-violet-200">Nothing has moved since you left.</p>
      </div>
      <Link
        href={`/journeys/${last.journeySlug}/${last.nodePosition}`}
        className="rounded-full border border-gold-300/60 bg-gold-300/16 px-5.5 py-3 text-small font-semibold whitespace-nowrap text-gold-300 transition-colors hover:bg-gold-300/28"
      >
        Pick up the rope
      </Link>
    </div>
  );
}
