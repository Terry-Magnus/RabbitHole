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
    <div className="space-y-2 border-t border-border pt-6">
      <p className="text-small font-medium text-muted-foreground">Keep exploring</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={`/journeys/${link.journey.slug}`}
              onClick={() => addStop(currentLocation)}
              className="block rounded-md border border-border px-4 py-3 transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--color-discovery),0_0_16px_-4px_var(--color-discovery)]"
            >
              <p className="text-body font-medium text-foreground">
                {link.label ?? link.journey.title}
              </p>
              <p className="text-caption text-muted-foreground">
                {link.label
                  ? `${link.journey.title} · ${difficultyLabels[link.journey.difficulty]}`
                  : difficultyLabels[link.journey.difficulty]}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
