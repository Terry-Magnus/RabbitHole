"use client";

import { useRopeStore } from "../store/use-rope-store";

interface SummitTallyProps {
  journeySlug: string;
  estimatedMinutes: number;
}

// "Detours taken" is a real, accurate count — not a guess — computed from
// the Rope's own record of every discovery link clicked while inside this
// journey. No backend aggregation needed for it.
export function SummitTally({ journeySlug, estimatedMinutes }: SummitTallyProps) {
  const stops = useRopeStore((state) => state.stops);
  const detoursTaken = stops.filter((stop) => stop.journeySlug === journeySlug).length;

  const stats: Array<{ value: string; label: string }> = [
    { value: `${estimatedMinutes}`, label: "Minutes down there" },
    { value: `${detoursTaken}`, label: detoursTaken === 1 ? "Detour taken" : "Detours taken" },
  ];

  return (
    <div className="animate-rise flex flex-wrap justify-center gap-3.5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-white/5 px-8.5 py-5 text-center"
        >
          <div className="font-serif text-stat-number text-white">{stat.value}</div>
          <div className="pt-1 font-mono text-kicker tracking-[0.1em] text-ink-muted uppercase">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
