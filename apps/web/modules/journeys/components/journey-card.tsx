import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { JourneyDifficulty } from "../types/journey";
import { JourneyDifficultyBadge } from "./journey-difficulty-badge";

interface JourneyCardProps {
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
}

export function JourneyCard({ slug, title, description, difficulty }: JourneyCardProps) {
  return (
    <Link href={`/journeys/${slug}`} className="block transition-opacity hover:opacity-80">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <JourneyDifficultyBadge difficulty={difficulty} />
        </CardContent>
      </Card>
    </Link>
  );
}
