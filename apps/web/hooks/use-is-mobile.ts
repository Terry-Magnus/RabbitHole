"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 639px)";

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

// Matches the ≤599px tier in context/ui-context.md's Responsive table (the
// one where the Rope becomes a bottom sheet and a bottom action bar
// appears) — rounded up to Tailwind's own `sm` breakpoint (640px) rather
// than a bespoke value. useSyncExternalStore, not an effect + setState:
// this is exactly what it's for — an external browser API (matchMedia)
// that isn't available during SSR, without a synchronous-setState-in-
// effect lint violation or a client/server hydration mismatch.
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
