"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  archiveJourney,
  createJourney,
  featureJourney,
  publishJourney,
  unfeatureJourney,
  updateJourney,
} from "../services/journeys-api";
import type { CreateJourneyInput, UpdateJourneyInput } from "../types/journey";

export function useCreateJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateJourneyInput) => createJourney(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      toast.success("Journey created");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateJourney(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateJourneyInput) => updateJourney(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      toast.success("Journey saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function usePublishJourney(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => publishJourney(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      toast.success("Journey published");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useArchiveJourney(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveJourney(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      toast.success("Journey archived");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useFeatureJourney(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => featureJourney(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      toast.success("Journey featured");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUnfeatureJourney(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unfeatureJourney(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      toast.success("Journey unfeatured");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
