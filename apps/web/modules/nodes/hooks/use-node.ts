"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNode } from "../services/nodes-api";

export function useNode(journeyId: string, id: string) {
  return useQuery({
    queryKey: ["journeys", journeyId, "nodes", id],
    queryFn: () => fetchNode(journeyId, id),
  });
}
