"use client";

import Link from "next/link";

import { difficultyLabels } from "@/modules/journeys/components/journey-difficulty-badge";
import { useRopeStore } from "@/modules/rope/store/use-rope-store";
import type { RopeStop } from "@/modules/rope/types/rope";
import type { PublicDiscoveryLink } from "../types/discovery-link";

interface DiscoveryLinksProps {
  links: PublicDiscoveryLink[];
  currentLocation: Omit<RopeStop, "id">;
}

export function DiscoveryLinks({ links, currentLocation }: DiscoveryLinksProps) {
  const addStop = useRopeStore((state) => state.addStop);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4.5 pt-6">
      <div className="flex items-center gap-3">
        <span className="size-2 animate-glow rounded-full bg-gold-500" />
        <span className="font-mono text-kicker tracking-[0.16em] text-gold-300 uppercase">
          Paths off the trail — the rope holds your place
        </span>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.id}
            href={`/journeys/${link.journey.slug}`}
            onClick={() => addStop(currentLocation)}
            className="flex flex-col gap-2.5 rounded-xl border border-gold-300/28 bg-white/4.5 p-5.5 transition-[transform,border-color,box-shadow] duration-220 ease-(--ease-responsive) hover-fine:hover:-translate-y-1 hover:border-gold-300/75 hover:shadow-gold"
          >
            <span className="font-serif text-2xl leading-[1.15] text-white">
              {link.label ?? link.journey.title}
            </span>
            {link.label ? (
              <span className="text-small text-violet-200">{link.journey.title}</span>
            ) : null}
            <span className="font-mono text-kicker tracking-widest text-gold-300 uppercase">
              {difficultyLabels[link.journey.difficulty]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
