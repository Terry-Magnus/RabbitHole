"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createNode, deleteNode, reorderNodes, updateNode } from "../services/nodes-api";
import type { CreateNodeInput, UpdateNodeInput } from "../types/node";

export function useCreateNode(journeyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNodeInput) => createNode(journeyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes"] });
      toast.success("Node created");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateNode(journeyId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateNodeInput) => updateNode(journeyId, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes"] });
      toast.success("Node saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteNode(journeyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNode(journeyId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes"] });
      toast.success("Node deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useReorderNodes(journeyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nodeIds: string[]) => reorderNodes(journeyId, nodeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
