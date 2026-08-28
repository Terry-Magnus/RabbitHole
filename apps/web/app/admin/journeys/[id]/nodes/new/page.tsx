"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NodeEditor } from "@/modules/nodes/components/node-editor";
import { useCreateNode } from "@/modules/nodes/hooks/use-node-mutations";

const nodeFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
});

type NodeFormValues = z.infer<typeof nodeFormSchema>;

export default function NewNodePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const createNode = useCreateNode(params.id);

  const form = useForm<NodeFormValues>({
    resolver: zodResolver(nodeFormSchema),
    defaultValues: { title: "", content: "" },
  });

  function handleSubmit(values: NodeFormValues) {
    createNode.mutate(values, {
      onSuccess: () => router.push(`/admin/journeys/${params.id}/edit`),
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-h2 font-bold">New Node</h1>
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
          <Button type="submit" isLoading={createNode.isPending}>
            Create Node
          </Button>
        </form>
      </Form>
    </div>
  );
}
