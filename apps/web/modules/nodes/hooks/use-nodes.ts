"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNodes } from "../services/nodes-api";

export function useNodes(journeyId: string) {
  return useQuery({
    queryKey: ["journeys", journeyId, "nodes"],
    queryFn: () => fetchNodes(journeyId),
  });
}
