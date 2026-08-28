"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDiscoveryLinks } from "../services/discovery-links-api";

export function useDiscoveryLinks(nodeId: string) {
  return useQuery({
    queryKey: ["nodes", nodeId, "discovery-links"],
    queryFn: () => fetchDiscoveryLinks(nodeId),
  });
}
