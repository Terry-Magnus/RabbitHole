"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSource, deleteSource, updateSource } from "../services/nodes-api";
import type { CreateSourceInput, UpdateSourceInput } from "../types/node";

export function useCreateSource(journeyId: string, nodeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSourceInput) => createSource(nodeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes", nodeId] });
      toast.success("Source added");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateSource(journeyId: string, nodeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSourceInput }) =>
      updateSource(nodeId, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes", nodeId] });
      toast.success("Source updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteSource(journeyId: string, nodeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSource(nodeId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes", nodeId] });
      toast.success("Source removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
