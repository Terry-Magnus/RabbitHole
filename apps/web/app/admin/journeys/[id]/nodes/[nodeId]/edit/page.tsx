"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DiscoveryLinkList } from "@/modules/discovery/components/discovery-link-list";
import { useDiscoveryLinks } from "@/modules/discovery/hooks/use-discovery-links";
import { JourneyDifficultyBadge } from "@/modules/journeys/components/journey-difficulty-badge";
import { useJourney } from "@/modules/journeys/hooks/use-journey";
import { NodeEditor } from "@/modules/nodes/components/node-editor";
import { NodeImageField } from "@/modules/nodes/components/node-image-field";
import { SourceList } from "@/modules/nodes/components/source-list";
import { useUpdateNode } from "@/modules/nodes/hooks/use-node-mutations";
import { useNode } from "@/modules/nodes/hooks/use-node";

const nodeFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  // Empty string means "not set" here; converted to null on submit since
  // the backend's ahaMoment is optional/nullable, not an empty string.
  ahaMoment: z.string().max(500, "Keep it to one short line").optional(),
});

type NodeFormValues = z.infer<typeof nodeFormSchema>;

export default function EditNodePage() {
  const params = useParams<{ id: string; nodeId: string }>();
  const { data: journey } = useJourney(params.id);
  const { data: node, isLoading } = useNode(params.id, params.nodeId);
  const { data: discoveryLinks } = useDiscoveryLinks(params.nodeId);
  const updateNode = useUpdateNode(params.id, params.nodeId);

  const form = useForm<NodeFormValues>({
    resolver: zodResolver(nodeFormSchema),
    defaultValues: { title: "", content: "", ahaMoment: "" },
  });

  useEffect(() => {
    if (node) {
      form.reset({ title: node.title, content: node.content, ahaMoment: node.ahaMoment ?? "" });
    }
    // form is stable across renders (react-hook-form guarantees this), so it's
    // intentionally left out of the dependency array to avoid re-running on
    // every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  function handleSubmit(values: NodeFormValues) {
    updateNode.mutate({
      ...values,
      ahaMoment: values.ahaMoment?.trim() ? values.ahaMoment.trim() : null,
    });
  }

  if (isLoading || !node) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-h2 font-bold">Edit Node</h1>
        {journey && <JourneyDifficultyBadge difficulty={journey.difficulty} />}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <NodeEditor content={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ahaMoment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>The penny that drops (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What does a reader suddenly see?"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" isLoading={updateNode.isPending}>
            Save Changes
          </Button>
        </form>
      </Form>

      <div className="space-y-3">
        <h2 className="text-h4 font-bold">Image</h2>
        <NodeImageField journeyId={params.id} nodeId={params.nodeId} imageUrl={node.imageUrl} />
      </div>

      <div className="space-y-3">
        <h2 className="text-h4 font-bold">Sources</h2>
        <SourceList journeyId={params.id} nodeId={params.nodeId} sources={node.sources} />
      </div>

      <div className="space-y-3">
        <h2 className="text-h4 font-bold">Discovery Links</h2>
        <DiscoveryLinkList
          journeyId={params.id}
          nodeId={params.nodeId}
          links={discoveryLinks ?? []}
        />
      </div>
    </div>
  );
}
