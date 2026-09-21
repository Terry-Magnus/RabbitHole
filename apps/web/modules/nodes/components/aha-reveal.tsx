"use client";

import { useState } from "react";

interface AhaRevealProps {
  ahaMoment: string;
}

// Renders nothing at all when a node has no ahaMoment set (see the caller) —
// there's no payoff to strike a match for.
export function AhaReveal({ ahaMoment }: AhaRevealProps) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return (
      <div className="animate-pop flex gap-4.5 rounded-2xl border border-gold-300/50 bg-gold-500/12 p-6">
        <span
          className="mt-0.5 size-6.5 shrink-0 rounded-full bg-[radial-gradient(circle_at_32%_30%,#FFE08A,#F4B400_60%,#B37400)] shadow-[0_0_24px_rgba(244,180,0,0.55)]"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-kicker tracking-[0.16em] text-gold-300 uppercase">
            The penny drops
          </span>
          <p className="text-body-lg text-white">{ahaMoment}</p>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="animate-shimmer flex items-center justify-center gap-3 rounded-2xl border border-gold-300/45 bg-[linear-gradient(100deg,rgba(244,180,0,0.06)_20%,rgba(255,224,138,0.28)_50%,rgba(244,180,0,0.06)_80%)] bg-[length:220%_100%] p-5"
    >
      <span className="animate-glow size-2.5 rounded-full bg-gold-500" />
      <span className="font-mono text-kicker tracking-[0.14em] text-gold-300 uppercase">
        Strike the match
      </span>
    </button>
  );
}
