interface DepthThreadProps {
  journeyTitle: string;
  currentPosition: number;
  totalNodes: number;
}

// Below `lg`, the vertical DepthRail has nowhere to live (context/ui-context.md
// "Responsive": "Rail collapses to a horizontal thread"). A slim progress
// line under the header, not a second full rail crammed sideways.
export function DepthThread({ journeyTitle, currentPosition, totalNodes }: DepthThreadProps) {
  const progressPct = totalNodes > 0 ? Math.round((currentPosition / totalNodes) * 100) : 0;

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate font-serif text-lg text-parchment">{journeyTitle}</span>
        <span className="shrink-0 font-mono text-kicker tracking-[0.12em] text-ink-muted uppercase">
          Depth {currentPosition}/{totalNodes}
        </span>
      </div>
      <span className="block h-0.75 overflow-hidden rounded-full bg-violet-300/18">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-gold-300 transition-[width] duration-[420ms] ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </span>
    </div>
  );
}
