"use client";

import { useEffect } from "react";

import { authClient } from "@/modules/auth/lib/auth-client";
import { markJourneyComplete } from "../services/progress-api";

interface ProgressCompleterProps {
  journeySlug: string;
}

// Same shape as ProgressRecorder, mounted on the completion page instead.
// Upserts on its own rather than depending on the final node's own view
// having been recorded — a dropped request there can't leave a completed
// journey looking unfinished.
export function ProgressCompleter({ journeySlug }: ProgressCompleterProps) {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session) {
      return;
    }

    void markJourneyComplete(journeySlug);
  }, [journeySlug, session]);

  return null;
}
