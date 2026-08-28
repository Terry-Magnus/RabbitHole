"use client";

import { Compass, Star } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JourneyStatusBadge } from "@/modules/journeys/components/journey-status-badge";
import {
  useArchiveJourney,
  useFeatureJourney,
  usePublishJourney,
  useUnfeatureJourney,
} from "@/modules/journeys/hooks/use-journey-mutations";
import { useJourneys } from "@/modules/journeys/hooks/use-journeys";
import type { JourneyStatus } from "@/modules/journeys/types/journey";

function JourneyRowActions({
  id,
  status,
  isFeatured,
}: {
  id: string;
  status: JourneyStatus;
  isFeatured: boolean;
}) {
  const publish = usePublishJourney(id);
  const archive = useArchiveJourney(id);
  const feature = useFeatureJourney(id);
  const unfeature = useUnfeatureJourney(id);

  return (
    <div className="flex justify-end gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={`/admin/journeys/${id}/edit`}>Edit</Link>
      </Button>
      {status !== "PUBLISHED" && (
        <Button size="sm" onClick={() => publish.mutate()} isLoading={publish.isPending}>
          Publish
        </Button>
      )}
      {status !== "ARCHIVED" && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => archive.mutate()}
          isLoading={archive.isPending}
        >
          Archive
        </Button>
      )}
      {status === "PUBLISHED" &&
        (isFeatured ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => unfeature.mutate()}
            isLoading={unfeature.isPending}
          >
            Unfeature
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => feature.mutate()}
            isLoading={feature.isPending}
          >
            Feature
          </Button>
        ))}
    </div>
  );
}

export default function AdminJourneysPage() {
  const { data: journeys, isLoading } = useJourneys();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold">Journeys</h1>
        <Button asChild>
          <Link href="/admin/journeys/new">New Journey</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : journeys && journeys.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No journeys yet"
          description="Create your first journey to get started."
        >
          <Button asChild>
            <Link href="/admin/journeys/new">New Journey</Link>
          </Button>
        </EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {journeys?.map((journey) => (
              <TableRow key={journey.id}>
                <TableCell className="font-medium">
                  <span className="flex items-center gap-1.5">
                    {journey.isFeatured ? (
                      <Star
                        className="size-3.5 fill-discovery text-discovery"
                        aria-label="Featured"
                      />
                    ) : null}
                    {journey.title}
                  </span>
                </TableCell>
                <TableCell>{journey.difficulty}</TableCell>
                <TableCell>
                  <JourneyStatusBadge status={journey.status} />
                </TableCell>
                <TableCell>{new Date(journey.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <JourneyRowActions
                    id={journey.id}
                    status={journey.status}
                    isFeatured={journey.isFeatured}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
