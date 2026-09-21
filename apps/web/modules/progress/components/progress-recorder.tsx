"use client";

import { useEffect } from "react";

import { authClient } from "@/modules/auth/lib/auth-client";
import { recordNodeProgress } from "../services/progress-api";

interface ProgressRecorderProps {
  journeySlug: string;
  nodePosition: number;
}

// Renders nothing — a pure side-effect component, the same "genuine
// user-interaction/lifecycle reason to opt out of the Server Component
// default" pattern Unit 8 used for DiscoveryLinks. Checks for a session
// first so a guest never triggers a network call at all, let alone one
// that would 401.
export function ProgressRecorder({ journeySlug, nodePosition }: ProgressRecorderProps) {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session) {
      return;
    }

    void recordNodeProgress(journeySlug, nodePosition);
  }, [journeySlug, nodePosition, session]);

  return null;
}
