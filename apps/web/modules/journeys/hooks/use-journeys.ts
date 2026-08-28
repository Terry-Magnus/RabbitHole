"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJourneys } from "../services/journeys-api";

export function useJourneys() {
  return useQuery({
    queryKey: ["journeys"],
    queryFn: fetchJourneys,
  });
}
