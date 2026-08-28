"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createDiscoveryLink,
  deleteDiscoveryLink,
  updateDiscoveryLink,
} from "../services/discovery-links-api";
import type { CreateDiscoveryLinkInput, UpdateDiscoveryLinkInput } from "../types/discovery-link";

export function useCreateDiscoveryLink(nodeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDiscoveryLinkInput) => createDiscoveryLink(nodeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes", nodeId, "discovery-links"] });
      toast.success("Discovery link added");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateDiscoveryLink(nodeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDiscoveryLinkInput }) =>
      updateDiscoveryLink(nodeId, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes", nodeId, "discovery-links"] });
      toast.success("Discovery link updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteDiscoveryLink(nodeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDiscoveryLink(nodeId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes", nodeId, "discovery-links"] });
      toast.success("Discovery link removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
