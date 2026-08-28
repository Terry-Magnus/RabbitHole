"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJourneys } from "@/modules/journeys/hooks/use-journeys";
import {
  useCreateDiscoveryLink,
  useDeleteDiscoveryLink,
} from "../hooks/use-discovery-link-mutations";
import type { DiscoveryLink } from "../types/discovery-link";

const MAX_LINKS_PER_NODE = 3;

interface DiscoveryLinkListProps {
  journeyId: string;
  nodeId: string;
  links: DiscoveryLink[];
}

export function DiscoveryLinkList({ journeyId, nodeId, links }: DiscoveryLinkListProps) {
  const [targetJourneyId, setTargetJourneyId] = useState("");
  const [label, setLabel] = useState("");
  const { data: journeys } = useJourneys();
  const createLink = useCreateDiscoveryLink(nodeId);
  const deleteLink = useDeleteDiscoveryLink(nodeId);

  const availableTargets = (journeys ?? []).filter(
    (journey) => journey.status === "PUBLISHED" && journey.id !== journeyId,
  );
  const atLimit = links.length >= MAX_LINKS_PER_NODE;

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!targetJourneyId) {
      return;
    }

    createLink.mutate(
      { targetJourneyId, label: label.trim() || undefined },
      {
        onSuccess: () => {
          setTargetJourneyId("");
          setLabel("");
        },
      },
    );
  }

  return (
    <div className="space-y-3">
      {links.length > 0 ? (
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
            >
              <div className="space-y-0.5">
                <p className="text-small text-foreground">
                  {link.label ?? link.targetJourney.title}
                </p>
                <p className="text-caption text-muted-foreground">
                  {link.targetJourney.title}
                  {link.targetJourney.status !== "PUBLISHED" ? (
                    <span className="text-destructive"> — {link.targetJourney.status.toLowerCase()}</span>
                  ) : null}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => deleteLink.mutate(link.id)}
                isLoading={deleteLink.isPending}
                aria-label="Remove discovery link"
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {atLimit ? (
        <p className="text-caption text-muted-foreground">
          A node can have at most {MAX_LINKS_PER_NODE} discovery links. Remove one to add another.
        </p>
      ) : (
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <label className="text-caption text-muted-foreground" htmlFor="discovery-link-target">
              Journey
            </label>
            <Select value={targetJourneyId} onValueChange={setTargetJourneyId}>
              <SelectTrigger id="discovery-link-target" className="w-56">
                <SelectValue placeholder="Choose a journey" />
              </SelectTrigger>
              <SelectContent>
                {availableTargets.map((journey) => (
                  <SelectItem key={journey.id} value={journey.id}>
                    {journey.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-caption text-muted-foreground" htmlFor="discovery-link-label">
              Label (optional)
            </label>
            <Input
              id="discovery-link-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Curious how vaccines train your immune system?"
            />
          </div>
          <Button type="submit" size="sm" isLoading={createLink.isPending}>
            Add link
          </Button>
        </form>
      )}
    </div>
  );
}
