"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeNodeImage, uploadNodeImage } from "../services/nodes-api";

export function useUploadNodeImage(journeyId: string, nodeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadNodeImage(nodeId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes", nodeId] });
      toast.success("Image uploaded");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRemoveNodeImage(journeyId: string, nodeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeNodeImage(nodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "nodes", nodeId] });
      toast.success("Image removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
