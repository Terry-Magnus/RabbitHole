"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JourneyForm, type JourneyFormValues } from "@/modules/journeys/components/journey-form";
import { JourneyStatusBadge } from "@/modules/journeys/components/journey-status-badge";
import {
  useArchiveJourney,
  usePublishJourney,
  useUpdateJourney,
} from "@/modules/journeys/hooks/use-journey-mutations";
import { useJourney } from "@/modules/journeys/hooks/use-journey";
import { NodeList } from "@/modules/nodes/components/node-list";
import { useNodes } from "@/modules/nodes/hooks/use-nodes";
import { estimateReadingMinutes } from "@/modules/nodes/utils/estimate-reading-minutes";

export default function EditJourneyPage() {
  const params = useParams<{ id: string }>();
  const { data: journey, isLoading } = useJourney(params.id);
  const { data: nodes, isLoading: isLoadingNodes } = useNodes(params.id);
  const updateJourney = useUpdateJourney(params.id);
  const publishJourney = usePublishJourney(params.id);
  const archiveJourney = useArchiveJourney(params.id);

  function handleSubmit(values: JourneyFormValues) {
    updateJourney.mutate(values);
  }

  if (isLoading || !journey) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-h2 font-bold">Edit Journey</h1>
            <JourneyStatusBadge status={journey.status} />
          </div>
          <div className="flex gap-2">
            {journey.status !== "PUBLISHED" && (
              <Button onClick={() => publishJourney.mutate()} isLoading={publishJourney.isPending}>
                Publish
              </Button>
            )}
            {journey.status !== "ARCHIVED" && (
              <Button
                variant="secondary"
                onClick={() => archiveJourney.mutate()}
                isLoading={archiveJourney.isPending}
              >
                Archive
              </Button>
            )}
          </div>
        </div>
        <JourneyForm
          defaultValues={{
            title: journey.title,
            description: journey.description,
            difficulty: journey.difficulty,
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateJourney.isPending}
          submitLabel="Save Changes"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h3 font-bold">Nodes</h2>
            {nodes && nodes.length > 0 && (
              <p className="text-small text-muted-foreground">
                ~{estimateReadingMinutes(nodes)} min read
              </p>
            )}
          </div>
          <Button asChild>
            <Link href={`/admin/journeys/${params.id}/nodes/new`}>Add Node</Link>
          </Button>
        </div>

        {isLoadingNodes ? (
          <Skeleton className="h-24 w-full" />
        ) : nodes && nodes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No nodes yet"
            description="Add the first learning node to start building this journey."
          >
            <Button asChild>
              <Link href={`/admin/journeys/${params.id}/nodes/new`}>Add Node</Link>
            </Button>
          </EmptyState>
        ) : (
          <NodeList journeyId={params.id} nodes={nodes ?? []} />
        )}
      </div>
    </div>
  );
}
