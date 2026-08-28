"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJourney } from "../services/journeys-api";

export function useJourney(id: string) {
  return useQuery({
    queryKey: ["journeys", id],
    queryFn: () => fetchJourney(id),
  });
}
